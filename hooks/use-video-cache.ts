'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CacheStatus {
  isSupported: boolean;
  isRegistered: boolean;
  estimate?: {
    quota?: number;
    usage?: number;
    usagePercent?: number;
  };
}

interface VideoCache {
  url: string;
  size?: number;
  timestamp?: number;
}

type CacheTaskState = 'idle' | 'running' | 'completed' | 'error' | 'aborted';

interface CacheTaskProgress {
  taskId: string | null;
  label?: string;
  status: CacheTaskState;
  total: number;
  completed: number;
  failed: number;
  currentUrl?: string;
  note?: string;
  error?: string;
  message?: string;
  startedAt?: number;
  finishedAt?: number;
}

interface QuotaCheckResult {
  hasSpace: boolean;
  required: number;
  available: number;
  quota: number;
  usage: number;
  quotaPercent: number;
  unknownUrls: string[];
}

interface ServiceWorkerEvent {
  id: string;
  eventName: string;
  detail?: Record<string, unknown>;
  timestamp: number;
}

const PROGRESS_STORAGE_KEY = 'video-cache-progress';
const MAX_SW_EVENTS = 50;
const CACHE_NAME = 'video-cache-v1';

const defaultProgress: CacheTaskProgress = {
  taskId: null,
  status: 'idle',
  total: 0,
  completed: 0,
  failed: 0,
};

const normalizeVideoUrl = (input: string): string => {
  if (!input) return input;

  try {
    const url = new URL(input);
    url.hash = '';
    return url.toString();
  } catch (error) {
    const [withoutHash] = input.split('#');
    return withoutHash;
  }
};

const loadStoredProgress = (): CacheTaskProgress => {
  if (typeof window === 'undefined') return defaultProgress;

  const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) return defaultProgress;

  try {
    const parsed = JSON.parse(stored) as CacheTaskProgress;
    return {
      ...defaultProgress,
      ...parsed,
    };
  } catch (error) {
    return defaultProgress;
  }
};

