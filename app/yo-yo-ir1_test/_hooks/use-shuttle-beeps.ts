'use client';

import type { ShuttleEvent, TestPhase } from '@/app/yo-yo-ir1_test/_lib/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type AudioContextStateWithUnavailable =
  | AudioContextState
  | 'uninitialized'
  | 'unavailable';

interface ScheduledBeep {
  oscillator: OscillatorNode;
  gain: GainNode;
  startTime: number;
  stopTime: number;
}

interface UseShuttleBeepsArgs {
  events: readonly ShuttleEvent[];
  currentTime: number;
  currentEventIndex: number;
  isRunning: boolean;
  testPhase: TestPhase;
  options?: {
    lookaheadSeconds?: number;
    beepDurationSeconds?: number;
    frequencyHz?: number;
    gain?: number;
  };
}

export interface ShuttleBeepsController {
  /**
   * Prime (or resume) the Web Audio context so future scheduling succeeds.
   * Should be invoked from a direct user gesture (e.g. the Start button).
   */
  start: () => Promise<void>;
  /** Cancel any future beeps without closing the audio context. */
  pause: () => void;
  /**
   * Cancel all scheduled beeps and reposition the internal cursor.
   * Used when the timeline seeks (reset/jump).
   */
  seek: (time: number, eventIndex?: number) => void;
  /** Immediately tear down the Web Audio context. */
  stop: () => void;
  /** Diagnostic state of the underlying audio context. */
  contextState: AudioContextStateWithUnavailable;
  /** True when the browser exposes the Web Audio API. */
  isSupported: boolean;
}

const DEFAULT_LOOKAHEAD_SECONDS = 1.6;
const DEFAULT_BEEP_DURATION = 0.32;
const DEFAULT_FREQUENCY = 880;
const DEFAULT_GAIN = 0.25;
const ATTACK = 0.018;
const RELEASE = 0.06;
const EPSILON = 1e-3;

const resolveAudioContextConstructor = (): (new () => AudioContext) | null => {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: new () => AudioContext })
      .webkitAudioContext ??
    null
  );
};

const clampEventIndex = (index: number, eventsLength: number): number => {
  if (index < 0) return 0;
  if (index >= eventsLength) return eventsLength;
  return index;
};

