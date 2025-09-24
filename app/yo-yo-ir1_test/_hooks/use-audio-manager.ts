'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

interface UseAudioManagerOptions {
  muted?: boolean;
  playerNames?: string[];
}

export interface AudioManagerApi {
  muted: boolean;
  setMuted: (m: boolean) => void;
  toggleMuted: () => void;
  playWarning: (playerName: string) => Promise<void>;
  playElimination: (playerName: string, distance: number) => Promise<void>;
}

const createAudio = (src: string): HTMLAudioElement => {
  const a = new Audio(src);
  a.preload = 'auto';
  return a;
};

const play = (audio: HTMLAudioElement): Promise<void> =>
  new Promise((resolve, reject) => {
    audio.currentTime = 0;
    const onEnd = () => {
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
      resolve();
    };
    const onErr = () => {
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
      reject(new Error(`Failed to play: ${audio.src}`));
    };
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onErr);
    void audio.play().catch((e) => {
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onErr);
      reject(e);
    });
  });

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function useAudioManager(
  opts: UseAudioManagerOptions = {},
): AudioManagerApi {
  const [muted, setMuted] = useState<boolean>(!!opts.muted);
  const cacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Pre-cache common phrases
  const warningAudio = useMemo(
    () => createAudio('/audio/yo-yo/name_voices/warning.mp3'),
    [],
  );
  const outAtAudio = useMemo(() => createAudio('/audio/yo-yo/out_at.mp3'), []);

  // Optionally warm the cache for player names
  useMemo(() => {
    if (!opts.playerNames || opts.playerNames.length === 0) return;
    for (const name of opts.playerNames) {
      const key = `name:${name.toLowerCase()}`;
      if (!cacheRef.current.has(key)) {
        cacheRef.current.set(
          key,
          createAudio(`/audio/yo-yo/name_voices/${name.toLowerCase()}.mp3`),
        );
      }
    }
  }, [opts.playerNames]);

  const getNameAudio = useCallback((name: string): HTMLAudioElement => {
    const key = `name:${name.toLowerCase()}`;
    let a = cacheRef.current.get(key);
    if (!a) {
      a = createAudio(`/audio/yo-yo/name_voices/${name.toLowerCase()}.mp3`);
      cacheRef.current.set(key, a);
    }
    return a;
  }, []);

  const getDistanceAudio = useCallback((distance: number): HTMLAudioElement => {
    // Distances have many variants; build on demand
    return createAudio(`/audio/yo-yo/distances/el_slow_${distance}m.mp3`);
  }, []);

  const playWarning = useCallback(
    async (playerName: string): Promise<void> => {
      if (muted) return;
      try {
        await play(warningAudio);
        // brief overlap/pause if desired
        await delay(200);
        await play(getNameAudio(playerName));
      } catch (e) {
        // non-fatal
        console.warn('Warning audio sequence failed', e);
      }
    },
    [muted, warningAudio, getNameAudio],
  );

  const playElimination = useCallback(
    async (playerName: string, distance: number): Promise<void> => {
      if (muted) return;
      try {
        await play(getNameAudio(playerName));
        await delay(200);
        await play(outAtAudio);
        await delay(200);
        await play(getDistanceAudio(distance));
      } catch (e) {
        console.warn('Elimination audio sequence failed', e);
      }
    },
    [muted, getNameAudio, outAtAudio, getDistanceAudio],
  );

  const toggleMuted = useCallback(() => setMuted((m) => !m), []);

  return { muted, setMuted, toggleMuted, playWarning, playElimination };
}

export default useAudioManager;
