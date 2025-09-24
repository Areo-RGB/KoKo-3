'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { VideoChapter } from '@/lib/video-data';
import { cn } from '@/util/utils';
import {
  List,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useState } from 'react';

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  chapters?: VideoChapter[];
  className?: string;
  isMobile?: boolean;
  onTogglePlaylist?: () => void;
  hasPlaylist?: boolean;
  showPlaylist?: boolean;
}

export default function VideoPlayerControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSkipBack,
  onSkipForward,
  chapters = [],
  className,
  isMobile = false,
  onTogglePlaylist,
  hasPlaylist = true,
  showPlaylist = false,
}: VideoPlayerControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressChange = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0] / 100);
  };

  // Generate chapter markers for progress bar
  const chapterMarkers = chapters
    .filter((chapter) => chapter.startTime !== undefined)
    .map((chapter) => ({
      position: (chapter.startTime! / duration) * 100,
      title: chapter.title,
    }));

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent',
        isMobile ? 'pb-safe p-2' : 'p-4',
        className,
      )}
    >
      {/* Progress Bar with Chapter Markers */}
      <div className={cn('relative', isMobile ? 'mb-2' : 'mb-4')}>
        {/* Chapter Markers */}
        {chapterMarkers.map((marker, index) => (
          <div
            key={index}
            className={cn(
              'absolute top-0 z-10 bg-white/60',
              isMobile ? 'h-3 w-1' : 'h-2 w-0.5',
            )}
            style={{ left: `${marker.position}%` }}
            title={marker.title}
          />
        ))}

        {/* Progress Slider */}
        <Slider
          value={[progressPercentage]}
          onValueChange={handleProgressChange}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          max={100}
          step={0.1}
          className={cn(
            'w-full touch-manipulation',
            isMobile
              ? '[--slider-thumb:1.5rem] [--slider-track-h:0.5rem]'
              : '[--slider-thumb:1.25rem] [--slider-track-h:0.375rem]',
          )}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className={cn('flex items-center', isMobile ? 'gap-1' : 'gap-2')}>
          {/* Skip Back */}
          <Button
            variant="ghost"
            size={isMobile ? 'default' : 'sm'}
            onClick={onSkipBack}
            className={cn(
              'touch-manipulation text-white hover:bg-white/20 hover:text-white',
              isMobile ? 'p-3' : 'p-2',
            )}
            aria-label="Skip back 10 seconds"
          >
            <SkipBack className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="ghost"
            size={isMobile ? 'default' : 'sm'}
            onClick={onPlayPause}
            className={cn(
              'touch-manipulation text-white hover:bg-white/20 hover:text-white',
              isMobile ? 'p-3' : 'p-2',
            )}
            aria-label={isPlaying ? 'Pausieren' : 'Abspielen'}
          >
            {isPlaying ? (
              <Pause className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
            ) : (
              <Play className={cn(isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
            )}
          </Button>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size={isMobile ? 'default' : 'sm'}
            onClick={onSkipForward}
            className={cn(
              'touch-manipulation text-white hover:bg-white/20 hover:text-white',
              isMobile ? 'p-3' : 'p-2',
            )}
            aria-label="10 Sekunden vorspulen"
          >
            <SkipForward className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
          </Button>

          {/* Time Display - Hidden on small mobile screens */}
          {!isMobile && (
            <div className="ml-2 font-mono text-sm text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className={cn('flex items-center', isMobile ? 'gap-1' : 'gap-2')}>
          {/* Playlist Toggle */}
          {hasPlaylist && onTogglePlaylist && (
            <Button
              variant="ghost"
              size={isMobile ? 'default' : 'sm'}
              onClick={onTogglePlaylist}
              className={cn(
                'touch-manipulation text-white hover:bg-white/20 hover:text-white',
                isMobile ? 'p-3' : 'p-2',
              )}
              aria-label={
                showPlaylist ? 'Playlist ausblenden' : 'Playlist einblenden'
              }
            >
              <List className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            </Button>
          )}

          {/* Volume Control - Hide slider on mobile, just toggle mute */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => !isMobile && setShowVolumeSlider(true)}
            onMouseLeave={() => !isMobile && setShowVolumeSlider(false)}
          >
            <Button
              variant="ghost"
              size={isMobile ? 'default' : 'sm'}
              onClick={onToggleMute}
              className={cn(
                'touch-manipulation text-white hover:bg-white/20 hover:text-white',
                isMobile ? 'p-3' : 'p-2',
              )}
              aria-label={
                isMuted || volume === 0
                  ? 'Stummschaltung aufheben'
                  : 'Stumm schalten'
              }
            >
              {isMuted || volume === 0 ? (
                <VolumeX className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
              ) : (
                <Volume2 className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
              )}
            </Button>

            {/* Volume Slider - Desktop only */}
            {showVolumeSlider && !isMobile && (
              <div className="absolute bottom-full mb-2 w-24 rounded-lg bg-black/80 p-2">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  orientation="horizontal"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Settings - Hidden on mobile */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-white/20 hover:text-white"
              aria-label="Einstellungen"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size={isMobile ? 'default' : 'sm'}
            onClick={onToggleFullscreen}
            className={cn(
              'touch-manipulation text-white hover:bg-white/20 hover:text-white',
              isMobile ? 'p-3' : 'p-2',
            )}
            aria-label={
              isFullscreen ? 'Vollbild verlassen' : 'Vollbild aktivieren'
            }
          >
            {isFullscreen ? (
              <Minimize className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            ) : (
              <Maximize className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
