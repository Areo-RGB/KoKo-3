'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TrainingTimerConfigInput } from '.';

const useTimerTick = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current?.(), delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

export const useTrainingTimer = (config: TrainingTimerConfigInput) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);

  const { totalDuration, timePerInterval } = useMemo(() => {
    const timePer = config.intervals.map((i) => i.seconds);
    const total = timePer.reduce((sum, t) => sum + t, 0) * config.sets;
    return { totalDuration: total, timePerInterval: timePer };
  }, [config]);

  const [timeRemainingInInterval, setTimeRemainingInInterval] = useState(
    timePerInterval[0] ?? 0,
  );

  const totalTimeElapsed = useMemo(() => {
    let elapsed = 0;
    for (let i = 0; i < currentIndex; i++) {
      elapsed += timePerInterval[i] ?? 0;
    }
    elapsed += (timePerInterval[currentIndex] ?? 0) - timeRemainingInInterval;
    return elapsed;
  }, [currentIndex, timeRemainingInInterval, timePerInterval]);

  const currentInterval = config.intervals[currentIndex] ?? null;

  const tick = useCallback(() => {
    if (status !== 'running') return;

    if (timeRemainingInInterval > 1) {
      setTimeRemainingInInterval((t) => t - 1);
    } else {
      // End of interval
      if (currentIndex < config.intervals.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setTimeRemainingInInterval(timePerInterval[nextIndex] ?? 0);
      } else {
        // End of session
        setStatus('finished');
        setTimeRemainingInInterval(0);
      }
    }
  }, [status, timeRemainingInInterval, currentIndex, config.intervals.length, timePerInterval]);

  useTimerTick(tick, status === 'running' ? 1000 : null);

  const start = useCallback(() => {
    if (status === 'finished') {
      setCurrentIndex(0);
      setTimeRemainingInInterval(timePerInterval[0] ?? 0);
    }
    setStatus('running');
  }, [status, timePerInterval]);

  const pause = useCallback(() => {
    if (status === 'running') {
      setStatus('paused');
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setCurrentIndex(0);
    setTimeRemainingInInterval(timePerInterval[0] ?? 0);
  }, [timePerInterval]);

  const next = useCallback(() => {
    if (currentIndex < config.intervals.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeRemainingInInterval(timePerInterval[nextIndex] ?? 0);
    } else if (status !== 'finished') {
      setStatus('finished');
      setTimeRemainingInInterval(0);
    }
  }, [currentIndex, config.intervals.length, timePerInterval, status]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setTimeRemainingInInterval(timePerInterval[prevIndex] ?? 0);
    }
  }, [currentIndex, timePerInterval]);

  // Effect to reset state when config changes
  useEffect(() => {
    reset();
  }, [config, reset]);

  return {
    status,
    currentIndex,
    timeRemainingInInterval,
    totalTimeElapsed,
    totalDuration,
    currentInterval,
    start,
    pause,
    reset,
    next,
    prev,
  };
};