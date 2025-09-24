import { isImageUrl } from './thumbnail-utils';

const DEFAULT_MIN_RATIO = 0.1;
const DEFAULT_MAX_RATIO = 0.8;
const DEFAULT_QUALITY = 0.82;
const MAX_ATTEMPTS = 3;

const STORAGE_PREFIX = 'video-thumb:v1:';
const MAX_STORED_DATA_URL_LENGTH = 200_000;

let storageRef: Storage | null | undefined;

const resolvedCache = new Map<string, string>();
const inflightCache = new Map<string, Promise<string | null>>();

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  if (storageRef !== undefined) return storageRef;
  try {
    const candidate = window.localStorage;
    const probeKey = `${STORAGE_PREFIX}__probe__`;
    candidate.setItem(probeKey, '1');
    candidate.removeItem(probeKey);
    storageRef = candidate;
  } catch {
    storageRef = null;
  }
  return storageRef ?? null;
}

function storageKeyFor(cacheKey: string): string {
  return `${STORAGE_PREFIX}${cacheKey}`;
}

function readStoredThumbnail(cacheKey: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(storageKeyFor(cacheKey));
  } catch {
    return null;
  }
}

function writeStoredThumbnail(cacheKey: string, dataUrl: string) {
  if (!dataUrl || dataUrl.length > MAX_STORED_DATA_URL_LENGTH) return;
  const storage = getStorage();
  if (!storage) return;

  const key = storageKeyFor(cacheKey);
  try {
    storage.setItem(key, dataUrl);
  } catch {
    try {
      clearStoredThumbnails(storage);
      storage.setItem(key, dataUrl);
    } catch {
      // Swallow quota issues silently; runtime cache will still hold the value.
    }
  }
}

function clearStoredThumbnails(existingStorage?: Storage) {
  const storage = existingStorage ?? getStorage();
  if (!storage) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // Ignore storage errors.
  }
}
export interface RandomFrameThumbnailOptions {
  /** Optional explicit cache key. Defaults to the video URL. */
  cacheKey?: string;
  /** Fixed frame time in seconds. Overrides random sampling when provided. */
  frameTime?: number;
  /** Minimum fraction (0-1) of the duration to consider for random frames. */
  minTimeRatio?: number;
  /** Maximum fraction (0-1) of the duration to consider for random frames. */
  maxTimeRatio?: number;
  /** Target width of the generated thumbnail. Defaults to intrinsic video width. */
  width?: number;
  /** JPEG quality hint for toDataURL. */
  quality?: number;
}
export function resetVideoThumbnailCache() {
  resolvedCache.clear();
  clearStoredThumbnails();
}

export async function generateRandomFrameThumbnail(
  url?: string | null,
  options: RandomFrameThumbnailOptions = {},
): Promise<string | null> {
  if (!url || url.length === 0) return null;
  if (isImageUrl(url)) return url;
  if (typeof window === 'undefined') return null;

  const cacheKey = options.cacheKey ?? url;
  if (resolvedCache.has(cacheKey)) {
    return resolvedCache.get(cacheKey)!;
  }

  const stored = readStoredThumbnail(cacheKey);
  if (stored) {
    resolvedCache.set(cacheKey, stored);
    return stored;
  }

  if (inflightCache.has(cacheKey)) {
    return inflightCache.get(cacheKey)!;
  }

  const task = createThumbnailFromVideo(url, options)
    .then((result) => {
      if (result) {
        resolvedCache.set(cacheKey, result);
        writeStoredThumbnail(cacheKey, result);
      }
      return result;
    })
    .finally(() => {
      inflightCache.delete(cacheKey);
    });

  inflightCache.set(cacheKey, task);
  return task;
}

function createThumbnailFromVideo(
  url: string,
  options: RandomFrameThumbnailOptions,
): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    let attempt = 0;
    let cancelled = false;

    const cleanup = () => {
      cancelled = true;
      video.removeAttribute('src');
      video.load();
    };

    const fail = () => {
      cleanup();
      resolve(null);
    };

    const captureFrame = (): string | null => {
      const intrinsicWidth = video.videoWidth || options.width || 0;
      const intrinsicHeight = video.videoHeight || 0;
      const width = options.width ?? intrinsicWidth;
      const height =
        width && intrinsicWidth
          ? Math.round(width * (intrinsicHeight / intrinsicWidth))
          : intrinsicHeight;

      if (!width || !height) return null;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      try {
        ctx.drawImage(video, 0, 0, width, height);
        const quality = options.quality ?? DEFAULT_QUALITY;
        return canvas.toDataURL('image/jpeg', quality);
      } catch (error) {
        return null;
      }
    };

    const handleSeeked = () => {
      if (cancelled) return;

      const ready = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
      if (!ready) {
        const onLoadedData = () => {
          video.removeEventListener('loadeddata', onLoadedData);
          const dataUrl = captureFrame();
          if (dataUrl) {
            cleanup();
            resolve(dataUrl);
          } else if (attempt < MAX_ATTEMPTS - 1) {
            attempt++;
            scheduleAttempt();
          } else {
            fail();
          }
        };
        video.addEventListener('loadeddata', onLoadedData, { once: true });
        return;
      }

      const dataUrl = captureFrame();
      if (dataUrl) {
        cleanup();
        resolve(dataUrl);
      } else if (attempt < MAX_ATTEMPTS - 1) {
        attempt++;
        scheduleAttempt();
      } else {
        fail();
      }
    };

    const scheduleAttempt = () => {
      if (cancelled) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) {
        fail();
        return;
      }

      const minRatio = clampRatio(options.minTimeRatio, DEFAULT_MIN_RATIO);
      const maxRatio = clampRatio(options.maxTimeRatio, DEFAULT_MAX_RATIO);
      const start = Math.min(
        duration,
        Math.max(0, duration * Math.min(minRatio, maxRatio)),
      );
      const end = Math.min(
        duration,
        Math.max(start + 0.01, duration * Math.max(minRatio, maxRatio)),
      );

      const targetTime =
        typeof options.frameTime === 'number'
          ? clamp(options.frameTime, 0, duration)
          : pickRandomTime(start, end);

      video.removeEventListener('seeked', handleSeeked);
      video.addEventListener('seeked', handleSeeked, { once: true });

      try {
        video.currentTime = targetTime;
      } catch (error) {
        if (attempt < MAX_ATTEMPTS - 1) {
          attempt++;
          scheduleAttempt();
        } else {
          fail();
        }
      }
    };

    const handleLoadedMetadata = () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      scheduleAttempt();
    };

    const handleError = () => {
      video.removeEventListener('error', handleError);
      fail();
    };

    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'auto';
    video.playsInline = true;
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    video.src = url;
    video.load();
  });
}

function pickRandomTime(start: number, end: number) {
  const span = Math.max(0, end - start);
  if (span <= 0.001) return start;
  return start + Math.random() * span;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampRatio(value: number | undefined, fallback: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(0.95, Math.max(0.0, value));
}