export const useVideoCache = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isSupported: false,
    isRegistered: false,
  });
  const [cachedVideos, setCachedVideos] = useState<VideoCache[]>([]);
  const [cacheProgress, setCacheProgress] = useState<CacheTaskProgress>(
    loadStoredProgress,
  );
  const [swEvents, setSwEvents] = useState<ServiceWorkerEvent[]>([]);

  const pendingTasksRef = useRef<
    Map<
      string,
      (result: CacheTaskProgress) => void
    >
  >(new Map());

  const persistProgress = useCallback((progress: CacheTaskProgress) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, []);

  const updateProgress = useCallback(
    (updater: CacheTaskProgress | ((prev: CacheTaskProgress) => CacheTaskProgress)) => {
      setCacheProgress((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prev: CacheTaskProgress) => CacheTaskProgress)(prev)
            : updater;
        persistProgress(next);
        return next;
      });
    },
    [persistProgress],
  );

  const refreshCacheStatus = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const isSupported = 'serviceWorker' in navigator && 'caches' in window;
    const registration = isSupported
      ? await navigator.serviceWorker.getRegistration()
      : undefined;

    let estimate;
    if (
      isSupported &&
      'storage' in navigator &&
      typeof navigator.storage?.estimate === 'function'
    ) {
      try {
        const storageEstimate = await navigator.storage.estimate();
        estimate = {
          quota: storageEstimate.quota,
          usage: storageEstimate.usage,
          usagePercent: storageEstimate.quota
            ? ((storageEstimate.usage || 0) / storageEstimate.quota) * 100
            : 0,
        };
      } catch (error) {
        // Ignore estimation issues
      }
    }

    setCacheStatus({
      isSupported,
      isRegistered: Boolean(registration),
      estimate,
    });
  }, []);

  const updateCachedVideosList = useCallback(async () => {
    if (typeof window === 'undefined' || !cacheStatus.isSupported) return;

    try {
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();

      const videos: VideoCache[] = [];
      for (const request of requests) {
        const url = normalizeVideoUrl(request.url);
        videos.push({ url });
      }

      setCachedVideos(videos);
    } catch (error) {
      console.error('Failed to read cached videos:', error);
    }
  }, [cacheStatus.isSupported]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    refreshCacheStatus().catch(() => {
      /* noop */
    });
    updateCachedVideosList().catch(() => {
      /* noop */
    });
  }, [refreshCacheStatus, updateCachedVideosList]);

  const handleServiceWorkerMessage = useCallback(
    (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      const { type, payload } = data;

      if (type === 'CACHE_TASK_UPDATE') {
        updateProgress((prev) => ({
          ...prev,
          ...payload,
          taskId: payload?.taskId ?? prev.taskId,
          status: payload?.status ?? prev.status,
          label: payload?.label ?? prev.label,
          currentUrl: payload?.currentUrl,
          note: payload?.note,
          error: payload?.error,
          message: payload?.message ?? prev.message,
        }));

        if (
          payload?.taskId &&
          ['completed', 'error', 'aborted'].includes(payload.status)
        ) {
          const resolver = pendingTasksRef.current.get(payload.taskId);
          if (resolver) {
            resolver({
              taskId: payload.taskId,
              label: payload.label,
              status: payload.status,
              total: payload.total ?? 0,
              completed: payload.completed ?? 0,
              failed: payload.failed ?? 0,
            });
            pendingTasksRef.current.delete(payload.taskId);
          }

          refreshCacheStatus().catch(() => {});
          updateCachedVideosList().catch(() => {});
        }
      }

      if (type === 'CACHE_TASK_RESULT' && payload?.taskId) {
        const resolver = pendingTasksRef.current.get(payload.taskId);
        if (resolver) {
          resolver(payload);
          pendingTasksRef.current.delete(payload.taskId);
        }
      }

      if (type === 'SW_EVENT') {
        setSwEvents((prev) =>
          [payload as ServiceWorkerEvent, ...prev].slice(0, MAX_SW_EVENTS),
        );
      }

      if (type === 'SW_EVENT_LOG' && Array.isArray(payload)) {
        setSwEvents(
          (payload as ServiceWorkerEvent[]).slice(0, MAX_SW_EVENTS),
        );
      }

      if (type === 'SW_TOAST') {
        const toastPayload = payload as {
          kind?: 'warning' | 'error' | 'info';
          message: string;
          description?: string;
        };

        if (!toastPayload?.message) return;

        if (toastPayload.kind === 'warning') {
          toast.warning(toastPayload.message, {
            description: toastPayload.description,
            duration: 6000,
          });
        } else if (toastPayload.kind === 'error') {
          toast.error(toastPayload.message, {
            description: toastPayload.description,
            duration: 6000,
          });
        } else {
          toast(toastPayload.message, {
            description: toastPayload.description,
            duration: 4000,
          });
        }
      }

      if (type === 'CACHE_CLEARED') {
        refreshCacheStatus().catch(() => {});
        updateCachedVideosList().catch(() => {});
      }
    },
    [refreshCacheStatus, updateCachedVideosList, updateProgress],
  );

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !cacheStatus.isSupported
    ) {
      return;
    }

    navigator.serviceWorker.addEventListener(
      'message',
      handleServiceWorkerMessage,
    );

    navigator.serviceWorker.ready
      .then((registration) => {
        registration.active?.postMessage({ type: 'REQUEST_EVENT_LOG' });
      })
      .catch(() => {
        /* noop */
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    };
  }, [cacheStatus.isSupported, handleServiceWorkerMessage]);

  const postToServiceWorker = useCallback(
    async (message: Record<string, unknown>) => {
      if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
        throw new Error('Service Worker API unavailable');
      }

      const registration = await navigator.serviceWorker.ready;
      const controller =
        navigator.serviceWorker.controller || registration.active;

      if (!controller) {
        throw new Error('Kein aktiver Service Worker gefunden');
      }

      controller.postMessage(message);
    },
    [],
  );

  const waitForVideoCache = useCallback(
    async (url: string, timeoutMs = 2 * 60 * 1000): Promise<boolean> => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (await isVideoCached(url)) {
          return true;
        }
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      return false;
    },
    [],
  );

  const cacheVideos = useCallback(
    async (
      urls: string[],
      options?: {
        label?: string;
      },
    ): Promise<{ success: number; failed: number }> => {
      if (!cacheStatus.isSupported) {
        console.warn('Cache API not supported');
        return { success: 0, failed: urls.length };
      }

      const normalizedUrls = Array.from(
        new Set(
          urls
            .map((url) => normalizeVideoUrl(url))
            .filter((url): url is string => Boolean(url)),
        ),
      );

      if (!normalizedUrls.length) {
        return { success: 0, failed: 0 };
      }

      const taskId = `cache-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

      updateProgress({
        ...defaultProgress,
        taskId,
        label: options?.label,
        status: 'running',
        total: normalizedUrls.length,
        completed: 0,
        failed: 0,
        startedAt: Date.now(),
      });

      try {
        await postToServiceWorker({
          type: 'CACHE_VIDEO_URLS',
          urls: normalizedUrls,
          taskId,
          label: options?.label,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unbekannter Fehler';
        toast.error('Caching fehlgeschlagen', { description: message });
        updateProgress({
          ...defaultProgress,
          status: 'error',
          message,
        });
        return { success: 0, failed: normalizedUrls.length };
      }

      return await new Promise<{ success: number; failed: number }>(
        (resolve) => {
          const timeoutId = window.setTimeout(() => {
            pendingTasksRef.current.delete(taskId);
            updateProgress((prev) => ({
              ...prev,
              status: 'error',
              message: 'Zeitüberschreitung beim Video-Download.',
              finishedAt: Date.now(),
            }));
            resolve({ success: 0, failed: normalizedUrls.length });
          }, 1000 * 60 * 5);

          pendingTasksRef.current.set(taskId, (result) => {
            window.clearTimeout(timeoutId);
            updateProgress((prev) => ({
              ...prev,
              status: result.status,
              completed: result.completed ?? prev.completed,
              failed: result.failed ?? prev.failed,
              finishedAt: Date.now(),
            }));

            refreshCacheStatus().catch(() => {});
            updateCachedVideosList().catch(() => {});

            resolve({
              success: result.completed ?? 0,
              failed: result.failed ?? 0,
            });
          });
        },
      );
    },
    [cacheStatus.isSupported, postToServiceWorker, refreshCacheStatus, updateCachedVideosList, updateProgress],
  );

  const cacheVideo = useCallback(
    async (url: string, options?: { label?: string }) => {
      const { success } = await cacheVideos([url], options);
      return success === 1;
    },
    [cacheVideos],
  );

  const isVideoCached = useCallback(
    async (url: string): Promise<boolean> => {
      const normalizedUrl = normalizeVideoUrl(url);
      if (!cacheStatus.isSupported) return false;

      try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(normalizedUrl);
        return response !== undefined;
      } catch (error) {
        console.error('Failed to check cache status:', error);
        return false;
      }
    },
    [cacheStatus.isSupported],
  );

  const uncacheVideo = useCallback(
    async (url: string): Promise<boolean> => {
      const normalizedUrl = normalizeVideoUrl(url);
      if (!cacheStatus.isSupported) return false;

      try {
        const cache = await caches.open(CACHE_NAME);
        const deleted = await cache.delete(normalizedUrl);
        await updateCachedVideosList();
        await refreshCacheStatus();
        return deleted;
      } catch (error) {
        console.error('Failed to remove video from cache:', error);
        return false;
      }
    },
    [cacheStatus.isSupported, refreshCacheStatus, updateCachedVideosList],
  );

  const clearVideoCache = useCallback(async (): Promise<boolean> => {
    if (!cacheStatus.isSupported) return false;

    try {
      const deleted = await caches.delete(CACHE_NAME);

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE',
          cacheName: CACHE_NAME,
        });
      }

      await updateCachedVideosList();
      await refreshCacheStatus();
      updateProgress(defaultProgress);
      return deleted;
    } catch (error) {
      console.error('Failed to clear video cache:', error);
      return false;
    }
  }, [cacheStatus.isSupported, refreshCacheStatus, updateCachedVideosList, updateProgress]);

  const getCacheInfo = useCallback(async (): Promise<{
    size: number;
    count: number;
  }> => {
    if (!cacheStatus.isSupported) {
      return { size: 0, count: 0 };
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();

      let totalSize = 0;
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }

      return {
        size: totalSize,
        count: requests.length,
      };
    } catch (error) {
      console.error('Failed to get cache info:', error);
      return { size: 0, count: 0 };
    }
  }, [cacheStatus.isSupported]);

  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }, []);

  const estimateRemoteSizes = useCallback(async (urls: string[]) => {
    const uniqueUrls = Array.from(
      new Set(
        urls
          .map((url) => normalizeVideoUrl(url))
          .filter((url): url is string => Boolean(url)),
      ),
    );

    let total = 0;
    const unknown: string[] = [];

    for (const url of uniqueUrls) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'cors',
        });

        if (!response.ok) {
          unknown.push(url);
          continue;
        }

        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const size = Number(contentLength);
          if (!Number.isNaN(size)) {
            total += size;
          } else {
            unknown.push(url);
          }
        } else {
          unknown.push(url);
        }
      } catch (error) {
        unknown.push(url);
      }
    }

    return { total, unknown };
  }, []);

  const checkQuotaBeforeCaching = useCallback(
    async (urls: string[]): Promise<QuotaCheckResult> => {
      if (
        typeof navigator === 'undefined' ||
        !cacheStatus.isSupported ||
        !navigator.storage?.estimate
      ) {
        return {
          hasSpace: true,
          required: 0,
          available: Number.POSITIVE_INFINITY,
          quota: 0,
          usage: 0,
          quotaPercent: 0,
          unknownUrls: [],
        };
      }

      const estimate = await navigator.storage.estimate();
      const available =
        (estimate.quota || 0) - (estimate.usage || 0);

      const { total, unknown } = await estimateRemoteSizes(urls);

      const required = total;
      const hasSpace =
        !estimate.quota || required === 0 || required <= available;

      return {
        hasSpace,
        required,
        available,
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        quotaPercent: estimate.quota
          ? ((estimate.usage || 0) / estimate.quota) * 100
          : 0,
        unknownUrls: unknown,
      };
    },
    [cacheStatus.isSupported, estimateRemoteSizes],
  );

  const cancelActiveTask = useCallback(
    async (taskId?: string) => {
      const activeTaskId = taskId || cacheProgress.taskId;
      if (!activeTaskId) return;

      try {
        await postToServiceWorker({
          type: 'CANCEL_CACHE_TASK',
          taskId: activeTaskId,
        });
      } catch (error) {
        console.warn('Failed to cancel cache task', error);
      }
    },
    [cacheProgress.taskId, postToServiceWorker],
  );

  return {
    cacheStatus,
    cachedVideos,
    cacheVideo,
    cacheVideos,
    cancelActiveTask,
    cacheProgress,
    swEvents,
    isVideoCached,
    uncacheVideo,
    clearVideoCache,
    updateCachedVideosList,
    getCacheInfo,
    formatBytes,
    checkQuotaBeforeCaching,
    waitForVideoCache,
  };
};
