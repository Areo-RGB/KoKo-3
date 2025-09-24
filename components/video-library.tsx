'use client';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { useEffect, useMemo, useRef, useState } from 'react';

type VideoItem = { key: string; title: string; url: string };
type Playlist = { name: string; items: VideoItem[] };

type Props = { playlists: Playlist[] };

export default function VideoLibrary({ playlists }: Props) {
  const [activeList, setActiveList] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const current = useMemo(() => {
    const list = playlists[activeList];
    return list?.items?.[activeIndex];
  }, [playlists, activeList, activeIndex]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const plyrRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    plyrRef.current?.destroy();
    plyrRef.current = new Plyr(videoRef.current, {
      controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'fullscreen',
      ],
    });
    return () => plyrRef.current?.destroy();
  }, [current?.url]);

  const handleSelectList = (i: number) => {
    setActiveList(i);
    setActiveIndex(0);
  };

  const handleSelectItem = (i: number) => setActiveIndex(i);

  if (!playlists.length) {
    return <div className="p-4">No videos found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="md:w-2/3 w-full">
        {current && (
          <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              playsInline
              controls
              className="w-full h-full"
            >
              <source src={current.url} type="video/mp4" />
            </video>
          </div>
        )}
        <div className="mt-3 text-sm text-muted-foreground">
          {playlists[activeList]?.name} / {current?.title}
        </div>
      </div>
      <div className="md:w-1/3 w-full">
        <div className="mb-2 font-medium">Playlists</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {playlists.map((pl, i) => (
            <button
              key={pl.name}
              onClick={() => handleSelectList(i)}
              className={`px-3 py-1 rounded border text-sm ${
                i === activeList
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : ''
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
        <div className="max-h-[60vh] overflow-auto border rounded-md divide-y">
          {playlists[activeList]?.items.map((v, i) => (
            <button
              key={v.key}
              onClick={() => handleSelectItem(i)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900 ${
                i === activeIndex ? 'bg-gray-100 dark:bg-zinc-900' : ''
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
