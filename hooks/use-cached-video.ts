'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CachedVideoState {
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isCached: boolean;
  progress: number;
}

const activeBlobUrls = new Set<string>();

/**
 * Hook to load videos through the Service Worker Cache API
 * Returns a blob URL that can be used as video src
 * Automatically handles caching, loading states, and cleanup
 */
export function useCachedVideo(
  videoUrl: string | null | undefined,
): CachedVideoState {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [progress, setProgress] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const previousBlobUrlRef = useRef<string | null>(null);

  const loadVideo = useCallback(async (url: string) => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('New video load initiated');
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // First, try to get from cache
      const cached = await caches.match(url);

      if (cached) {
        setIsCached(true);
        const blob = await cached.blob();
        const objectUrl = URL.createObjectURL(blob);
        activeBlobUrls.add(objectUrl);
        setBlobUrl(objectUrl);
        setProgress(100);
        setIsLoading(false);
        return;
      }

      // Not in cache, fetch from network
      setIsCached(false);

      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get total size for progress tracking
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      // Read the response as a stream to track progress
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (total > 0) {
          setProgress(Math.round((receivedLength / total) * 100));
        }
      }

      // Concatenate chunks into single Uint8Array
      const allChunks = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }

      // Create blob from the data
      const contentType = response.headers.get('content-type') || 'video/mp4';
      const blob = new Blob([allChunks], { type: contentType });

      // Store in cache for future use
      try {
        const cache = await caches.open('quo-vadis-media-2025-10-09');
        const cacheResponse = new Response(blob, {
          headers: {
            'Content-Type': contentType,
            'Content-Length': String(blob.size),
          },
        });
        await cache.put(url, cacheResponse);
      } catch (cacheError) {
        console.warn('Failed to cache video:', cacheError);
        // Continue even if caching fails
      }

      // Create object URL
      const objectUrl = URL.createObjectURL(blob);
      activeBlobUrls.add(objectUrl);
      setBlobUrl(objectUrl);
      setProgress(100);
      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }

      console.error('Failed to load video:', err);
      setError(err.message || 'Failed to load video');
      setIsLoading(false);
    }
  }, []);

  // Load video when URL changes
  useEffect(() => {
    if (!videoUrl) {
      setBlobUrl(null);
      setIsLoading(false);
      setError(null);
      setIsCached(false);
      setProgress(0);
      return;
    }

    loadVideo(videoUrl);
  }, [videoUrl, loadVideo]);

  // Cleanup blob URLs when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (
        previousBlobUrlRef.current &&
        activeBlobUrls.has(previousBlobUrlRef.current)
      ) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
        activeBlobUrls.delete(previousBlobUrlRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort('Component unmounting');
      }
    };
  }, []);

  // Track the previous blob URL for cleanup
  useEffect(() => {
    if (blobUrl !== previousBlobUrlRef.current) {
      // Clean up previous blob URL
      if (
        previousBlobUrlRef.current &&
        activeBlobUrls.has(previousBlobUrlRef.current)
      ) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
        activeBlobUrls.delete(previousBlobUrlRef.current);
      }
      previousBlobUrlRef.current = blobUrl;
    }
  }, [blobUrl]);

  return {
    blobUrl,
    isLoading,
    error,
    isCached,
    progress,
  };
}

/**
 * Cleanup function to revoke all active blob URLs
 * Call this when the app is unmounting or on route changes
 */
export function cleanupAllBlobUrls() {
  activeBlobUrls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      // Ignore errors during cleanup
    }
  });
  activeBlobUrls.clear();
}
