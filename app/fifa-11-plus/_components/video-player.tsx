'use client';

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
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadedMetadata = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video loading error:', e);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-black">
        <div className="p-4 text-center text-red-400">
          <p className="mb-2 text-lg font-semibold">⚠️ Video Ladefehler</p>
          <p className="mb-4 text-sm text-gray-300">
            Die Videodatei konnte nicht geladen werden.
          </p>
          <p className="text-xs break-all text-gray-500">{videoUrl}</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
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
      {isLoading && (
        <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-sm">Video wird geladen...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        playsInline
        autoPlay
        className="h-full w-full"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={handleLoadStart}
      ></video>
    </div>
  );
}
