export interface TimerConfig {
  workSeconds: number;
  sets: number;
  restSeconds?: number;
  note?: string;
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
