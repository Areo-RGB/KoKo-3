'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronUp, Grid3X3, List } from 'lucide-react';

import PlaylistItem from './playlist-item';
import type { PlaylistSidebarProps, VideoJsPlaylistItem } from './types';

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

const resolveProgress = (
  item: VideoJsPlaylistItem,
  index: number,
  currentIndex: number,
  progressMap?: Record<string, number>,
) => {
  const key = item.id ?? item.videoId ?? String(index);
  const stored = progressMap?.[key];

  if (typeof stored === 'number') {
    return clampProgress(stored);
  }

  if (index < currentIndex) {
    return 100;
  }

  if (index === currentIndex) {
    return stored ?? 0;
  }

  return 0;
};

export default function VideoJsPlaylistSidebar({
  playlist,
  currentIndex,
  isPlaying,
  onVideoSelect,
  isMobile = false,
  isCollapsible = true,
  progressMap,
  title = 'Playlist',
  className,
}: PlaylistSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const activeItem = playlist[currentIndex];
  const activeProgress = clampProgress(
    activeItem ? progressMap?.[activeItem.id ?? activeItem.videoId ?? ''] : 0,
  );

  const { completedCount, completionPercentage } = useMemo(() => {
    if (!playlist.length) {
      return { completedCount: 0, completionPercentage: 0 };
    }

    const completed = playlist.reduce((total, item, index) => {
      const progress = resolveProgress(item, index, currentIndex, progressMap);
      return progress >= 99 ? total + 1 : total;
    }, 0);

    return {
      completedCount: completed,
      completionPercentage: Math.round((completed / playlist.length) * 100),
    };
  }, [playlist, progressMap, currentIndex]);

  if (isCollapsible && isCollapsed) {
    return (
      <div
        className={cn(
          'flex h-full w-12 items-center justify-center border-l border-border/60',
          className,
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={() => setIsCollapsed(false)}
          aria-label="Playlist einblenden"
        >
          <List className="h-4 w-4 rotate-90" />
        </Button>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/80 backdrop-blur',
        isMobile ? 'w-full border-t' : 'w-[18rem] lg:w-[22rem] xl:w-[24rem]',
        className,
      )}
    >
      <header
        className={cn(
          'flex items-center justify-between border-b border-border/70 bg-background/50',
          isMobile ? 'p-3' : 'p-4',
        )}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <h2 className={cn('truncate font-semibold', isMobile ? 'text-base' : 'text-lg')}>
            {title}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {playlist.length} Videos
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          {!isMobile && playlist.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => setViewMode((mode) => (mode === 'list' ? 'grid' : 'list'))}
              aria-label="Ansicht umschalten"
            >
              {viewMode === 'list' ? (
                <Grid3X3 className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          )}

          {isCollapsible && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => setIsCollapsed(true)}
              aria-label="Playlist ausblenden"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {activeItem && (
        <section
          className={cn(
            'border-b border-border/70 bg-background/60',
            isMobile ? 'p-3' : 'p-4',
          )}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className={cn('truncate font-medium', isMobile ? 'text-sm' : 'text-base')}>
                  {activeItem.title}
                </h3>
                {activeItem.artist && (
                  <p className="text-muted-foreground truncate text-xs">
                    {activeItem.artist}
                  </p>
                )}
              </div>
              <Badge
                variant={isPlaying ? 'default' : 'secondary'}
                className="px-2 py-0.5 text-xs uppercase tracking-wide"
              >
                {isPlaying ? 'Läuft' : 'Pausiert'}
              </Badge>
            </div>

            <div className="bg-muted/40 h-2 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${activeProgress}%` }}
              />
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {completedCount} / {playlist.length} abgeschlossen
              </span>
              <span>{activeItem.duration}</span>
            </div>
          </div>
        </section>
      )}

      <ScrollArea className="flex-1">
        <div
          className={cn(
            'grid gap-2',
            isMobile ? 'p-2' : 'p-3',
            viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2',
          )}
        >
          {playlist.map((item, index) => (
            <PlaylistItem
              key={`${item.id ?? item.videoId ?? index}`}
              item={item}
              index={index}
              isActive={index === currentIndex}
              isPlaying={index === currentIndex && isPlaying}
              progress={resolveProgress(item, index, currentIndex, progressMap)}
              onSelect={onVideoSelect}
              isMobile={isMobile}
              className={viewMode === 'grid' ? 'h-full' : undefined}
            />
          ))}
        </div>
      </ScrollArea>

      <footer
        className={cn(
          'border-t border-border/70 bg-background/60',
          isMobile ? 'p-2.5' : 'p-3',
        )}
      >
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Gesamt: {playlist.length} Videos</span>
          <span>{completionPercentage}% abgeschlossen</span>
        </div>
      </footer>
    </aside>
  );
}
