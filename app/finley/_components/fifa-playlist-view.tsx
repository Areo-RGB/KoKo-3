'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MAIN_VIDEO_URL, PLAYLIST } from '@/app/fifa-11-plus/_lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/util/utils';

type PlaylistSegment = {
  id: string;
  title: string;
  description: string;
  startTime: number;
  timestamp?: string;
};

type WebKitVideoElement = HTMLVideoElement & {
  webkitSupportsPresentationMode?: (mode: string) => boolean;
  webkitSetPresentationMode?: (mode: string) => void;
  webkitPresentationMode?: string;
};

function secondsToTimestamp(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
}

export function FifaPlaylistViewForFinley() {
  const segments = useMemo<PlaylistSegment[]>(() => {
    const playable = PLAYLIST.videos.filter(
      (
        item,
      ): item is {
        id: string;
        title: string;
        description: string;
        startTime: number;
        timestamp: string;
      } => item.isHeader !== true && typeof item.startTime === 'number',
    );

    return playable
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        startTime: item.startTime as number,
        timestamp: item.timestamp,
      }))
      .sort((a, b) => a.startTime - b.startTime);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [pipSupported, setPipSupported] = useState(false);

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<WebKitVideoElement | null>(null);
  const autoPlayRef = useRef(false);
  const pipPreviewSegmentIdRef = useRef<string | null>(null);

  const getSegmentEndTime = useCallback(
    (index: number, fallbackDuration?: number | null) => {
      const nextSegment = segments[index + 1];
      if (nextSegment !== undefined) {
        return nextSegment.startTime;
      }
      if (
        typeof fallbackDuration === 'number' &&
        Number.isFinite(fallbackDuration)
      ) {
        return fallbackDuration;
      }
      return undefined;
    },
    [segments],
  );

  const exitPipPreview = useCallback(() => {
    if (typeof document === 'undefined') return;
    const previewVideo = previewVideoRef.current;
    if (previewVideo === null) return;

    const doc = document as Document & {
      pictureInPictureElement?: Element | null;
      exitPictureInPicture?: () => Promise<void>;
    };

    if (doc.pictureInPictureElement === previewVideo) {
      doc.exitPictureInPicture?.().catch((error) => {
        console.error('Unable to exit Picture-in-Picture preview', error);
      });
    }

    if (
      typeof previewVideo.webkitSupportsPresentationMode === 'function' &&
      previewVideo.webkitPresentationMode === 'picture-in-picture'
    ) {
      previewVideo.webkitSetPresentationMode?.('inline');
    }

    previewVideo.pause();
    pipPreviewSegmentIdRef.current = null;
  }, []);

  const requestPictureInPicture = useCallback(
    async (video: WebKitVideoElement) => {
      if (typeof document === 'undefined') return;
      const doc = document as Document & {
        pictureInPictureElement?: Element | null;
        exitPictureInPicture?: () => Promise<void>;
      };

      if (
        doc.pictureInPictureElement !== null &&
        doc.pictureInPictureElement !== video
      ) {
        await doc.exitPictureInPicture?.();
      }

      if (typeof video.requestPictureInPicture === 'function') {
        await video.requestPictureInPicture();
        return;
      }

      if (typeof video.webkitSupportsPresentationMode === 'function') {
        const supports =
          video.webkitSupportsPresentationMode('picture-in-picture');
        if (supports) {
          video.webkitSetPresentationMode?.('picture-in-picture');
        }
      }
    },
    [],
  );

  const triggerPipPreview = useCallback(
    async (segmentIndex: number) => {
      if (pipSupported !== true) return;
      const previewVideo = previewVideoRef.current;
      const nextSegment = segments[segmentIndex];
      if (previewVideo === null || nextSegment === undefined) return;

      if (pipPreviewSegmentIdRef.current === nextSegment.id) {
        return;
      }

      pipPreviewSegmentIdRef.current = nextSegment.id;

      const ensurePlayback = async () => {
        try {
          previewVideo.currentTime = nextSegment.startTime;
          const playResult = previewVideo.play();
          if (playResult !== undefined) {
            await playResult;
          }
          await requestPictureInPicture(previewVideo);
        } catch (error) {
          console.error('Unable to start Picture-in-Picture preview', error);
        }
      };

      if (previewVideo.readyState >= 1) {
        await ensurePlayback();
        return;
      }

      previewVideo.addEventListener(
        'loadedmetadata',
        () => {
          void ensurePlayback();
        },
        { once: true },
      );
      previewVideo.load();
    },
    [pipSupported, segments, requestPictureInPicture],
  );

  const handleSelectSegment = useCallback(
    (index: number) => {
      if (index < 0 || index >= segments.length) return;
      exitPipPreview();
      autoPlayRef.current = true;
      setCurrentIndex(index);
    },
    [exitPipPreview, segments.length],
  );

  const handleStartPlaylist = useCallback(() => {
    if (segments.length === 0) return;
    exitPipPreview();
    autoPlayRef.current = true;
    setCurrentIndex(0);
  }, [exitPipPreview, segments.length]);

  const handleNextSegment = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= segments.length - 1) {
        autoPlayRef.current = false;
        exitPipPreview();
        return prev;
      }
      exitPipPreview();
      autoPlayRef.current = true;
      return prev + 1;
    });
  }, [exitPipPreview, segments.length]);

  const handlePreviousSegment = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return 0;
      }
      exitPipPreview();
      autoPlayRef.current = true;
      return prev - 1;
    });
  }, [exitPipPreview]);

  useEffect(() => {
    const video = mainVideoRef.current;
    const segment = segments[currentIndex];
    if (video === null || segment === undefined) return;

    const setTimeAndMaybePlay = () => {
      video.currentTime = segment.startTime;
      if (autoPlayRef.current) {
        void video.play().catch((error) => {
          console.error('Unable to auto-play segment', error);
        });
      }
    };

    if (video.readyState >= 1) {
      setTimeAndMaybePlay();
    } else {
      const handleLoaded = () => {
        setTimeAndMaybePlay();
      };
      video.addEventListener('loadedmetadata', handleLoaded, { once: true });
      video.load();
    }
  }, [currentIndex, segments]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const updateSupport = () => {
      const doc = document as Document & {
        pictureInPictureEnabled?: boolean;
      };
      const standardSupport = Boolean(doc.pictureInPictureEnabled);
      const previewVideo = previewVideoRef.current;
      const safariSupport = Boolean(
        previewVideo?.webkitSupportsPresentationMode?.('picture-in-picture'),
      );
      setPipSupported(standardSupport || safariSupport);
    };

    updateSupport();
    const id = window.setTimeout(updateSupport, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const previewVideo = previewVideoRef.current;
    if (previewVideo === null) return;

    const handleLeave = () => {
      previewVideo.pause();
    };

    previewVideo.addEventListener('leavepictureinpicture', handleLeave);
    return () => {
      previewVideo.removeEventListener('leavepictureinpicture', handleLeave);
    };
  }, []);

  useEffect(() => exitPipPreview, [exitPipPreview]);

  useEffect(() => {
    const video = mainVideoRef.current;
    if (video === null) return;

    const handleLoadedMetadata = () => {
      if (Number.isFinite(video.duration)) {
        setVideoDuration(video.duration);
      }
    };

    const handleTimeUpdate = () => {
      const videoInstance = mainVideoRef.current;
      if (!videoInstance) return;

      setCurrentTime(videoInstance.currentTime);

      const segment = segments[currentIndex];
      if (segment === undefined) return;

      const intrinsicDuration = Number.isFinite(videoInstance.duration)
        ? videoInstance.duration
        : null;
      const effectiveDuration = intrinsicDuration ?? videoDuration;
      const segmentEnd = getSegmentEndTime(currentIndex, effectiveDuration);
      if (typeof segmentEnd !== 'number') {
        return;
      }

      const remaining = segmentEnd - videoInstance.currentTime;
      if (
        remaining <= 10 &&
        remaining > 1 &&
        segments[currentIndex + 1] !== undefined &&
        pipSupported
      ) {
        void triggerPipPreview(currentIndex + 1);
      }

      if (remaining <= 0.25) {
        setCurrentIndex((prev) => {
          if (prev !== currentIndex) return prev;
          if (prev >= segments.length - 1) {
            autoPlayRef.current = false;
            exitPipPreview();
            return prev;
          }
          autoPlayRef.current = true;
          exitPipPreview();
          return prev + 1;
        });
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [
    currentIndex,
    exitPipPreview,
    getSegmentEndTime,
    pipSupported,
    segments,
    triggerPipPreview,
    videoDuration,
  ]);

  if (segments.length === 0) {
    return <div className="p-4 text-sm">Keine Videos verfügbar.</div>;
  }

  const activeSegment = segments[currentIndex];
  const totalDuration = videoDuration ?? 0;
  const progressPercent =
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 p-4 md:flex-row">
      <div className="flex w-full flex-col gap-4 md:w-2/3">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={mainVideoRef}
            src={MAIN_VIDEO_URL}
            controls
            playsInline
            className="h-full w-full"
          />
        </div>
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4">
          <div>
            <div className="mb-3">
              <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>
                  Segment {currentIndex + 1} von {segments.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total
                  </span>
                  <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-foreground">
                    {secondsToTimestamp(totalDuration)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Elapsed
                  </span>
                  <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-foreground">
                    {secondsToTimestamp(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Completed
                  </span>
                  <span className="rounded-md bg-primary/20 px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-primary">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold">{activeSegment.title}</div>
            {activeSegment.description ? (
              <p className="text-sm text-muted-foreground">
                {activeSegment.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleStartPlaylist}>
              Vom Beginn abspielen
            </Button>
            <Button size="sm" variant="outline" onClick={handlePreviousSegment}>
              Zurück
            </Button>
            <Button size="sm" variant="outline" onClick={handleNextSegment}>
              Weiter
            </Button>
          </div>
          {pipSupported ? (
            <div className="text-xs text-muted-foreground">
              Nächstes Segment wird 10 Sekunden vor Ende automatisch in
              Picture-in-Picture vorbereitet.
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Picture-in-Picture Vorschau wird von diesem Browser nicht
              unterstützt.
            </div>
          )}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          FIFA 11+ Segmentübersicht
        </div>
        <div className="max-h-[60vh] overflow-auto rounded-lg border">
          <ul className="divide-y">
            {segments.map((segment, index) => {
              const isActive = index === currentIndex;
              return (
                <li key={segment.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSegment(index)}
                    className={cn(
                      'flex w-full flex-col gap-1 px-4 py-3 text-left text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary-foreground/90 dark:text-primary-foreground'
                        : 'hover:bg-muted/60',
                    )}
                  >
                    <span className="font-medium">{segment.title}</span>
                    <span className="text-xs text-muted-foreground">
                      Start:{' '}
                      {segment.timestamp ??
                        secondsToTimestamp(segment.startTime)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* Hidden preview video for Picture-in-Picture handoff */}
      <video
        ref={previewVideoRef}
        src={MAIN_VIDEO_URL}
        preload="metadata"
        playsInline
        muted
        className="hidden"
      />
    </div>
  );
}
