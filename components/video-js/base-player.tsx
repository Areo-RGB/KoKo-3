'use client';

import clsx from 'clsx';
import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';
import videojs from 'video.js';
import { useEffect, useRef } from 'react';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';
import 'videojs-playlist';
import 'videojs-vtt-thumbnails';
import styles from './videojs-player.module.css';
import type {
  QualityLevel,
  QualityLevelList,
  QualityLevelsChangeEvent,
  QualityLevelsConfig,
  QualitySelectorConfig,
  VideoJsPlayerWithPlugins,
  VttThumbnailsConfig,
} from './types';

type BasePlayerProps = {
  src: string;
  options?: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
  className?: string;
};

const DEFAULT_OPTIONS: VideoJsPlayerOptions = {
  autoplay: false,
  controls: true,
  preload: 'auto',
  fluid: true,
  responsive: true,
  html5: {
    vhs: {
      overrideNative: true,
      enableLowInitialPlaylist: true,
      experimentalBufferBasedABR: true,
    },
  },
};

const isHlsSource = (source?: string) => Boolean(source && /\.m3u8(\?.*)?$/i.test(source));

const buildSource = (source: string) => {
  if (isHlsSource(source)) {
    return { src: source, type: 'application/x-mpegURL' };
  }

  return { src: source };
};

export function BaseVideoJsPlayer({ src, options, onReady, className }: BasePlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    if (!videoRef.current) {
      return () => undefined;
    }

    const mergedOptions = videojs.mergeOptions(DEFAULT_OPTIONS, options ?? {});
    const pluginOptions = {
      qualitySelector: (mergedOptions as { plugins?: { qualitySelector?: QualitySelectorConfig } })?.plugins
        ?.qualitySelector,
      qualityLevels: (mergedOptions as { plugins?: { qualityLevels?: QualityLevelsConfig } })?.plugins
        ?.qualityLevels,
      thumbnails: (mergedOptions as { plugins?: { thumbnails?: VttThumbnailsConfig } })?.plugins?.thumbnails,
    };

    if (!mergedOptions.sources || mergedOptions.sources.length === 0) {
      mergedOptions.sources = [buildSource(src)];
    }

    let player: VideoJsPlayer | null = null;
    const cleanupCallbacks: Array<() => void> = [];

    try {
      player = videojs(videoRef.current, mergedOptions, function handlePlayerReady() {
        const instance = this as VideoJsPlayerWithPlugins;

        let qualityLevelsInitialised = false;

        const emitQualityChange = (qualityLevels: QualityLevelList) => {
          const levels: QualityLevel[] = Array.from({ length: qualityLevels.length }, (_, index) => {
            const level = qualityLevels[index];

            const enabledValue =
              typeof level.enabled === 'function' ? level.enabled() : Boolean(level.enabled);

            return {
              id: level.id,
              label: level.label,
              width: level.width,
              height: level.height,
              bandwidth: level.bandwidth,
              enabled: enabledValue,
            } satisfies QualityLevel;
          });

          const changeEvent: QualityLevelsChangeEvent = {
            levels,
            selectedQuality: levels[qualityLevels.selectedIndex] ?? null,
          };

          instance.trigger('qualitylevelschanged', changeEvent);
          pluginOptions.qualityLevels?.onChange?.(changeEvent);
        };

        const registerQualityLevels = () => {
          try {
            const qualityLevels = instance.qualityLevels?.();

            if (!qualityLevels) {
              console.warn('[Video.js] qualityLevels plugin is not available on the player instance');
              return;
            }

            emitQualityChange(qualityLevels);

            if (qualityLevelsInitialised) {
              return;
            }

            const handleQualityLevelsUpdated = () => emitQualityChange(qualityLevels);

            qualityLevels.on('change', handleQualityLevelsUpdated);
            qualityLevels.on('addqualitylevel', handleQualityLevelsUpdated);

            cleanupCallbacks.push(() => {
              qualityLevels.off('change', handleQualityLevelsUpdated);
              qualityLevels.off('addqualitylevel', handleQualityLevelsUpdated);
            });

            qualityLevelsInitialised = true;
          } catch (error) {
            console.warn('[Video.js] Failed to initialise qualityLevels plugin', error);
          }
        };

        const registerQualitySelector = () => {
          try {
            instance.hlsQualitySelector?.({
              displayCurrentQuality: true,
              ...pluginOptions.qualitySelector,
            });
          } catch (error) {
            console.warn('[Video.js] Failed to initialise hlsQualitySelector plugin', error);
          }
        };

        const registerVttThumbnails = () => {
          try {
            const thumbnailsConfig = pluginOptions.thumbnails;

            if (!thumbnailsConfig) {
              return;
            }

            instance.vttThumbnails?.(thumbnailsConfig);
          } catch (error) {
            console.warn('[Video.js] Failed to initialise vttThumbnails plugin', error);
          }
        };

        registerQualityLevels();

        if (isHlsSource(src)) {
          registerQualitySelector();
        }

        registerVttThumbnails();

        if (isHlsSource(src)) {
          player?.on('loadedmetadata', registerQualityLevels);

          cleanupCallbacks.push(() => {
            player?.off('loadedmetadata', registerQualityLevels);
          });
        }

        onReadyRef.current?.(instance);
      });

      playerRef.current = player;
    } catch (error) {
      console.error('[Video.js] Failed to initialise player', error);
    }

    return () => {
      cleanupCallbacks.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.warn('[Video.js] Failed to cleanup plugin handler', error);
        }
      });

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
    // Intentionally run only once after initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const player = playerRef.current;

    if (!player || !src) {
      return;
    }

    const currentSource = player.currentSource();

    if (!currentSource || currentSource.src !== src) {
      player.src(buildSource(src));
    }

    if (isHlsSource(src)) {
      try {
        (player as VideoJsPlayerWithPlugins).hlsQualitySelector?.({
          displayCurrentQuality: true,
        });
      } catch (error) {
        console.warn('[Video.js] Failed to update hlsQualitySelector on source change', error);
      }
    }
  }, [src]);

  if (typeof window === 'undefined') {
    return <div className={clsx(styles.player, className)} />;
  }

  return (
    <div className={clsx(styles.player, className)}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
          playsInline
        />
      </div>
    </div>
  );
}

export default BaseVideoJsPlayer;
