export interface Drill {
  id: number;
  name: string;
  videoUrl: string;
  videoFile: string;
  description: string;
  level?: string;
}

export interface Video {
  id: string;
  title: string;
  startTime: number;
  duration: number;
}

export interface Playlist {
  title: string;
  videos: Video[];
}