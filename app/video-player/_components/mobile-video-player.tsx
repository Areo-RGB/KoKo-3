'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileSwipeableCard } from '@/components/ui/mobile-swipeable-card';
import { MobileQuickActions, VideoPlayerActions } from '@/components/ui/mobile-quick-actions';
import { MobileBottomSheet } from '@/components/ui/mobile-bottom-sheet';
import { MobilePullToRefresh } from '@/components/ui/mobile-pull-to-refresh';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Heart,
  Share2,
  List,
  ChevronLeft,
  ChevronRight,
  Settings,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileVideoPlayerProps {
  videos: Array<{
    id: string;
    title: string;
    duration: string;
    thumbnail?: string;
    url: string;
  }>;
  currentVideoId: string;
  onVideoSelect: (videoId: string) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreen?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;
  progress?: number;
  currentTime?: number;
  duration?: number;
}

export function MobileVideoPlayer({
  videos,
  currentVideoId,
  onVideoSelect,
  onPlay,
  onPause,
  onVolumeChange,
  onFullscreen,
  onShare,
  onDownload,
  isPlaying = false,
  isMuted = false,
  volume = 1,
  progress = 0,
  currentTime = 0,
  duration = 0,
}: MobileVideoPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentVideo = videos.find(v => v.id === currentVideoId);
  const currentIndex = videos.findIndex(v => v.id === currentVideoId);

  // Auto-hide controls when playing
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, progress]);

  const handleVideoSwipeLeft = () => {
    if (currentIndex < videos.length - 1) {
      onVideoSelect(videos[currentIndex + 1].id);
    }
  };

  const handleVideoSwipeRight = () => {
    if (currentIndex > 0) {
      onVideoSelect(videos[currentIndex - 1].id);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
    setShowControls(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MobilePullToRefresh
      onRefresh={async () => window.location.reload()}
      className="min-h-screen bg-black"
    >
      <div className="relative min-h-screen">
        {/* Video Container */}
        <MobileSwipeableCard
          onSwipeLeft={handleVideoSwipeLeft}
          onSwipeRight={handleVideoSwipeRight}
          className="w-full"
        >
          <div className="relative aspect-video bg-black">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {currentVideo?.thumbnail ? (
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white/50 text-center">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p>Video wird geladen...</p>
                </div>
              )}
            </div>

            {/* Video Overlay Controls */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40',
                'transition-opacity duration-300',
                showControls ? 'opacity-100' : 'opacity-0'
              )}
              onClick={() => setShowControls(!showControls)}
            >
              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.history.back()}
                    className="text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleFavorite}
                      className="text-white hover:bg-white/20"
                    >
                      <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPlaylist(true)}
                      className="text-white hover:bg-white/20"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/50"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-1 bg-white/30 rounded-full">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/80">{formatTime(currentTime)}</span>
                      <span className="text-xs text-white/80">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <VideoPlayerActions
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    isFavorite={isFavorite}
                    isBookmarked={isBookmarked}
                    onPlayPause={handlePlayPause}
                    onMute={() => {}}
                    onSkip={() => handleVideoSwipeLeft()}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleBookmark={handleToggleBookmark}
                    onShare={onShare || (() => {})}
                  />
                </div>
              </div>

              {/* Swipe Indicators */}
              <div className="absolute inset-y-0 flex items-center justify-between px-4 pointer-events-none">
                {currentIndex > 0 && (
                  <ChevronLeft className="h-8 w-8 text-white/50 animate-pulse" />
                )}
                {currentIndex < videos.length - 1 && (
                  <ChevronRight className="h-8 w-8 text-white/50 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </MobileSwipeableCard>

        {/* Video Info */}
        <Card className="mx-4 mt-4 bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <h2 className="text-white text-lg font-semibold mb-2">
              {currentVideo?.title || 'Video wird geladen...'}
            </h2>
            <div className="flex items-center justify-between text-zinc-400 text-sm">
              <span>{currentVideo?.duration || '0:00'}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Heart className={cn('h-4 w-4', isFavorite && 'fill-current text-red-500')} />
                  <span>{isFavorite ? 'Gespeichert' : 'Speichern'}</span>
                </button>
                <button
                  onClick={onShare}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Teilen</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlist Bottom Sheet */}
        <MobileBottomSheet
          isOpen={showPlaylist}
          onClose={() => setShowPlaylist(false)}
          title="Wiedergabeliste"
          height="full"
        >
          <div className="space-y-2">
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => {
                  onVideoSelect(video.id);
                  setShowPlaylist(false);
                }}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-colors',
                  'hover:bg-zinc-800',
                  video.id === currentVideoId && 'bg-zinc-800 text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-12 bg-zinc-700 rounded flex items-center justify-center">
                        <Play className="h-4 w-4 text-zinc-500" />
                      </div>
                    )}
                    {video.id === currentVideoId && isPlaying && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <Pause className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      'font-medium text-sm',
                      video.id === currentVideoId ? 'text-white' : 'text-zinc-300'
                    )}>
                      {video.title}
                    </h3>
                    <p className="text-zinc-500 text-xs">{video.duration}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </MobileBottomSheet>
      </div>
    </MobilePullToRefresh>
  );
}