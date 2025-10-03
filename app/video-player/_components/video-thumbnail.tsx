'use client';

import { isImageUrl, pickBestThumbnail } from '@/util/thumbnail-utils';
import { cn } from '@/util/utils';
import { generateRandomFrameThumbnail } from '@/util/video-frame-thumbnail';
import { Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { VideoData } from '../_lib/video-data';

interface VideoThumbnailProps {
  /** The video data object used to find a thumbnail source. */
  video: VideoData;
  /** Optional additional class names for the root element. */
  className?: string;
}

/**
 * A robust thumbnail component for displaying a video preview.
 *
 * It attempts to find the best possible thumbnail using a fallback strategy:
 * 1. An explicit image URL from `pickBestThumbnail`.
 * 2. A client-side generated frame from the video source via `generateRandomFrameThumbnail`.
 * 3. The video element itself, showing the first frame.
 * If all methods fail, it renders an empty container.
 */
export default function VideoThumbnail({
  video,
  className,
}: VideoThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const [generatedThumb, setGeneratedThumb] = useState<string | null>(null);

  /**
   * Memoized value for the preferred, explicit thumbnail URL.
   * This is the highest priority image source.
   */
  const preferredImageUrl = useMemo(
    () => pickBestThumbnail(video) ?? undefined,
    [video],
  );

  /**
   * Determines the primary video source URL from the video data,
   * checking the root `videoUrl` and then the first chapter's `videoUrl`.
   * This source is used for both the video element fallback and for generating a thumbnail.
   */
  const primaryVideoSource = useMemo(() => {
    if (video.videoUrl && video.videoUrl.length > 0) {
      return video.videoUrl;
    }
    const chapterWithSource = video.chapters.find(
      (chapter) =>
        typeof chapter.videoUrl === 'string' && chapter.videoUrl.length > 0,
    );
    return chapterWithSource?.videoUrl;
  }, [video]);

  /**
   * Effect to reset the error and generated thumbnail state whenever the video ID changes,
   * ensuring the component displays fresh data when the `video` prop is updated.
   */
  useEffect(() => {
    setGeneratedThumb(null);
    setHasError(false);
  }, [video.id]);

  /**
   * Effect to generate a thumbnail from the video source if no preferred image is available.
   * The generated thumbnail is cached to avoid re-processing the same video.
   */
  useEffect(() => {
    // Do not generate if a preferred image URL already exists or there's no video source.
    if (preferredImageUrl || !primaryVideoSource) {
      return;
    }

    let isActive = true;

    generateRandomFrameThumbnail(primaryVideoSource, {
      cacheKey: video.id,
    })
      .then((dataUrl) => {
        if (isActive && dataUrl) {
          setHasError(false);
          setGeneratedThumb(dataUrl);
        }
      })
      .catch(() => {
        // Errors are ignored, allowing fallback to the <video> element.
        if (isActive) {
          // You could optionally set an error state here if the <video> fallback
          // is also undesirable. For now, we fail silently.
        }
      });

    return () => {
      isActive = false;
    };
  }, [preferredImageUrl, primaryVideoSource, video.id]);

  // Determine the final URL to be used for an <img> tag.
  const imageUrl = generatedThumb || preferredImageUrl;
  const isImage =
    !!imageUrl && (imageUrl.startsWith('data:image') || isImageUrl(imageUrl));

  return (
    <div
      className={cn('group bg-muted/40 relative overflow-hidden', className)}
    >
      <div className="aspect-video w-full">
        {isImage && !hasError ? (
          // 1 & 2. Render the explicit or generated image thumbnail.
          <img
            src={imageUrl}
            alt={video.title}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : primaryVideoSource ? (
          // 3. Fallback to the video element itself to show the first frame.
          <video
            // Appending #t=0.1 hints to the browser to load the first frame.
            src={`${primaryVideoSource}#t=0.1`}
            preload="metadata"
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            className="pointer-events-none h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : null}
      </div>

      {/* Overlays for UI elements */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-start justify-end p-2">
        <div className="rounded-full bg-black/40 p-1.5 transition-transform duration-200 group-hover:scale-110">
          <Play className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}
