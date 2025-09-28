'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type videojs from 'video.js';
import type { VideoJsPlayer } from 'video.js';

import { cn } from '@/lib/utils';

import BaseVideoJsPlayer from './base-player';
import PlaylistSidebar from './playlist-sidebar';
import styles from './videojs-player.module.css';
import type {
  OnVideoSelectHandler,
  PlaylistConfig,
  QualityLevel,
  QualityLevelList,
  QualityLevelsChangeEvent,
  VideoJsPlayerConfig,
  VideoJsPlayerProps,
  VideoJsPlayerWithPlugins,
  VideoJsPlaylistItem,
  VideoJsSource,
} from './types';

interface DerivedConfig {
  playerConfig: VideoJsPlayerConfig;
  playlistConfig: PlaylistConfig;
}

const DEFAULT_CONFIG: DerivedConfig = {
  playerConfig: {
    playbackRates: [0.75, 1, 1.25, 1.5],
    autoAdvance: { enabled: false },
    loop: false,
    qualitySelector: {
      displayCurrentQuality: true,
      placementIndex: 7,
      vjsIconClass: 'vjs-icon-hd',
    },
    qualityLevels: {},
  },
  playlistConfig: {
    title: 'Playlist',
    collapsible: true,
    showThumbnails: true,
    defaultCollapsed: false,
  },
};

const HLS_EXTENSION = /\.m3u8(\?.*)?$/i;
const DASH_EXTENSION = /\.mpd(\?.*)?$/i;
const MP4_EXTENSION = /\.mp4(\?.*)?$/i;
const WEBM_EXTENSION = /\.webm(\?.*)?$/i;

const HLS_MIME_TYPE = 'application/x-mpegURL';
const DASH_MIME_TYPE = 'application/dash+xml';
const MP4_MIME_TYPE = 'video/mp4';
const WEBM_MIME_TYPE = 'video/webm';

const inferMimeType = (source: VideoJsSource) => {
  if (source.type) {
    return source.type;
  }

  if (HLS_EXTENSION.test(source.src)) {
    return HLS_MIME_TYPE;
  }

  if (DASH_EXTENSION.test(source.src)) {
    return DASH_MIME_TYPE;
  }

  if (MP4_EXTENSION.test(source.src)) {
    return MP4_MIME_TYPE;
  }

  if (WEBM_EXTENSION.test(source.src)) {
    return WEBM_MIME_TYPE;
  }

  return undefined;
};

const isAdaptiveSource = (source: VideoJsSource) => {
  const type = source.type ?? inferMimeType(source);

  return type === HLS_MIME_TYPE || type === DASH_MIME_TYPE;
};

const normaliseSource = (source: VideoJsSource): VideoJsSource => ({
  ...source,
  type: inferMimeType(source) ?? source.type,
});

const toTechSource = (source: VideoJsSource): videojs.Tech.SourceObject => ({
  src: source.src,
  type: source.type,
  label: source.label,
  res: source.resolution?.height,
  bandwidth: source.bandwidth,
  default: source.default,
});

const sortSourcesByQuality = (sources: VideoJsSource[]) =>
  [...sources].sort((a, b) => {
    const heightDiff = (b.resolution?.height ?? 0) - (a.resolution?.height ?? 0);

    if (heightDiff !== 0) {
      return heightDiff;
    }

    return (b.bandwidth ?? 0) - (a.bandwidth ?? 0);
  });

const resolveQualityLabel = (source: VideoJsSource) => {
  if (source.label) {
    return source.label;
  }

  if (source.resolution?.height) {
    return `${source.resolution.height}p`;
  }

  if (source.bandwidth) {
    return `${Math.round(source.bandwidth / 1000)}kbps`;
  }

  return undefined;
};

const toQualityLevelFromSource = (
  source: VideoJsSource,
  fallbackIndex: number,
  isSelected: boolean,
): QualityLevel => ({
  id: source.label ?? source.src ?? `quality-${fallbackIndex}`,
  label: resolveQualityLabel(source),
  width: source.resolution?.width,
  height: source.resolution?.height,
  bandwidth: source.bandwidth,
  enabled: isSelected,
});

const findDefaultSource = (
  sources: VideoJsSource[],
  defaultQuality?: string,
) => {
  if (!sources.length) {
    return undefined;
  }

  const explicitDefault = sources.find((source) => source.default);

  if (explicitDefault) {
    return explicitDefault;
  }

  if (defaultQuality) {
    const matchingByLabel = sources.find((source) => source.label === defaultQuality);

    if (matchingByLabel) {
      return matchingByLabel;
    }
  }

  return sources[0];
};

