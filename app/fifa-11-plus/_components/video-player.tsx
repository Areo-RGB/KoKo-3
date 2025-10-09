'use client';

import { useCachedVideo } from '@/hooks/use-cached-video';
import { Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  startTime?: number;
}

export default function VideoPlayer({
  videoUrl,
  startTime = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // Use cached video loading
  const {
    blobUrl,
    isLoading: isVideoLoading,
    error: videoError,
    isCached,
  } = useCachedVideo(videoUrl);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video loading error:', e);
    setHasError(true);
  };

  // Show error from video loading or playback
  if (hasError || videoError) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-black">
        <div className="p-4 text-center text-red-400">
          <p className="mb-2 text-lg font-semibold">⚠️ Video Ladefehler</p>
          <p className="mb-4 text-sm text-gray-300">
            {videoError || 'Die Videodatei konnte nicht geladen werden.'}
          </p>
          <p className="text-xs break-all text-gray-500">{videoUrl}</p>
          <button
            onClick={() => {
              setHasError(false);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 rounded-md px-4 py-2 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      {isVideoLoading && (
        <div className="bg-opacity-75 absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-white" />
          <p className="text-sm text-white">
            {isCached ? 'Lade aus Cache...' : 'Lade Video...'}
          </p>
        </div>
      )}
      <video
        ref={videoRef}
        src={blobUrl || ''}
        controls
        playsInline
        autoPlay
        className="h-full w-full"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
      ></video>
    </div>
  );
}
