import {
  CacheProgress,
  CacheStatus,
  cacheTrainingMaterials as cacheTrainingMaterialsAPI,
  clearCache as clearCacheAPI,
  getAllCaches as getAllCachesAPI,
  getCacheStatus as getCacheStatusAPI,
  getCacheStorageEstimate as getCacheStorageEstimateAPI,
} from '@/lib/cache-manager';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCacheManagerReturn {
  isInitialized: boolean;
  isOnline: boolean;
  isCaching: boolean;
  cacheProgress: CacheProgress | null;
  cacheTrainingMaterials: (ageGroup: string, sessions: any[]) => Promise<void>;
  getCacheStatus: (ageGroup: string) => Promise<CacheStatus | null>;
  clearCache: (ageGroup: string) => Promise<boolean>;
  getAllCaches: () => Promise<Array<{ cacheName: string; size: number }>>;
  storageEstimate: StorageEstimate | null;
  error: string | null;
}

export function useCacheManager(): UseCacheManagerReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState<CacheProgress | null>(
    null,
  );
  const [storageEstimate, setStorageEstimate] =
    useState<StorageEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize cache manager (no Service Worker required)
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitialized(true);
        const estimate = await getCacheStorageEstimateAPI();
        setStorageEstimate(estimate);
      } catch (err) {
        console.error('Failed to initialize cache manager:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to initialize cache manager',
        );
      }
    };

    initialize();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // track mounted to avoid setState after unmount during long caching
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const cacheTrainingMaterials = useCallback(
    async (ageGroup: string, sessions: any[]) => {
      if (!isInitialized) {
        throw new Error('Cache manager not initialized');
      }

      setError(null);
      setIsCaching(true);
      setCacheProgress(null);

      try {
        const result = await cacheTrainingMaterialsAPI(
          ageGroup,
          sessions,
          (p) => {
            if (mountedRef.current) setCacheProgress(p);
          },
        );

        // Update storage estimate after caching
        const estimate = await getCacheStorageEstimateAPI();
        setStorageEstimate(estimate);

        console.log('Caching completed:', result);
      } catch (err) {
        console.error('Caching failed:', err);
        setError(err instanceof Error ? err.message : 'Caching failed');
        throw err;
      } finally {
        setIsCaching(false);
      }
    },
    [isInitialized],
  );

  const getCacheStatus = useCallback(
    async (ageGroup: string): Promise<CacheStatus | null> => {
      if (!isInitialized) return null;

      try {
        setError(null);
        return await getCacheStatusAPI(ageGroup);
      } catch (err) {
        console.error('Failed to get cache status:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to get cache status',
        );
        return null;
      }
    },
    [isInitialized],
  );

  const clearCache = useCallback(
    async (ageGroup: string): Promise<boolean> => {
      if (!isInitialized) return false;

      try {
        setError(null);
        const result = await clearCacheAPI(ageGroup);

        // Update storage estimate after clearing
        const estimate = await getCacheStorageEstimateAPI();
        setStorageEstimate(estimate);

        return result.cleared;
      } catch (err) {
        console.error('Failed to clear cache:', err);
        setError(err instanceof Error ? err.message : 'Failed to clear cache');
        return false;
      }
    },
    [isInitialized],
  );

  const getAllCaches = useCallback(async (): Promise<
    Array<{ cacheName: string; size: number }>
  > => {
    if (!isInitialized) return [];

    try {
      setError(null);
      return await getAllCachesAPI();
    } catch (err) {
      console.error('Failed to get all caches:', err);
      setError(err instanceof Error ? err.message : 'Failed to get all caches');
      return [];
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isOnline,
    isCaching,
    cacheProgress,
    cacheTrainingMaterials,
    getCacheStatus,
    clearCache,
    getAllCaches,
    storageEstimate,
    error,
  };
}
