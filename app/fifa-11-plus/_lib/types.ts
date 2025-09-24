export interface Video {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  startTime?: number;
  isHeader?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  videos: Video[];
}
