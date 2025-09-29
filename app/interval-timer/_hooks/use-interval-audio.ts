import { useCallback, useState } from 'react';

const AUDIO_FILES = {
  start: '/audio/interval/start.mp3',
  end: '/audio/interval/end.mp3',
  rest: '/audio/interval/rest.mp3',
  finish: '/audio/interval/finish.mp3',
  transition: '/audio/interval/transition.mp3',
  sideChange: '/audio/interval/side-change.mp3',
};

const audioCache = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement {
  if (audioCache.has(src)) {
    return audioCache.get(src)!;
  }
  const audio = new Audio(src);
  audio.preload = 'auto';
  audioCache.set(src, audio);
  return audio;
}

async function playAudio(src: string, volume: number, muted: boolean) {
  if (muted) return;
  try {
    const audio = getAudio(src);
    audio.volume = volume;
    audio.currentTime = 0;
    await audio.play();
  } catch (error) {
    console.warn(`Could not play audio: ${src}`, error);
  }
}

export function useIntervalAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const playStartBeep = useCallback(() => playAudio(AUDIO_FILES.start, volume, isMuted), [volume, isMuted]);
  const playEndBeep = useCallback(() => playAudio(AUDIO_FILES.end, volume, isMuted), [volume, isMuted]);
  const playRestBeep = useCallback(() => playAudio(AUDIO_FILES.rest, volume, isMuted), [volume, isMuted]);
  const playFinishBeep = useCallback(() => playAudio(AUDIO_FILES.finish, volume, isMuted), [volume, isMuted]);
  const playTransitionBeep = useCallback(() => playAudio(AUDIO_FILES.transition, volume, isMuted), [volume, isMuted]);
  const playSideChangeBeep = useCallback(() => playAudio(AUDIO_FILES.sideChange, volume, isMuted), [volume, isMuted]);
  
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return {
    isMuted,
    volume,
    setVolume,
    toggleMute,
    playStartBeep,
    playEndBeep,
    playRestBeep,
    playFinishBeep,
    playTransitionBeep,
    playSideChangeBeep,
  };
}