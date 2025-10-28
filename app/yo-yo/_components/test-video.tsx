'use client';

import React, { useRef, useEffect, useState } from 'react';

interface TestVideoProps {
  isPlaying: boolean;
  onVideoEnd?: () => void;
  className?: string;
}

export function TestVideo({ isPlaying, onVideoEnd, className = '' }: TestVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      if (onVideoEnd) {
        onVideoEnd();
      }
    };

    const handleVideoError = (e: Event) => {
      console.error('Video error:', e);
      setVideoError('Video konnte nicht geladen werden');
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [onVideoEnd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.currentTime = 0;
      video.play().catch((error) => {
        console.error('Error playing video:', error);
        setVideoError('Video konnte nicht abgespielt werden');
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isPlaying]);

  if (videoError) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg border ${className}`}>
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-muted-foreground">{videoError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg border"
        playsInline
        muted={false} // Keep audio enabled for testing
        controls={false} // Hide controls to sync with test
        preload="metadata"
      >
        <source
          src="https://data-h03.fra1.cdn.digitaloceanspaces.com/yo2.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Video status indicator */}
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {isPlaying ? '▶️ Spielt' : '⏸️ Pausiert'}
      </div>

      {/* Test video watermark */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Test-Video
      </div>
    </div>
  );
}