const formatQualityLabel = (quality?: QualityLevel | null) => {
  if (!quality) {
    return 'Auto';
  }

  if (quality.label) {
    return quality.label;
  }

  if (quality.height) {
    return `${quality.height}p`;
  }

  if (quality.bandwidth) {
    return `${Math.round(quality.bandwidth / 1000)}kbps`;
  }

  return 'Auto';
};

const clampIndex = (value: number, length: number) => {
  if (length === 0) {
    return -1;
  }
  if (value < 0) {
    return 0;
  }
  if (value > length - 1) {
    return length - 1;
  }
  return value;
};

const getPrimarySource = (item?: VideoJsPlaylistItem) => {
  if (!item) {
    return undefined;
  }

  if (item.sources?.length) {
    const normalisedSources = sortSourcesByQuality(
      item.sources.map((source) => normaliseSource(source)),
    );

    return findDefaultSource(normalisedSources, item.defaultQuality);
  }

  if (item.videoUrl) {
    return normaliseSource({ src: item.videoUrl });
  }

  return undefined;
};

const resolveInitialIndex = (
  playlist: VideoJsPlaylistItem[],
  providedIndex?: number,
) => {
  if (typeof providedIndex === 'number') {
    return clampIndex(providedIndex, playlist.length);
  }

  return clampIndex(0, playlist.length);
};

const shouldAutoPlay = (
  autoPlay?: boolean,
  playerConfig?: VideoJsPlayerConfig,
) => Boolean(autoPlay ?? playerConfig?.autoAdvance?.enabled);

type CleanupFn = () => void;

