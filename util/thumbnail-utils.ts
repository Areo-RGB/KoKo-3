// util/thumbnail-utils.ts
// Helpers for deriving lightweight thumbnail image URLs from known video URL patterns

const IMAGE_EXT = '.jpg';

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|avi|mov)$/i;

export function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
}

// Try to convert a known video URL into a static image thumbnail URL.
// No network calls are made; callers should handle onError fallback.
export function deriveThumbnailFromVideoUrl(
  url?: string | null,
): string | null {
  if (!url || url.length === 0) return null;

  try {
    // If already an image, return as-is
    if (isImageUrl(url)) return url;

    // General replacement of video extensions → .jpg
    const withImageExt = url.replace(VIDEO_EXT_RE, IMAGE_EXT);

    // Pattern 1: Cloudflare R2 bucket style
    //   https://pub-...r2.dev/Category/Player/filename.mp4
    // → https://pub-...r2.dev/Category/Player/thumbnails/filename.jpg
    if (url.includes('.r2.dev')) {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        const [category, player, filename] = parts.slice(0, 3);
        const thumbName = filename.replace(VIDEO_EXT_RE, IMAGE_EXT);
        return `${u.origin}/${category}/${player}/thumbnails/${thumbName}`;
      }
      return withImageExt;
    }

    // Pattern 2: DigitalOcean Spaces training repo
    //   .../trainings-video/.../clips/01_Name.mp4
    // → .../trainings-video/.../thumbnails/01_Name.jpg
    if (url.includes('/trainings-video/') && url.includes('/clips/')) {
      return url
        .replace('/clips/', '/thumbnails/')
        .replace(VIDEO_EXT_RE, IMAGE_EXT);
    }

    // Pattern 3: Same path, just swap extension
    if (VIDEO_EXT_RE.test(url)) {
      return withImageExt;
    }

    return null;
  } catch {
    return null;
  }
}

// High-level helper for grid cards: choose the best image for a VideoData object.
// The interface is duplicated locally to avoid importing the full module here.
export interface MinimalVideoData {
  thumbnail?: string;
  videoUrl?: string;
  chapters?: Array<{ videoUrl?: string }>;
}

export function pickBestThumbnail(video: MinimalVideoData): string | null {
  if (video.thumbnail && video.thumbnail.trim().length > 0)
    return video.thumbnail;
  const chapterWithUrl = video.chapters?.find(
    (c) => typeof c.videoUrl === 'string' && c.videoUrl!.length > 0,
  );
  if (chapterWithUrl?.videoUrl)
    return deriveThumbnailFromVideoUrl(chapterWithUrl.videoUrl);
  if (video.videoUrl) return deriveThumbnailFromVideoUrl(video.videoUrl);
  return null;
}