export function useShuttleBeeps({
  events,
  currentTime,
  currentEventIndex,
  isRunning,
  testPhase,
  options,
}: UseShuttleBeepsArgs): ShuttleBeepsController {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pendingBeepsRef = useRef<Map<string, ScheduledBeep>>(new Map());
  const nextScanIndexRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(currentTime);
  const prevEventIndexRef = useRef<number>(currentEventIndex);
  const eventsRef = useRef<readonly ShuttleEvent[]>(events);

  const [contextState, setContextState] =
    useState<AudioContextStateWithUnavailable>('uninitialized');
  const [isSupported, setIsSupported] = useState<boolean>(
    () => resolveAudioContextConstructor() != null,
  );

  const lookaheadSeconds =
    options?.lookaheadSeconds ?? DEFAULT_LOOKAHEAD_SECONDS;
  const beepDuration = options?.beepDurationSeconds ?? DEFAULT_BEEP_DURATION;
  const frequency = options?.frequencyHz ?? DEFAULT_FREQUENCY;
  const gainLevel = options?.gain ?? DEFAULT_GAIN;

  const findIndexAtOrAfter = useCallback((time: number): number => {
    const list = eventsRef.current;
    if (list.length === 0) return 0;
    let idx = 0;
    while (idx < list.length && list[idx].timestamp < time - EPSILON) idx += 1;
    return idx;
  }, []);

  const clearScheduledBeeps = useCallback((cancelAll: boolean) => {
    const ctx = audioContextRef.current;
    const now = ctx?.currentTime ?? 0;
    for (const [key, beep] of pendingBeepsRef.current) {
      const shouldCancel = cancelAll || beep.startTime - now > EPSILON;
      if (!shouldCancel) continue;
      try {
        beep.oscillator.onended = null;
        beep.oscillator.stop();
      } catch {
        // no-op: oscillator may already be stopped
      }
      beep.oscillator.disconnect();
      beep.gain.disconnect();
      pendingBeepsRef.current.delete(key);
    }
  }, []);

  const updateContextState = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) {
      setContextState((prev) =>
        prev === 'unavailable' ? 'unavailable' : 'uninitialized',
      );
      return;
    }
    setContextState(ctx.state);
  }, []);

  const scheduleBeeps = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || ctx.state !== 'running') return;
    if (!isRunning) return;
    const list = eventsRef.current;
    if (list.length === 0) return;

    const now = ctx.currentTime;
    const startIndex = clampEventIndex(
      Math.max(nextScanIndexRef.current, currentEventIndex - 1),
      list.length,
    );
    let scanIndex = startIndex;

    while (scanIndex < list.length) {
      const evt = list[scanIndex];
      if (evt.type !== 'beep_start') {
        scanIndex += 1;
        continue;
      }

      const delta = evt.timestamp - currentTime;

      if (delta < -0.05) {
        pendingBeepsRef.current.delete(scanIndex.toString());
        scanIndex += 1;
        continue;
      }

      if (delta > lookaheadSeconds) {
        break;
      }

      const key = scanIndex.toString();
      if (!pendingBeepsRef.current.has(key)) {
        const startAt = now + Math.max(0, delta);
        const stopAt = startAt + beepDuration;

        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startAt);

        const gainNode = ctx.createGain();
        const sustainStart = startAt + ATTACK;
        const sustainEnd = Math.max(sustainStart, stopAt - RELEASE);

        gainNode.gain.setValueAtTime(0, startAt);
        gainNode.gain.linearRampToValueAtTime(gainLevel, sustainStart);
        gainNode.gain.setValueAtTime(gainLevel, sustainEnd);
        gainNode.gain.linearRampToValueAtTime(0.0001, stopAt);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.onended = () => {
          oscillator.disconnect();
          gainNode.disconnect();
          pendingBeepsRef.current.delete(key);
        };

        oscillator.start(startAt);
        oscillator.stop(stopAt);

        pendingBeepsRef.current.set(key, {
          oscillator,
          gain: gainNode,
          startTime: startAt,
          stopTime: stopAt,
        });
      }

      scanIndex += 1;
    }

    nextScanIndexRef.current = scanIndex;
  }, [
    beepDuration,
    currentEventIndex,
    currentTime,
    frequency,
    gainLevel,
    isRunning,
    lookaheadSeconds,
  ]);

  const start = useCallback(async (): Promise<void> => {
    const Ctor = resolveAudioContextConstructor();
    if (!Ctor) {
      setIsSupported(false);
      setContextState('unavailable');
      return;
    }

    let ctx = audioContextRef.current;
    if (!ctx) {
      ctx = new Ctor();
      audioContextRef.current = ctx;
      ctx.onstatechange = updateContextState;
      updateContextState();
    }

    if (ctx.state === 'suspended') {
      await ctx.resume();
      updateContextState();
    }

    scheduleBeeps();
  }, [scheduleBeeps, updateContextState]);

  const pause = useCallback((): void => {
    clearScheduledBeeps(false);
  }, [clearScheduledBeeps]);

  const stop = useCallback((): void => {
    clearScheduledBeeps(true);
    const ctx = audioContextRef.current;
    if (!ctx) return;
    void ctx.close().catch(() => {
      // ignore close failures (some browsers disallow closing resumed contexts synchronously)
    });
    audioContextRef.current = null;
    setContextState('uninitialized');
  }, [clearScheduledBeeps]);

  const seek = useCallback(
    (time: number, eventIndex?: number): void => {
      clearScheduledBeeps(true);
      const idx = eventIndex ?? findIndexAtOrAfter(time);
      nextScanIndexRef.current = clampEventIndex(idx, eventsRef.current.length);
      prevTimeRef.current = time;
      prevEventIndexRef.current = idx;
    },
    [clearScheduledBeeps, findIndexAtOrAfter],
  );

  useEffect(() => {
    eventsRef.current = events;
    seek(currentTime, currentEventIndex);
  }, [events, currentTime, currentEventIndex, seek]);

  useEffect(() => {
    scheduleBeeps();
  }, [scheduleBeeps]);

  useEffect(() => {
    if (!isRunning) {
      clearScheduledBeeps(false);
    }
  }, [clearScheduledBeeps, isRunning]);

  useEffect(() => {
    if (testPhase === 'finished') {
      clearScheduledBeeps(true);
    }
  }, [clearScheduledBeeps, testPhase]);

  useEffect(() => {
    if (
      currentEventIndex < prevEventIndexRef.current ||
      currentTime + EPSILON < prevTimeRef.current
    ) {
      seek(currentTime, currentEventIndex);
    }
    prevEventIndexRef.current = currentEventIndex;
    prevTimeRef.current = currentTime;
  }, [currentEventIndex, currentTime, seek]);

  useEffect(
    () => () => {
      clearScheduledBeeps(true);
      const ctx = audioContextRef.current;
      if (ctx && ctx.state !== 'closed') {
        void ctx.close().catch(() => undefined);
      }
      audioContextRef.current = null;
    },
    [clearScheduledBeeps],
  );

  return useMemo(
    () => ({
      start,
      pause,
      stop,
      seek,
      contextState,
      isSupported,
    }),
    [contextState, isSupported, pause, seek, start, stop],
  );
}

export default useShuttleBeeps;
