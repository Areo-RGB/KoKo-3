// app/video-player/_components/video-player.tsx
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/util/utils';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PlaylistItem,
  VideoData,
  generatePlaylist,
  getVideoById,
} from '../_lib/video-data';
import PlaylistSidebar from './playlist-sidebar';
import VideoPlayerControls from './video-player-controls';

interface VideoPlayerProps {
  initialVideo?: VideoData;
  initialPlaylist?: PlaylistItem[];
  initialVideoIndex?: number;
  onClose?: () => void;
  className?: string;
}

export default function VideoPlayer({
  initialVideo,
  initialPlaylist,
  initialVideoIndex = 0,
  onClose,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true); // Ref to track initial mount and prevent autoplay

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Playlist state
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistItem[]>(
    initialPlaylist || (initialVideo ? generatePlaylist(initialVideo) : []),
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(initialVideoIndex);
  const [isMobile, setIsMobile] = useState(false);

  // UI state
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const currentItem = currentPlaylist[currentVideoIndex];
  const currentVideo = currentItem ? getVideoById(currentItem.videoId) : null;
  const videoUrl = currentItem?.videoUrl || currentVideo?.videoUrl || '';

  // --- EFFECT FOR MANAGING PLAYBACK ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    // Do not autoplay when the player first opens.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // When the video source changes (via currentVideoIndex),
    // load and play the new video.
    const handleCanPlay = () => {
      video.play().catch((e) => console.error('Autoplay failed:', e));
    };

    // Use 'canplay' event to ensure the video is ready before playing
    video.addEventListener('canplay', handleCanPlay);
    video.load(); // Tell the browser to load the new source

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentVideoIndex, videoUrl]); // Re-run when the video changes

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeout) clearTimeout(controlsTimeout);
    setShowControls(true);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  }, [controlsTimeout]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (typeof currentItem?.startTime === 'number') {
        videoRef.current.currentTime = currentItem.startTime;
      }
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < currentPlaylist.length - 1) {
      handleVideoSelect(
        currentPlaylist[currentVideoIndex + 1],
        currentVideoIndex + 1,
      );
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.src && !video.currentSrc) {
      console.error('Play was attempted, but no video source is available.');
      return;
    }

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((e) => console.error('Error playing video:', e));
    }
  };

  // State update only, playback is handled by the useEffect hook
  const handleVideoSelect = (item: PlaylistItem, index: number) => {
    if (index !== currentVideoIndex) {
      setCurrentVideoIndex(index);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleSkipBack = () => {
    if (currentVideoIndex > 0) {
      handleVideoSelect(
        currentPlaylist[currentVideoIndex - 1],
        currentVideoIndex - 1,
      );
    }
  };

  const handleSkipForward = () => {
    if (currentVideoIndex < currentPlaylist.length - 1) {
      handleVideoSelect(
        currentPlaylist[currentVideoIndex + 1],
        currentVideoIndex + 1,
      );
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleToggleSlowMotion = () => {
    if (videoRef.current) {
      const newRate = playbackRate === 1 ? 0.25 : 1;
      videoRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Logic for keyboard shortcuts
      // ... (omitted for brevity, no changes here)
    },
    [isFullscreen, volume, onClose, handlePlayPause, handleVolumeChange],
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.addEventListener('keydown', handleKeyDown);
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [handleKeyDown, controlsTimeout]);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!videoUrl || !currentItem) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Kein Video ausgewählt</h2>
          <p className="text-gray-400">
            Bitte wählen Sie ein Video aus der Wiedergabeliste.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'video-shell relative h-full min-h-0 w-full',
        isMobile ? 'flex flex-col' : 'flex',
        isFullscreen && 'fixed inset-0 z-50',
        className,
      )}
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      tabIndex={0}
    >
      {/* Main Video Area */}
      <div
        className={cn(
          'relative min-h-0',
          isMobile && !isFullscreen ? '' : 'flex-1',
        )}
      >
        {!isFullscreen && onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            className={cn(
              'absolute z-20 rounded-full bg-black/50 text-white hover:bg-black/70',
              'touch-manipulation',
              isMobile ? 'top-2 right-2 p-3' : 'top-4 right-4 p-2',
            )}
          >
            <X className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
          </Button>
        )}
        <div
          className={cn(
            'relative mx-0 w-full max-w-none bg-black',
            isFullscreen ? 'h-full' : 'aspect-video',
          )}
        >
          <video
            ref={videoRef}
            key={videoUrl}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-contain"
            preload="metadata"
            playsInline
            controls={false}
            onDoubleClick={() => !isMobile && handleToggleFullscreen()}
          />
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-300',
              showControls ? 'opacity-100' : 'opacity-0',
            )}
          >
            <VideoPlayerControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              onPlayPause={handlePlayPause}
              onSeek={(time) =>
                videoRef.current && (videoRef.current.currentTime = time)
              }
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onToggleFullscreen={handleToggleFullscreen}
              onSkipBack={handleSkipBack}
              onSkipForward={handleSkipForward}
              playbackRate={playbackRate}
              onToggleSlowMotion={handleToggleSlowMotion}
              chapters={currentVideo?.chapters}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      {!isFullscreen && (
        <PlaylistSidebar
          currentPlaylist={currentPlaylist}
          currentVideoIndex={currentVideoIndex}
          currentProgress={currentProgress}
          isPlaying={isPlaying}
          onVideoSelect={handleVideoSelect}
          title={currentVideo?.playlistTitle || 'Wiedergabeliste'}
          isMobile={isMobile}
          className={cn(isMobile ? 'min-h-0 w-full flex-1' : 'min-h-0')}
        />
      )}
    </div>
  );
}
