'use client';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

type VideoItem = { key: string; title: string; url: string };
type Playlist = { name: string; items: VideoItem[] };

type Props = { playlists: Playlist[] };

export default function VideoLibrary({ playlists }: Props) {
  const [activeList, setActiveList] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pipSupported, setPipSupported] = useState(false);
  const [pipActive, setPipActive] = useState(false);

  const current = useMemo(() => {
    const list = playlists[activeList];
    return list?.items?.[activeIndex];
  }, [playlists, activeList, activeIndex]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const plyrRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const doc = document as Document & {
        pictureInPictureEnabled?: boolean;
      };
      const standardSupport = Boolean(doc.pictureInPictureEnabled);
      const videoEl = videoRef.current as HTMLVideoElement & {
        webkitSupportsPresentationMode?: (mode: string) => boolean;
      };
      const webkitSupport = Boolean(
        videoEl?.webkitSupportsPresentationMode?.('picture-in-picture'),
      );
      setPipSupported(standardSupport || webkitSupport);
    }
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (typeof document !== 'undefined') {
      const doc = document as Document & {
        pictureInPictureElement?: Element | null;
      };
      setPipActive(Boolean(doc.pictureInPictureElement));
    }

    const handleEnter = () => setPipActive(true);
    const handleLeave = () => setPipActive(false);

    videoEl.addEventListener('enterpictureinpicture', handleEnter);
    videoEl.addEventListener('leavepictureinpicture', handleLeave);

    return () => {
      videoEl.removeEventListener('enterpictureinpicture', handleEnter);
      videoEl.removeEventListener('leavepictureinpicture', handleLeave);
    };
  }, [current?.url]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    plyrRef.current?.destroy();
    plyrRef.current = new Plyr(videoEl, {
      controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'pip',
        'fullscreen',
      ],
    });
    videoEl.removeAttribute('disablePictureInPicture');
    return () => plyrRef.current?.destroy();
  }, [current?.url]);

  const togglePictureInPicture = useCallback(async () => {
    if (!pipSupported || !videoRef.current) return;

    const videoEl = videoRef.current as HTMLVideoElement & {
      webkitSupportsPresentationMode?: (mode: string) => boolean;
      webkitPresentationMode?: string;
      webkitSetPresentationMode?: (mode: string) => void;
      requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
    };

    try {
      const doc = document as Document & {
        pictureInPictureElement?: Element | null;
        exitPictureInPicture?: () => Promise<void>;
      };

      if (doc.pictureInPictureElement) {
        await doc.exitPictureInPicture?.();
        return;
      }

      if (typeof videoEl.requestPictureInPicture === 'function') {
        await videoEl.requestPictureInPicture();
        return;
      }

      if (
        typeof videoEl.webkitSupportsPresentationMode === 'function' &&
        videoEl.webkitSupportsPresentationMode('picture-in-picture')
      ) {
        const nextMode =
          videoEl.webkitPresentationMode === 'picture-in-picture'
            ? 'inline'
            : 'picture-in-picture';
        videoEl.webkitSetPresentationMode?.(nextMode);
      }
    } catch (error) {
      console.error('Unable to toggle Picture-in-Picture', error);
    }
  }, [pipSupported]);

  const handleSelectList = (i: number) => {
    setActiveList(i);
    setActiveIndex(0);
  };

  const handleSelectItem = (i: number) => setActiveIndex(i);

  if (playlists.length === 0) {
    return <div className="p-4">No videos found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:flex-row">
      <div className="w-full md:w-2/3">
        {current !== undefined ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              playsInline
              controls
              className="h-full w-full"
            >
              <source src={current.url} type="video/mp4" />
            </video>
          </div>
        ) : null}
        {pipSupported === true && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePictureInPicture}
              className="inline-flex items-center gap-2"
            >
              {pipActive
                ? 'Exit Picture-in-Picture'
                : 'Enable Picture-in-Picture'}
            </Button>
          </div>
        )}
        <div className="text-muted-foreground mt-3 text-sm">
          {playlists[activeList]?.name} / {current?.title}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="mb-2 font-medium">Playlists</div>
        <div className="mb-4 flex flex-wrap gap-2">
          {playlists.map((pl, i) => (
            <button
              key={pl.name}
              onClick={() => handleSelectList(i)}
              className={`rounded border px-3 py-1 text-sm ${
                i === activeList
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : ''
              }`}
            >
              {pl.name}
            </button>
          ))}
        </div>
        <div className="max-h-[60vh] divide-y overflow-auto rounded-md border">
          {playlists[activeList]?.items.map((v, i) => (
            <button
              key={v.key}
              onClick={() => handleSelectItem(i)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-900 ${
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
