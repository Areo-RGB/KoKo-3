'use client';

import { useEffect, useState } from 'react';

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

const normalizeVideoUrl = (input: string): string => {
  if (!input) {
    return input;
  }

  try {
    const url = new URL(input);
    url.hash = '';
    return url.toString();
  } catch (error) {
    const [withoutHash] = input.split('#');
    return withoutHash;
  }
};

export const useVideoCache = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isSupported: false,
    isRegistered: false,
  });
  const [cachedVideos, setCachedVideos] = useState<VideoCache[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkCacheSupport = async () => {
      const isSupported = 'serviceWorker' in navigator && 'caches' in window;
      const isRegistered =
        isSupported &&
        (await navigator.serviceWorker.getRegistration()) !== undefined;

      let estimate;
      if (
        isSupported &&
        'storage' in navigator &&
        'estimate' in navigator.storage
      ) {
        const storageEstimate = await navigator.storage.estimate();
        estimate = {
          quota: storageEstimate.quota,
          usage: storageEstimate.usage,
          usagePercent: storageEstimate.quota
            ? ((storageEstimate.usage || 0) / storageEstimate.quota) * 100
            : 0,
        };
      }

      setCacheStatus({ isSupported, isRegistered, estimate });
    };

    checkCacheSupport();
  }, []);

  /**
   * Cache a video URL for offline access
   */
  const cacheVideo = async (url: string): Promise<boolean> => {
    const normalizedUrl = normalizeVideoUrl(url);

    if (!cacheStatus.isSupported) {
      console.warn('Cache API not supported');
      return false;
    }

    try {
      if (await isVideoCached(normalizedUrl)) {
        await updateCachedVideosList();
        return true;
      }

      const cache = await caches.open('video-cache-v1');

      // Use put() instead of add() to handle CORS and network issues better
      const response = await fetch(normalizedUrl, {
        mode: 'cors',
        credentials: 'omit',
      });

      if (response.ok || response.status === 206) {
        await cache.put(normalizedUrl, response.clone());

        // Also message the service worker to cache it
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_VIDEO',
            url: normalizedUrl,
          });
        }

        // Update cached videos list
        await updateCachedVideosList();
        return true;
      }

      console.warn(
        `Failed to cache ${normalizedUrl}: ${response.status} ${response.statusText}`,
      );
      return false;
    } catch (error) {
      console.error('Failed to cache video:', normalizedUrl, error);
      return false;
    }
  };

  /**
   * Cache multiple videos
   */
  const cacheVideos = async (
    urls: string[],
  ): Promise<{
    success: number;
    failed: number;
  }> => {
    let success = 0;
    let failed = 0;

    for (const url of urls) {
      // Add a small delay between requests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await cacheVideo(url);
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  };

  /**
   * Check if a specific video is cached
   */
  const isVideoCached = async (url: string): Promise<boolean> => {
    const normalizedUrl = normalizeVideoUrl(url);

    if (!cacheStatus.isSupported) return false;

    try {
      const cache = await caches.open('video-cache-v1');
      const response = await cache.match(normalizedUrl);
      return response !== undefined;
    } catch (error) {
      console.error('Failed to check cache status:', error);
      return false;
    }
  };

  /**
   * Remove a video from cache
   */
  const uncacheVideo = async (url: string): Promise<boolean> => {
    const normalizedUrl = normalizeVideoUrl(url);

    if (!cacheStatus.isSupported) return false;

    try {
      const cache = await caches.open('video-cache-v1');
      const deleted = await cache.delete(normalizedUrl);
      await updateCachedVideosList();
      return deleted;
    } catch (error) {
      console.error('Failed to remove video from cache:', error);
      return false;
    }
  };

  /**
   * Clear all video cache
   */
  const clearVideoCache = async (): Promise<boolean> => {
    if (!cacheStatus.isSupported) return false;

    try {
      const deleted = await caches.delete('video-cache-v1');

      // Message service worker to clear cache
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE',
          cacheName: 'video-cache-v1',
        });
      }

      setCachedVideos([]);
      return deleted;
    } catch (error) {
      console.error('Failed to clear video cache:', error);
      return false;
    }
  };

  /**
   * Get list of all cached videos
   */
  const updateCachedVideosList = async () => {
    if (!cacheStatus.isSupported) return;

    try {
      const cache = await caches.open('video-cache-v1');
      const requests = await cache.keys();

      const videos: VideoCache[] = requests
        .filter((req) => {
          const url = req.url.toLowerCase();
          return (
            url.endsWith('.mp4') ||
            url.endsWith('.webm') ||
            url.endsWith('.mov') ||
            url.endsWith('.m4v')
          );
        })
        .map((req) => ({
          url: normalizeVideoUrl(req.url),
        }));

      setCachedVideos(videos);
    } catch (error) {
      console.error('Failed to get cached videos:', error);
    }
  };

  /**
   * Get cache storage usage information
   */
  const getCacheInfo = async (): Promise<{
    size: number;
    count: number;
  }> => {
    if (!cacheStatus.isSupported) {
      return { size: 0, count: 0 };
    }

    try {
      const cache = await caches.open('video-cache-v1');
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
  };

  /**
   * Format bytes to human readable string
   */
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return {
    cacheStatus,
    cachedVideos,
    cacheVideo,
    cacheVideos,
    isVideoCached,
    uncacheVideo,
    clearVideoCache,
    updateCachedVideosList,
    getCacheInfo,
    formatBytes,
  };
};
