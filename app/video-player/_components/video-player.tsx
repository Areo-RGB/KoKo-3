// app/video-player/_components/video-player.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCachedVideo } from '@/hooks/use-cached-video';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
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
  const [isMuted, setIsMuted] = useState(true);
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
  const baseVideoUrl = currentItem?.videoUrl ?? currentVideo?.videoUrl ?? null;

  // Load video through Service Worker cache
  const {
    blobUrl,
    isLoading: isVideoLoading,
    error: videoError,
    isCached,
  } = useCachedVideo(baseVideoUrl);

  // --- EFFECT FOR MANAGING PLAYBACK ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !blobUrl) return;

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
  }, [currentVideoIndex, blobUrl]); // Re-run when the video changes

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
      // Set video to muted by default
      videoRef.current.muted = true;
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

  const handlePlayPause = useCallback(() => {
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
  }, [isPlaying]);

  // State update only, playback is handled by the useEffect hook
  const handleVideoSelect = (item: PlaylistItem, index: number) => {
    if (index !== currentVideoIndex) {
      setCurrentVideoIndex(index);
      setCurrentTime(0);
    }
  };

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

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
      e.preventDefault();

      // Spacebar: Toggle play/pause
      if (e.code === 'Space') {
        handlePlayPause();
      }
      // M key: Toggle mute
      else if (e.code === 'KeyM') {
        handleToggleMute();
      }
      // Arrow Up: Increase volume
      else if (e.code === 'ArrowUp') {
        handleVolumeChange(Math.min(volume + 0.1, 1));
      }
      // Arrow Down: Decrease volume
      else if (e.code === 'ArrowDown') {
        handleVolumeChange(Math.max(volume - 0.1, 0));
      }
      // Arrow Left: Seek backward
      else if (e.code === 'ArrowLeft') {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 10,
            0,
          );
        }
      }
      // Arrow Right: Seek forward
      else if (e.code === 'ArrowRight') {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.currentTime + 10,
            videoRef.current.duration,
          );
        }
      }
      // F key: Toggle fullscreen
      else if (e.code === 'KeyF') {
        handleToggleFullscreen();
      }
      // Escape: Close player (if not fullscreen)
      else if (e.code === 'Escape' && !isFullscreen) {
        onClose?.();
      }
      // 0-9: Jump to percentage of video (0 = beginning, 1 = 10%, etc.)
      else if (e.code.startsWith('Digit') && !e.shiftKey) {
        const digit = parseInt(e.code.replace('Digit', ''));
        if (!isNaN(digit) && videoRef.current) {
          videoRef.current.currentTime =
            (digit / 10) * videoRef.current.duration;
        }
      }
    },
    [
      isFullscreen,
      volume,
      onClose,
      handlePlayPause,
      handleVolumeChange,
      handleToggleMute,
    ],
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
  const videoSrc = blobUrl ?? baseVideoUrl ?? undefined;

  if (!currentItem || !baseVideoUrl) {
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
          {/* Loading overlay */}
          {isVideoLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-white" />
              <p className="text-sm text-white">
                {isCached ? 'Lade aus Cache...' : 'Lade Video...'}
              </p>
            </div>
          )}
          <video
            ref={videoRef}
            key={blobUrl ?? baseVideoUrl ?? 'video'}
            src={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="h-full w-full object-contain"
            preload="metadata"
            playsInline
            controls={false}
            muted
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