export default function VideoJsPlayer({
  playlist,
  initialIndex,
  currentIndex,
  onReady,
  onVideoSelect,
  onPlaylistChange,
  playerConfig: providedPlayerConfig,
  playlistConfig: providedPlaylistConfig,
  className,
  sidebarClassName,
  autoPlay,
}: VideoJsPlayerProps) {
  const mergedConfig = useMemo<DerivedConfig>(
    () => ({
      playerConfig: {
        ...DEFAULT_CONFIG.playerConfig,
        ...(providedPlayerConfig ?? {}),
      },
      playlistConfig: {
        ...DEFAULT_CONFIG.playlistConfig,
        ...(providedPlaylistConfig ?? {}),
      },
    }),
    [providedPlayerConfig, providedPlaylistConfig],
  );

  const isControlled = typeof currentIndex === 'number';
  const initialResolvedIndex = resolveInitialIndex(
    playlist,
    isControlled ? currentIndex : initialIndex,
  );
  const [internalIndex, setInternalIndex] = useState(initialResolvedIndex);

  useEffect(() => {
    if (isControlled) {
      setInternalIndex(resolveInitialIndex(playlist, currentIndex));
    }
  }, [currentIndex, isControlled, playlist]);

  const activeIndex = clampIndex(internalIndex, playlist.length);
  const activeItem = activeIndex >= 0 ? playlist[activeIndex] : undefined;
  const primarySource = getPrimarySource(activeItem);
  const playerInstanceRef = useRef<VideoJsPlayer | null>(null);
  const cleanupRef = useRef<CleanupFn | null>(null);
  const activeItemRef = useRef<VideoJsPlaylistItem | undefined>(activeItem);
  const progressRef = useRef<Record<string, number>>({});
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<QualityLevel | null>(null);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const [isAdaptiveSource, setIsAdaptiveSource] = useState(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyRef = useRef(false);
  const previousIndexRef = useRef<number | null>(null);
  const lastSyncedIdRef = useRef<string | null>(null);
  const playlistRef = useRef(playlist);
  const onVideoSelectRef = useRef<OnVideoSelectHandler | undefined>(onVideoSelect);
  const playerConfigRef = useRef(mergedConfig.playerConfig);
  const internalIndexRef = useRef(internalIndex);
  const handleVideoSelectRef = useRef<OnVideoSelectHandler | null>(null);
  const qualityLevelsRef = useRef<QualityLevelList | null>(null);
  const qualityProviderRef = useRef<'plugin' | 'manual' | 'none'>('none');
  const manualSourcesRef = useRef<VideoJsSource[] | null>(null);
  const manualQualityIdRef = useRef<string | null>(null);
  const qualityMenuRef = useRef<HTMLDivElement | null>(null);
  const availableQualityCount = availableQualities.length;

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    onVideoSelectRef.current = onVideoSelect;
  }, [onVideoSelect]);

  useEffect(() => {
    playerConfigRef.current = mergedConfig.playerConfig;
  }, [mergedConfig.playerConfig]);

  useEffect(() => {
    activeItemRef.current = activeItem;
  }, [activeItem]);

  useEffect(() => {
    internalIndexRef.current = internalIndex;
  }, [internalIndex]);

  useEffect(() => {
    handleVideoSelectRef.current = ({ index, item }) => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }

      const playlistValue = playlistRef.current;
      const clampedIndex = clampIndex(index, playlistValue.length);
      const resolvedItem = playlistValue[clampedIndex] ?? item;

      if (!resolvedItem) {
        return;
      }

      if (!isControlled) {
        setInternalIndex(clampedIndex);
      }

      internalIndexRef.current = clampedIndex;
      activeItemRef.current = resolvedItem;
      lastSyncedIdRef.current = null;
      setQualityMenuOpen(false);
      manualSourcesRef.current = null;
      manualQualityIdRef.current = null;
      qualityProviderRef.current = 'none';

      onVideoSelectRef.current?.({ index: clampedIndex, item: resolvedItem });
    };
  }, [isControlled]);

  useEffect(() => {
    if (!qualityMenuOpen && availableQualityCount === 0) {
      return;
    }

    if (availableQualityCount === 0) {
      setQualityMenuOpen(false);
    }
  }, [availableQualityCount, qualityMenuOpen]);

  useEffect(() => {
    if (!qualityMenuOpen) {
      return;
    }

    if (typeof document === 'undefined') {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!qualityMenuRef.current) {
        return;
      }

      const target = event.target as Node | null;

      if (!target || qualityMenuRef.current.contains(target)) {
        return;
      }

      setQualityMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQualityMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [qualityMenuOpen]);

  const handleVideoSelect = useCallback<OnVideoSelectHandler>((payload) => {
    handleVideoSelectRef.current?.(payload);
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window === 'undefined') {
        return;
      }
      setIsMobile(window.innerWidth < 1024);
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }

      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!activeItem) {
      return;
    }

    if (typeof onPlaylistChange === 'function') {
      if (previousIndexRef.current !== activeIndex) {
        onPlaylistChange({
          index: activeIndex,
          previousIndex: previousIndexRef.current,
          item: activeItem,
          playlist,
        });
        previousIndexRef.current = activeIndex;
      }
    }
  }, [activeIndex, activeItem, onPlaylistChange, playlist]);

  const updateProgress = useCallback((itemId: string, value: number) => {
    progressRef.current[itemId] = value;
    setProgressMap({ ...progressRef.current });
  }, []);

  const syncPlayerWithItem = useCallback(
    (player: VideoJsPlayer, item?: VideoJsPlaylistItem) => {
      if (!item) {
        return;
      }

      const shouldUpdateSource = !item.id || lastSyncedIdRef.current !== item.id;
      activeItemRef.current = item;

      const currentSource = player.currentSource();

      if (shouldUpdateSource) {
        if (item.sources?.length) {
          const primary = item.sources[0];
          if (!currentSource || currentSource.src !== primary.src) {
            player.src(item.sources as unknown as videojs.Tech.SourceObject[]);
          }
        } else if (item.videoUrl) {
          if (!currentSource || currentSource.src !== item.videoUrl) {
            player.src({ src: item.videoUrl });
          }
        }
      }

      if (item.posterUrl) {
        player.poster(item.posterUrl);
      } else {
        player.poster('');
      }

      const pluginAwarePlayer = player as VideoJsPlayerWithPlugins;
      const spriteSource = item.thumbnailUrl ?? item.spriteMap;
      if (spriteSource && pluginAwarePlayer.vttThumbnails) {
        pluginAwarePlayer.vttThumbnails({ src: spriteSource });
      }

      const remoteTracks = player.remoteTextTracks();
      for (let i = remoteTracks.length - 1; i >= 0; i -= 1) {
        const track = remoteTracks[i];
        player.removeRemoteTextTrack(track);
      }

      if (item.textTracks?.length) {
        item.textTracks.forEach((track) => {
          player.addRemoteTextTrack(
            {
              src: track.src,
              kind: track.kind ?? 'subtitles',
              srclang: track.srclang,
              label: track.label,
              default: track.default,
            },
            false,
          );
        });
      }

      if (shouldUpdateSource) {
        lastSyncedIdRef.current = item.id ?? null;
      }
    },
    [],
  );

  const handleReady = useCallback(
    (player: VideoJsPlayer) => {
      onReady?.(player);
      playerInstanceRef.current = player;
      readyRef.current = true;

      const disposers: CleanupFn[] = [];

      const attach = (event: string, handler: () => void) => {
        player.on(event, handler);
        disposers.push(() => player.off(event, handler));
      };

      attach('play', () => setIsPlaying(true));
      attach('pause', () => setIsPlaying(false));
      attach('timeupdate', () => {
        const item = activeItemRef.current;
        if (!item) {
          return;
        }

        const duration = player.duration();
        const currentTime = player.currentTime();

        if (!duration || Number.isNaN(duration) || duration <= 0) {
          return;
        }

        const progress = Math.min(
          100,
          Math.max(0, (currentTime / duration) * 100),
        );

        const previous = progressRef.current[item.id] ?? 0;
        if (Math.abs(previous - progress) >= 0.5) {
          updateProgress(item.id, progress);
        }
      });

      attach('loadedmetadata', () => {
        const item = activeItemRef.current;
        if (item?.startTime) {
          player.currentTime(Math.max(0, item.startTime));
        }
      });

      attach('ended', () => {
        const item = activeItemRef.current;
        if (item) {
          updateProgress(item.id, 100);
        }

        const config = playerConfigRef.current;

        if (config.loop) {
          player.currentTime(0);
          player.play().catch(() => undefined);
          return;
        }

        const playlistValue = playlistRef.current;
        const currentIndexValue = clampIndex(
          internalIndexRef.current,
          playlistValue.length,
        );
        const nextIndex = clampIndex(currentIndexValue + 1, playlistValue.length);

        if (
          !config.autoAdvance?.enabled ||
          nextIndex === currentIndexValue ||
          !playlistValue[nextIndex]
        ) {
          setIsPlaying(false);
          return;
        }

        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }

        const delayMs = Math.max(0, (config.autoAdvance.delay ?? 0) * 1000);

        autoAdvanceTimerRef.current = setTimeout(() => {
          const updatedPlaylist = playlistRef.current;
          const resolvedIndex = clampIndex(nextIndex, updatedPlaylist.length);
          const nextItem = updatedPlaylist[resolvedIndex];

          if (!nextItem) {
            return;
          }

          handleVideoSelectRef.current?.({ index: resolvedIndex, item: nextItem });
        }, delayMs);
      });

      if (mergedConfig.playerConfig.playbackRates?.length) {
        player.playbackRates(mergedConfig.playerConfig.playbackRates);
      }

      player.loop(mergedConfig.playerConfig.loop ?? false);

      cleanupRef.current?.();
      cleanupRef.current = () => {
        disposers.forEach((dispose) => dispose());
        cleanupRef.current = null;
      };

      syncPlayerWithItem(player, activeItemRef.current);
      setIsPlaying(!player.paused());

      if (shouldAutoPlay(autoPlay, mergedConfig.playerConfig)) {
        player.play().catch(() => undefined);
      }
    },
    [
      autoPlay,
      mergedConfig.playerConfig,
      onReady,
      syncPlayerWithItem,
      updateProgress,
    ],
  );

  useEffect(() => {
    const player = playerInstanceRef.current;
    if (!player || !readyRef.current) {
      return;
    }

    syncPlayerWithItem(player, activeItem);

    const autoPlayEnabled = shouldAutoPlay(autoPlay, mergedConfig.playerConfig);

    if (autoPlayEnabled) {
      player.play().catch(() => undefined);
    } else {
      player.pause();
    }
  }, [activeItem, autoPlay, mergedConfig.playerConfig, syncPlayerWithItem]);

  const sidebarTitle = mergedConfig.playlistConfig.title;
  const playerClassNames = cn('flex-1 min-w-0', className);

  if (!playlist.length) {
    return <div className={playerClassNames}>No videos available.</div>;
  }

  return (
    <div className={cn('flex flex-col gap-6 lg:flex-row lg:items-start', className)}>
      <div className="flex-1 min-w-0">
        <BaseVideoJsPlayer
          src={primarySource?.src ?? ''}
          options={mergedConfig.playerConfig.playerOptions}
          onReady={handleReady}
        />
      </div>

      <PlaylistSidebar
        playlist={playlist}
        currentIndex={activeIndex}
        isPlaying={isPlaying}
        onVideoSelect={handleVideoSelect}
        isMobile={isMobile}
        isCollapsible={mergedConfig.playlistConfig.collapsible}
        progressMap={progressMap}
        title={sidebarTitle}
        className={sidebarClassName}
      />
    </div>
  );
}
