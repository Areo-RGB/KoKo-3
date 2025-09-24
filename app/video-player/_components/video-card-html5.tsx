'use client';

import { deriveThumbnailFromVideoUrl } from '@/util/thumbnail-utils';
import { cn } from '@/util/utils';
import { Clock, Pause, Play } from 'lucide-react';
import React, { memo } from 'react';
import { PlaylistItem } from '../_lib/video-data';

interface VideoCardHTML5Props {
  item: PlaylistItem;
  index: number;
  isActive?: boolean;
  isPlaying?: boolean;
  onSelect: (item: PlaylistItem) => void;
  className?: string;
  showDuration?: boolean;
  progress?: number; // 0-100 percentage for progress indicator
}

function VideoCardHTML5({
  item,
  index,
  isActive = false,
  isPlaying = false,
  onSelect,
  className,
  showDuration = true,
  progress = 0,
}: VideoCardHTML5Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('HTML5 VideoCard clicked:', item.title);

    if (typeof onSelect === 'function') {
      onSelect(item);
    } else {
      console.error('onSelect is not a function!');
    }
  };

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center gap-4 p-3 transition-all duration-200',
        'hover:bg-accent/50 border border-transparent',
        isActive ? 'rounded-none border-border bg-accent' : 'rounded-lg',
        className,
      )}
      onClick={handleClick}
      style={{ userSelect: 'none' }}
    >
      {/* Track Number / Play Button */}
      <div className="pointer-events-none relative flex h-8 w-8 items-center justify-center">
        {isActive ? (
          <div className="flex h-full w-full items-center justify-center">
            {isPlaying ? (
              <Pause className="text-primary h-4 w-4" />
            ) : (
              <Play className="text-primary h-4 w-4" />
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm font-medium transition-opacity group-hover:opacity-0">
            {index + 1}
          </span>
        )}
        {!isActive && (
          <Play className="text-primary absolute inset-0 m-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>

      {/* Tiny thumbnail for context (desktop only to reduce clutter) */}
      {(() => {
        const thumb = deriveThumbnailFromVideoUrl(item.videoUrl);
        return thumb ? (
          <img
            src={thumb}
            alt={item.title}
            loading="lazy"
            className="block h-10 w-16 shrink-0 rounded object-cover md:h-12 md:w-20"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = 'none';
            }}
          />
        ) : null;
      })()}

      {/* Track Info */}
      <div className="pointer-events-none min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {item.rank !== null && item.rank !== undefined && item.rank > 0 && (
            <span className="bg-primary text-primary-foreground inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
              {item.rank}
            </span>
          )}
          <h3
            className={cn(
              'truncate text-sm font-medium',
              isActive ? 'text-primary' : 'text-foreground',
            )}
          >
            {item.title}
          </h3>
          {item.isNew !== null &&
            item.isNew !== undefined &&
            item.isNew === true && (
              <span className="inline-flex items-center rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Video
              </span>
            )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          {item.artist !== null &&
            item.artist !== undefined &&
            item.artist.trim() !== '' && (
              <p className="text-muted-foreground truncate text-xs">
                {item.artist}
              </p>
            )}
          {showDuration && item.duration && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>{item.duration}</span>
            </div>
          )}
        </div>
        {/* Progress bar for active item */}
        {isActive && progress > 0 && (
          <div className="bg-secondary mt-1 h-1 w-full rounded-full">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Score */}
      {item.score !== null &&
        item.score !== undefined &&
        item.score.trim() !== '' && (
          <div className="text-muted-foreground pointer-events-none font-mono text-xs">
            {item.score}
          </div>
        )}
    </div>
  );
}

export default memo(VideoCardHTML5);
