export type SoundItem = {
  id: string;
  label: string;
  src: string;
  sources: string[];
  ttsFallback?: boolean;
};

export type Topic = {
  id: string;
  name: string;
  sounds: SoundItem[];
};
