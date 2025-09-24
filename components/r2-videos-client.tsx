'use client';
import VideoPlayer from '@/app/video-player/_components/video-player';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PlaylistItem } from '@/lib/video-data';
import { useMemo, useState } from 'react';

type R2VideoItem = { key: string; title: string; url: string };
type R2Playlist = { name: string; items: R2VideoItem[] };

type Props = {
  playlists: R2Playlist[];
};

function toPlaylistItems(folder: string, items: R2VideoItem[]): PlaylistItem[] {
  return items.map((it, idx) => ({
    id: `${folder}-${idx}`,
    title: it.title,
    artist: folder,
    duration: '—',
    videoId: it.key, // arbitrary id; not used when videoUrl present
    videoUrl: it.url,
  }));
}

export default function R2VideosClient({ playlists }: Props) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(
    playlists[0]?.name ?? null,
  );
  const [playerOpen, setPlayerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const active = useMemo(
    () => playlists.find((p) => p.name === selectedFolder),
    [playlists, selectedFolder],
  );

  const activePlaylist: PlaylistItem[] = useMemo(() => {
    if (!active) return [];
    return toPlaylistItems(active.name, active.items);
  }, [active]);

  const handlePlay = (index: number) => {
    setInitialIndex(index);
    setPlayerOpen(true);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Wissen Videos</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          R2-Bibliothek, gruppiert nach Ordnern als Wiedergabelisten
        </p>
      </div>

      {/* Folder chips */}
      <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
        {playlists.map((pl) => (
          <Button
            key={pl.name}
            variant={selectedFolder === pl.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFolder(pl.name)}
          >
            {pl.name}
            <Badge variant="secondary" className="ml-2">
              {pl.items.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Grid of videos in selected folder */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {active?.items.map((it, idx) => (
          <Card
            key={it.key}
            className="group cursor-pointer overflow-hidden"
            onClick={() => handlePlay(idx)}
          >
            <div className="relative aspect-video w-full bg-black">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={it.url}
                preload="metadata"
                muted
                playsInline
                className="pointer-events-none h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
            <CardContent className="p-3">
              <div className="truncate text-sm font-medium" title={it.title}>
                {it.title}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                {active?.name}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fullscreen styled player overlay (borrows /video-player styling) */}
      {playerOpen && activePlaylist.length > 0 && (
        <div className="bg-background fixed inset-0 z-50">
          <VideoPlayer
            initialPlaylist={activePlaylist}
            initialVideoIndex={initialIndex}
            onClose={() => setPlayerOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
