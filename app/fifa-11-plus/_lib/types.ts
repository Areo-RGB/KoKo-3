export interface TimerConfig {
  workSeconds: number;
  sets: number;
  restSeconds?: number;
  note?: string;
}

export interface Drill {
  id: number;
  name: string;
  videoUrl: string;
  videoFile: string;
  description: string;
  level?: '1' | '2' | '3';
}

export interface Video {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  startTime?: number;
  isHeader?: boolean;
  timer?: TimerConfig;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: Video[];
}
