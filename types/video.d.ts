// types/video.d.ts
export interface VideoChapter {
  id: string;
  title: string;
  description?: string;
  timestamp?: number; // in seconds - optional for DFB performance tests
  duration?: number; // chapter duration in seconds
  rank?: number;
  score?: string;
  videoUrl?: string; // individual video URL for DFB clips
  thumbnail?: string; // chapter-specific thumbnail
}

export interface VideoData {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  duration: number; // total video duration in seconds
  chapters: VideoChapter[];
}

export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  duration: string; // formatted duration (e.g., "2:33")
  videoId: string;
  chapterId?: string; // if this item represents a chapter/timestamp
  isNew?: boolean;
  rank?: number;
  score?: string;
}

export interface VideoPlayerHandle {
  switchSource: (url: string, time?: number) => Promise<void>;
  seek: (time: number) => void;
  play: () => Promise<void>;
  pause: () => void;
}

export interface VideoPlayerHTML5Props {
  video: VideoData;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  onVideoEnd?: () => void;
  className?: string;
  currentChapter?: VideoChapter;
  // MiniCards overlay props
  playlistItems?: PlaylistItem[];
  activeItemId?: string;
  onItemSelect?: (item: PlaylistItem) => void;
}

export interface VideoMiniCardsOverlayProps {
  items: PlaylistItem[];
  activeId?: string;
  onSelect: (item: PlaylistItem) => void;
}
