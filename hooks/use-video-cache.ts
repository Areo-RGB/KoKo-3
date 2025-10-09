'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type CacheBucketKind = 'media' | 'pages' | 'static' | 'data' | 'images' | 'fallback';

export interface CacheBucketSummary {
  cacheName: string;
  kind: CacheBucketKind;
  entryCount: number;
  totalBytes: number | null;
  sampleUrls: string[];
}

export interface CacheSummary {
  generatedAt: number;
  caches: CacheBucketSummary[];
}

export type PrefetchStatus = 'idle' | 'running' | 'completed' | 'error' | 'aborted';

export interface PrefetchProgress {
  taskId: string | null;
  label?: string;
  status: PrefetchStatus;
  total: number;
  completed: number;
  failed: number;
  bytesDownloaded: number;
  currentUrl?: string;
  startedAt?: number;
  finishedAt?: number;
  error?: string;
}

interface StorageSnapshot {
  quota?: number;
  usage?: number;
}

const DEFAULT_PROGRESS: PrefetchProgress = {
  taskId: null,
  status: 'idle',
  total: 0,
  completed: 0,
  failed: 0,
  bytesDownloaded: 0,
};

const MESSAGE_TYPES = {
  summaryRequest: 'REQUEST_CACHE_SUMMARY',
  summaryResponse: 'CACHE_SUMMARY',
  prefetch: 'PREFETCH_VIDEOS',
  prefetchUpdate: 'PREFETCH_VIDEOS_UPDATE',
  abort: 'ABORT_PREFETCH',
  clear: 'CLEAR_MEDIA_CACHE',
  cleared: 'CACHE_CLEARED',
} as const;

const isServiceWorkerSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'caches' in window;

export const useVideoCache = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [summary, setSummary] = useState<CacheSummary | null>(null);
  const [storageSnapshot, setStorageSnapshot] = useState<StorageSnapshot | null>(null);
  const [progress, setProgress] = useState<PrefetchProgress>(DEFAULT_PROGRESS);

  const latestTaskId = useRef<string | null>(null);

  const postMessage = useCallback(
    (message: Record<string, unknown>) => {
      if (!isSupported) return;
      const controller = navigator.serviceWorker.controller;
      const target = registration?.active ?? controller;
      if (target && typeof target.postMessage === 'function') {
        target.postMessage(message);
      }
    },
    [isSupported, registration?.active],
  );

  const captureStorageSnapshot = useCallback(async () => {
    if (!isSupported) return;
    if ('storage' in navigator && typeof navigator.storage?.estimate === 'function') {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageSnapshot({ quota: estimate.quota ?? undefined, usage: estimate.usage ?? undefined });
      } catch (error) {
        // ignore storage estimate issues
      }
    }
  }, [isSupported]);

  const requestSummary = useCallback(() => {
    postMessage({ type: MESSAGE_TYPES.summaryRequest });
    captureStorageSnapshot().catch(() => {
      /* noop */
    });
  }, [captureStorageSnapshot, postMessage]);

  useEffect(() => {
    if (!isServiceWorkerSupported()) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    let cancelled = false;

    navigator.serviceWorker.ready
      .then((reg) => {
        if (!cancelled) {
          setRegistration(reg);
        }
      })
      .catch(() => {
        /* noop */
      });

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      const { type, payload } = data as { type?: string; payload?: any };

      switch (type) {
        case MESSAGE_TYPES.prefetchUpdate: {
          if (!payload) return;
          const taskId = payload.taskId ?? null;
          if (latestTaskId.current && taskId && latestTaskId.current !== taskId) {
            return;
          }
          latestTaskId.current = taskId;
          setProgress({
            taskId,
            label: payload.label,
            status: payload.status ?? 'idle',
            total: payload.total ?? 0,
            completed: payload.completed ?? 0,
            failed: payload.failed ?? 0,
            bytesDownloaded: payload.bytesDownloaded ?? 0,
            currentUrl: payload.currentUrl,
            startedAt: payload.startedAt,
            finishedAt: payload.finishedAt,
            error: payload.error,
          });
          break;
        }
        case MESSAGE_TYPES.summaryResponse: {
          if (payload) {
            setSummary(payload as CacheSummary);
          }
          break;
        }
        case MESSAGE_TYPES.cleared: {
          setProgress(DEFAULT_PROGRESS);
          requestSummary();
          break;
        }
        default:
          break;
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      cancelled = true;
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [requestSummary]);

  useEffect(() => {
    if (!isSupported || !registration) return;
    requestSummary();
  }, [isSupported, registration, requestSummary]);

  const prefetchVideos = useCallback(
    async (urls: string[], label = 'videos'): Promise<string | null> => {
      if (!isSupported || urls.length === 0) return null;
      const taskId = `prefetch-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      latestTaskId.current = taskId;
      setProgress({
        ...DEFAULT_PROGRESS,
        taskId,
        label,
        status: 'running',
        total: urls.length,
        startedAt: Date.now(),
      });
      postMessage({ type: MESSAGE_TYPES.prefetch, taskId, urls, label });
      return taskId;
    },
    [isSupported, postMessage],
  );

  const abortPrefetch = useCallback(
    (taskId?: string) => {
      const activeTaskId = taskId ?? latestTaskId.current;
      if (!activeTaskId) return;
      postMessage({ type: MESSAGE_TYPES.abort, taskId: activeTaskId });
    },
    [postMessage],
  );

  const clearVideoCache = useCallback(() => {
    postMessage({ type: MESSAGE_TYPES.clear });
  }, [postMessage]);

  const formatBytes = useCallback((bytes?: number | null) => {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, exponent);
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[exponent]}`;
  }, []);

  const mediaCache = useMemo(() => {
    if (!summary) return null;
    return summary.caches.find((cache) => cache.kind === 'media') ?? null;
  }, [summary]);

  return {
    isSupported,
    registration,
    summary,
    mediaCache,
    storageSnapshot,
    progress,
    prefetchVideos,
    abortPrefetch,
    clearVideoCache,
    requestSummary,
    formatBytes,
  } as const;
};
