// Cache management utilities for training materials (simplified: no SW messaging)
export interface CacheStatus {
  cacheName: string;
  fileCount: number;
  files: Array<{
    url: string;
    method: string;
  }>;
}

export interface CacheResult {
  ageGroup: string;
  cacheName: string;
  totalSessions: number;
  cachedFiles: number;
  failedFiles: number;
  errors: Array<{
    file?: string;
    session?: string;
    error: string;
    type: string;
  }>;
}

export interface CacheProgress extends CacheResult {
  progress: number; // percentage 0-100
}

const TRAINING_CACHE_PREFIX = 'koko-training-';

export async function cacheTrainingMaterials(
  ageGroup: string,
  sessions: unknown[],
  onProgress?: (p: CacheProgress) => void,
): Promise<CacheResult> {
  const filteredSessions = sessions.filter((session): session is any => {
    return (
      typeof session === 'object' &&
      session !== null &&
      'ageGroup' in session &&
      (session as any).ageGroup === ageGroup &&
      (('htmlPath' in session && (session as any).htmlPath !== 'null') ||
        ('pdfPath' in session && (session as any).pdfPath !== 'null'))
    );
  });

  const cacheName = `${TRAINING_CACHE_PREFIX}${ageGroup.toLowerCase()}`;
  const cache = await caches.open(cacheName);

  const results: CacheResult = {
    ageGroup,
    cacheName,
    totalSessions: filteredSessions.length,
    cachedFiles: 0,
    failedFiles: 0,
    errors: [],
  };

  const postProgress = (progress: number) => {
    if (onProgress) onProgress({ ...results, progress });
  };

  for (let i = 0; i < filteredSessions.length; i++) {
    const session: any = filteredSessions[i];
    const progress = Math.round(((i + 1) / filteredSessions.length) * 100);

    if (session.htmlPath && session.htmlPath !== 'null') {
      try {
        const htmlResponse = await fetch(session.htmlPath);
        if (htmlResponse.ok) {
          await cache.put(session.htmlPath, htmlResponse.clone());
          results.cachedFiles++;
        } else {
          throw new Error(`HTML fetch failed: ${htmlResponse.status}`);
        }
      } catch (error: any) {
        results.failedFiles++;
        results.errors.push({
          file: session.htmlPath,
          error: error?.message ?? String(error),
          type: 'HTML',
        });
      }
    }

    if (session.pdfPath && session.pdfPath !== 'null') {
      try {
        const pdfResponse = await fetch(session.pdfPath);
        if (pdfResponse.ok) {
          await cache.put(session.pdfPath, pdfResponse.clone());
          results.cachedFiles++;
        } else {
          throw new Error(`PDF fetch failed: ${pdfResponse.status}`);
        }
      } catch (error: any) {
        results.failedFiles++;
        results.errors.push({
          file: session.pdfPath,
          error: error?.message ?? String(error),
          type: 'PDF',
        });
      }
    }

    if (i % 10 === 0 || i === filteredSessions.length - 1) {
      postProgress(progress);
    }
  }

  return results;
}

export async function getCacheStatus(ageGroup: string): Promise<CacheStatus> {
  const cacheName = `${TRAINING_CACHE_PREFIX}${ageGroup.toLowerCase()}`;
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  return {
    cacheName,
    fileCount: keys.length,
    files: keys.map((request) => ({
      url: request.url,
      method: request.method,
    })),
  };
}

export async function clearCache(
  ageGroup: string,
): Promise<{ cleared: boolean }> {
  const cacheName = `${TRAINING_CACHE_PREFIX}${ageGroup.toLowerCase()}`;
  const cleared = await caches.delete(cacheName);
  return { cleared };
}

export async function getAllCaches(): Promise<
  Array<{ cacheName: string; size: number }>
> {
  const cacheNames = await caches.keys();
  const trainingCaches = cacheNames.filter((name) =>
    name.startsWith(TRAINING_CACHE_PREFIX),
  );
  const cacheInfo = await Promise.all(
    trainingCaches.map(async (cacheName) => {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      return { cacheName, size: keys.length };
    }),
  );
  return cacheInfo;
}

export async function getCacheStorageEstimate(): Promise<StorageEstimate | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return await navigator.storage.estimate();
  }
  return null;
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Keep the name CacheManager for compatibility where formatBytes is used in UI
export const CacheManager = {
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },
};
