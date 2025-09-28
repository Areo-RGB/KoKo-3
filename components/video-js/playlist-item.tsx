'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { PlaylistItemProps } from './types';

const clampProgress = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return value;
};

export default function PlaylistItem({
  item,
  index,
  isActive,
  isPlaying,
  progress,
  onSelect,
  isMobile,
  className,
}: PlaylistItemProps) {
  const resolvedProgress = clampProgress(progress);

  const handleClick = () => {
    onSelect({ index, item });
  };

  const titleId = `video-playlist-item-${item.id ?? item.videoId}-${index}`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group relative flex w-full items-center gap-4 rounded-xl border border-transparent bg-background/80 p-4 text-left transition-all duration-200 hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isMobile && 'gap-3 p-3',
        isActive && 'border-primary/60 bg-primary/5 shadow-lg shadow-primary/10',
        className,
      )}
      aria-current={isActive}
      aria-describedby={`${titleId}-meta`}
    >
      <div
        className={cn(
          'relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-100',
          isMobile && 'h-14 w-24',
        )}
      >
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
            {String(index + 1).padStart(2, '0')}
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            Läuft
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p id={titleId} className="truncate text-sm font-medium">
              {item.title}
            </p>
            {item.artist && (
              <p className="text-muted-foreground truncate text-xs">{item.artist}</p>
            )}
          </div>
          {item.isNew && (
            <Badge variant="outline" className="whitespace-nowrap text-xs">
              Neu
            </Badge>
          )}
        </div>

        <div className="space-y-2" id={`${titleId}-meta`}>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.duration}</span>
            {typeof item.rank === 'number' && (
              <span className="font-medium">#{item.rank}</span>
            )}
          </div>

          <div className="bg-muted/50 overflow-hidden rounded-full">
            <div
              className={cn(
                'h-1.5 rounded-full bg-primary transition-all duration-300 ease-out',
                resolvedProgress > 0 && 'opacity-100',
                resolvedProgress === 0 && 'opacity-40',
              )}
              style={{ width: `${resolvedProgress}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
