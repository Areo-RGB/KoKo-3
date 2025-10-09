'use client';

import { useCallback, useRef, useState } from 'react';

export interface BulkDownloadProgress {
  isDownloading: boolean;
  total: number;
  completed: number;
  failed: number;
  currentUrl: string | null;
  bytesDownloaded: number;
  errors: Array<{ url: string; error: string }>;
}

/**
 * Hook for bulk downloading videos for offline use
 * Uses the same caching mechanism as useCachedVideo
 */
export function useBulkVideoDownload() {
  const [progress, setProgress] = useState<BulkDownloadProgress>({
    isDownloading: false,
    total: 0,
    completed: 0,
    failed: 0,
    currentUrl: null,
    bytesDownloaded: 0,
    errors: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const downloadVideo = async (
    url: string,
    cacheName: string,
  ): Promise<{ success: boolean; size: number; error?: string }> => {
    try {
      // Check if already cached
      const cached = await caches.match(url);
      if (cached) {
        const blob = await cached.blob();
        return { success: true, size: blob.size };
      }

      // Download from network
      const controller = abortControllerRef.current;
      const response = await fetch(url, {
        signal: controller?.signal,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const size = contentLength ? parseInt(contentLength, 10) : 0;

      // Read response body
      const blob = await response.blob();

      // Store in cache
      const cache = await caches.open(cacheName);
      const contentType = response.headers.get('content-type') || 'video/mp4';
      const cacheResponse = new Response(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(blob.size),
        },
      });
      await cache.put(url, cacheResponse);

      return { success: true, size: blob.size };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return { success: false, size: 0, error: 'Aborted' };
      }
      return {
        success: false,
        size: 0,
        error: error.message || 'Unknown error',
      };
    }
  };

  const startBulkDownload = useCallback(
    async (
      urls: string[],
      cacheName: string = 'quo-vadis-media-2025-10-09',
    ) => {
      if (progress.isDownloading) {
        return;
      }

      // Create abort controller
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Initialize progress
      setProgress({
        isDownloading: true,
        total: urls.length,
        completed: 0,
        failed: 0,
        currentUrl: null,
        bytesDownloaded: 0,
        errors: [],
      });

      let completed = 0;
      let failed = 0;
      let bytesDownloaded = 0;
      const errors: Array<{ url: string; error: string }> = [];

      // Download videos sequentially to avoid overwhelming the network
      for (const url of urls) {
        if (controller.signal.aborted) {
          break;
        }

        setProgress((prev) => ({
          ...prev,
          currentUrl: url,
        }));

        const result = await downloadVideo(url, cacheName);

        if (result.success) {
          completed++;
          bytesDownloaded += result.size;
        } else {
          failed++;
          if (result.error && result.error !== 'Aborted') {
            errors.push({ url, error: result.error });
          }
        }

        setProgress({
          isDownloading: !controller.signal.aborted,
          total: urls.length,
          completed,
          failed,
          currentUrl: url,
          bytesDownloaded,
          errors,
        });
      }

      // Final update
      setProgress((prev) => ({
        ...prev,
        isDownloading: false,
        currentUrl: null,
      }));

      abortControllerRef.current = null;
    },
    [progress.isDownloading],
  );

  const cancelDownload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({
      isDownloading: false,
      total: 0,
      completed: 0,
      failed: 0,
      currentUrl: null,
      bytesDownloaded: 0,
      errors: [],
    });
  }, []);

  return {
    progress,
    startBulkDownload,
    cancelDownload,
    resetProgress,
  };
}
