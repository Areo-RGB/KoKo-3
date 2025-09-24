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
      <div className="aspect-video w-full bg-black flex items-center justify-center rounded-lg">
        <div className="text-center text-red-400 p-4">
          <p className="text-lg font-semibold mb-2">⚠️ Video Ladefehler</p>
          <p className="text-sm text-gray-300 mb-4">
            Die Videodatei konnte nicht geladen werden.
          </p>
          <p className="text-xs text-gray-500 break-all">{videoUrl}</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black relative rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
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
        className="w-full h-full"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onLoadStart={handleLoadStart}
      ></video>
    </div>
  );
}
