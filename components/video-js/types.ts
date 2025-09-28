import type { PlaylistItem } from '@/app/video-player/_lib/video-data';
import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

export interface VideoJsSourceResolution {
  width?: number;
  height?: number;
}

export interface VideoJsSource {
  src: string;
  type?: string;
  label?: string;
  default?: boolean;
  bandwidth?: number;
  resolution?: VideoJsSourceResolution;
}

export interface VideoJsTextTrack {
  src: string;
  kind?: string;
  srclang?: string;
  label?: string;
  default?: boolean;
}

export interface VideoJsPlaylistItem extends PlaylistItem {
  posterUrl?: string;
  thumbnailUrl?: string;
  spriteMap?: string;
  sources?: VideoJsSource[];
  textTracks?: VideoJsTextTrack[];
  meta?: Record<string, unknown>;
  defaultQuality?: string;
  adaptiveStreaming?: boolean;
}

export type OnVideoSelectHandler = (payload: {
  index: number;
  item: VideoJsPlaylistItem;
}) => void;

export type OnPlayerReadyHandler = (player: VideoJsPlayer) => void;

export type OnPlaylistChangeHandler = (payload: {
  index: number;
  previousIndex: number | null;
  item: VideoJsPlaylistItem;
  playlist: VideoJsPlaylistItem[];
}) => void;

export interface QualityLevel {
  id: string;
  label?: string;
  width?: number;
  height?: number;
  bandwidth?: number;
  enabled: boolean;
}

export interface QualityLevelsChangeEvent {
  levels: QualityLevel[];
  selectedQuality: QualityLevel | null;
}

export type OnQualityChangeHandler = (event: QualityLevelsChangeEvent) => void;

export interface QualityLevelsConfig {
  autoSelect?: boolean;
  preferredQualityId?: string;
  onChange?: OnQualityChangeHandler;
}

export interface QualitySelectorConfig {
  displayCurrentQuality?: boolean;
  placementIndex?: number;
  vjsIconClass?: string;
  label?: string;
  disableAuto?: boolean;
}

export interface VttThumbnailsConfig {
  src: string;
  showTimestamp?: boolean;
  width?: number;
  height?: number;
  spriteUrl?: string;
  responsive?: boolean;
  [key: string]: unknown;
}

export type QualityLevelList = {
  readonly length: number;
  selectedIndex: number;
  [index: number]: QualityLevel;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
};

export type VideoJsPlayerWithPlugins = VideoJsPlayer & {
  hlsQualitySelector?: (options?: QualitySelectorConfig) => void;
  playlist?: (items: unknown[], options?: Record<string, unknown>) => unknown;
  qualityLevels?: () => QualityLevelList | undefined;
  vttThumbnails?: (config: VttThumbnailsConfig | string) => void;
};

export interface VideoJsPlayerConfig {
  playerOptions?: VideoJsPlayerOptions;
  playbackRates?: number[];
  autoAdvance?: {
    enabled: boolean;
    delay?: number;
  };
  loop?: boolean;
  qualitySelector?: QualitySelectorConfig;
  thumbnails?: VttThumbnailsConfig;
  qualityLevels?: QualityLevelsConfig;
}

export interface PlaylistConfig {
  title?: string;
  collapsible?: boolean;
  showThumbnails?: boolean;
  defaultCollapsed?: boolean;
}

export interface VideoJsPlayerProps {
  playlist: VideoJsPlaylistItem[];
  initialIndex?: number;
  currentIndex?: number;
  onReady?: OnPlayerReadyHandler;
  onVideoSelect?: OnVideoSelectHandler;
  onPlaylistChange?: OnPlaylistChangeHandler;
  playerConfig?: VideoJsPlayerConfig;
  playlistConfig?: PlaylistConfig;
  className?: string;
  sidebarClassName?: string;
  autoPlay?: boolean;
}

export interface PlaylistSidebarProps {
  playlist: VideoJsPlaylistItem[];
  currentIndex: number;
  isPlaying: boolean;
  onVideoSelect: OnVideoSelectHandler;
  isMobile?: boolean;
  isCollapsible?: boolean;
  progressMap?: Record<string, number>;
  title?: string;
  className?: string;
}

export interface PlaylistItemProps {
  item: VideoJsPlaylistItem;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  progress?: number;
  onSelect: OnVideoSelectHandler;
  isMobile?: boolean;
  className?: string;
}
