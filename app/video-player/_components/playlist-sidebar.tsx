// app/video-player/_components/playlist-sidebar.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/util/utils';
import { ChevronUp, Grid3X3, List, X } from 'lucide-react';
import { useState } from 'react';
import { PlaylistItem } from '../_lib/video-data';
import VideoCardHTML5 from './video-card-html5';

interface PlaylistSidebarProps {
  currentPlaylist: PlaylistItem[];
  currentVideoIndex: number;
  currentProgress?: number; // 0-100 for current video
  isPlaying: boolean;
  onVideoSelect: (item: PlaylistItem, index: number) => void;
  onClose?: () => void;
  className?: string;
  title?: string;
  isCollapsible?: boolean;
  isMobile?: boolean;
}

export default function PlaylistSidebar({
  currentPlaylist,
  currentVideoIndex,
  currentProgress = 0,
  isPlaying,
  onVideoSelect,
  onClose,
  className,
  title = 'Wiedergabeliste',
  isCollapsible = false,
  isMobile = false,
}: PlaylistSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const currentItem = currentPlaylist[currentVideoIndex];
  const totalDuration = currentPlaylist.length;
  const completedCount = Math.floor(currentVideoIndex);

  if (isCollapsed && isCollapsible) {
    return (
      <div className={cn('w-12', className)}>
        <Button
          variant="ghost"
          onClick={() => setIsCollapsed(false)}
          className="h-full w-full rounded-none"
        >
          <List className="h-4 w-4 rotate-90" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-background flex h-full flex-col',
        // Responsive width and border
        isMobile ? 'w-full border-t' : 'w-80 border-l lg:w-96',
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'bg-muted/30 flex items-center justify-between border-b',
          isMobile ? 'p-3' : 'p-4',
        )}
      >
        <div className="flex items-center gap-2">
          <h2
            className={cn('font-semibold', isMobile ? 'text-base' : 'text-lg')}
          >
            {title}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {currentPlaylist.length} Videos
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {/* View Mode Toggle - Hidden on mobile for space */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2"
            >
              {viewMode === 'list' ? (
                <Grid3X3 className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Collapse Button */}
          {isCollapsible && !isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="p-2"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}

          {/* Close Button */}
          {onClose && (
            <Button
              variant="ghost"
              size={isMobile ? 'default' : 'sm'}
              onClick={onClose}
              className={cn('touch-manipulation', isMobile ? 'p-3' : 'p-2')}
            >
              <X className={cn(isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            </Button>
          )}
        </div>
      </div>

      {/* Current Playing Info */}
      {currentItem && (
        <div className={cn('bg-muted/20 border-b', isMobile ? 'p-3' : 'p-4')}>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    'truncate font-medium',
                    isMobile ? 'text-xs' : 'text-sm',
                  )}
                >
                  {currentItem.title}
                </h3>
                {currentItem.artist && (
                  <p className="text-muted-foreground truncate text-xs">
                    {currentItem.artist}
                  </p>
                )}
              </div>
              <Badge
                variant={isPlaying ? 'default' : 'secondary'}
                className={cn(
                  'ml-2',
                  isMobile ? 'px-1.5 py-0.5 text-xs' : 'text-xs',
                )}
              >
                {isPlaying ? 'Läuft' : 'Pausiert'}
              </Badge>
            </div>

            {/* Progress bar for current video */}
            <div
              className={cn(
                'bg-secondary w-full rounded-full transition-all duration-300',
                isMobile ? 'h-2' : 'h-1.5',
              )}
            >
              <div
                className={cn(
                  'bg-primary rounded-full transition-all duration-300',
                  isMobile ? 'h-2' : 'h-1.5',
                )}
                style={{ width: `${currentProgress}%` }}
              />
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {completedCount} von {totalDuration} abgeschlossen
              </span>
              <span>{currentItem.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Items */}
      <ScrollArea className="min-h-0 flex-1">
        <div
          className={cn(
            isMobile ? 'p-1' : 'p-2',
            viewMode === 'grid' && 'grid grid-cols-1 gap-1',
          )}
        >
          {currentPlaylist.map((item, index) => (
            <VideoCardHTML5
              key={`${item.videoId}-${item.chapterId || item.id}-${index}`}
              item={item}
              index={index}
              isActive={index === currentVideoIndex}
              isPlaying={index === currentVideoIndex && isPlaying}
              progress={index === currentVideoIndex ? currentProgress : 0}
              showDuration={true}
              onSelect={(selectedItem) => onVideoSelect(selectedItem, index)}
              className={cn(
                'touch-manipulation transition-all duration-200',
                isMobile ? 'mb-0.5' : 'mb-1',
                index === currentVideoIndex &&
                  'ring-primary ring-2 ring-offset-2',
                viewMode === 'grid' && 'mb-0',
                // Larger touch targets on mobile
                isMobile && 'px-2 py-3',
              )}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className={cn('bg-muted/20 border-t', isMobile ? 'p-2' : 'p-3')}>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Gesamt: {currentPlaylist.length} Videos</span>
          <span>
            {Math.round((completedCount / totalDuration) * 100)}% abgeschlossen
          </span>
        </div>
      </div>
    </div>
  );
}
