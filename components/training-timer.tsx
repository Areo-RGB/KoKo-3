'use client';

import VideoPlayer from '@/app/fifa-11-plus/_components/video-player';
import { MAIN_VIDEO_URL, PLAYLIST } from '@/app/fifa-11-plus/_lib/data';
import type { Video } from '@/app/fifa-11-plus/_lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/util/utils';
import {
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  SkipForward,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type IntervalKind = 'work' | 'rest' | 'pause';

type TimerInterval = {
  id: string;
  label: string;
  seconds: number;
  kind: IntervalKind;
  videoId?: string;
};

type TimerIntervalInput = Omit<TimerInterval, 'id'> & { id?: string };

type TimerConfig = {
  sets: number;
  intervals: TimerInterval[];
};

export type TrainingTimerConfigInput = {
  sets?: number;
  intervals?: TimerIntervalInput[];
};

type TimerPreset = {
  id: string;
  label: string;
  config: TrainingTimerConfigInput;
};

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

type TimerProps = {
  className?: string;
  label?: string;
  defaultConfig?: TrainingTimerConfigInput;
  presets?: TimerPreset[];
  initialPresetId?: string;
  onComplete?: () => void;
};

type BeepType = 'workStart' | 'workEnd' | 'pauseStart' | 'pauseEnd';

function generateId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

const DEFAULT_INTERVALS: TimerInterval[] = [
  {
    id: generateId(),
    label: 'Mobility Prep',
    seconds: 90,
    kind: 'work',
  },
  {
    id: generateId(),
    label: 'Reset',
    seconds: 30,
    kind: 'rest',
  },
  {
    id: generateId(),
    label: 'Main Push',
    seconds: 120,
    kind: 'work',
  },
];

const DEFAULT_CONFIG: TimerConfig = {
  sets: 3,
  intervals: DEFAULT_INTERVALS,
};

type PlaybackState = {
  status: TimerStatus;
  activeSet: number;
  intervalIndex: number;
  timeLeft: number;
};

function clampNumber(value: number, fallback: number, min: number) {
  if (Number.isNaN(value)) return fallback;
  if (value < min) return fallback;
  return value;
}

function formatSeconds(totalSeconds: number) {
  const safeSeconds =
    Number.isFinite(totalSeconds) && totalSeconds > 0
      ? Math.floor(totalSeconds)
      : 0;
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function normaliseConfig(input?: TrainingTimerConfigInput): TimerConfig {
  const sets = clampNumber(
    input?.sets ?? DEFAULT_CONFIG.sets,
    DEFAULT_CONFIG.sets,
    1,
  );
  const sourceIntervals =
    input?.intervals && input.intervals.length > 0
      ? input.intervals
      : DEFAULT_INTERVALS;

  const intervals = sourceIntervals.map((interval) => ({
    id: interval.id ?? generateId(),
    label: interval.label ?? 'Interval',
    seconds: clampNumber(interval.seconds ?? 30, 30, 1),
    kind: interval.kind ?? 'work',
    videoId: interval.videoId,
  }));

  return {
    sets,
    intervals,
  };
}

export function TrainingTimer({
  className,
  label = 'Interval Timer',
  defaultConfig,
  presets,
  initialPresetId,
  onComplete,
}: TimerProps) {
  const baseConfig = useMemo(
    () => normaliseConfig(defaultConfig),
    [defaultConfig],
  );

  const presetOptions = useMemo(
    () =>
      (presets ?? []).map((preset) => ({
        id: preset.id,
        label: preset.label,
        config: normaliseConfig(preset.config),
      })),
    [presets],
  );

  const hasPresets = presetOptions.length > 0;

  const initialPresetValue = useMemo(() => {
    if (!hasPresets) return null;
    if (
      initialPresetId &&
      presetOptions.some((preset) => preset.id === initialPresetId)
    ) {
      return initialPresetId;
    }
    return presetOptions[0].id;
  }, [hasPresets, initialPresetId, presetOptions]);

  const [selectedPresetId, setSelectedPresetId] =
    useState(initialPresetValue);

  const config = useMemo(() => {
    if (!hasPresets) return baseConfig;
    const selected = presetOptions.find((p) => p.id === selectedPresetId);
    return selected?.config ?? baseConfig;
  }, [selectedPresetId, hasPresets, presetOptions, baseConfig]);

  const [playback, setPlayback] = useState<PlaybackState>({
    status: 'idle',
    activeSet: 1,
    intervalIndex: 0,
    timeLeft: 0,
  });

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const videoDrills = useMemo(() => {
    const drills: Video[] = [];
    const seenVideoIds = new Set<string>();

    config.intervals.forEach((interval) => {
      if (interval.videoId && !seenVideoIds.has(interval.videoId)) {
        const videoData = PLAYLIST.videos.find(
          (v) => v.id === interval.videoId,
        );
        if (videoData) {
          drills.push(videoData);
          seenVideoIds.add(interval.videoId);
        }
      }
    });

    return drills;
  }, [config.intervals]);

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTick();
    setPlayback({
      status: 'idle',
      activeSet: 1,
      intervalIndex: 0,
      timeLeft: config.intervals[0]?.seconds ?? 0,
    });
    setSelectedVideo(null); // Reset video when config changes
  }, [config, clearTick]);

  const playBeep = useCallback((type: BeepType) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }

    const play = (
      freq: number,
      duration: number,
      delay = 0,
      waveType: OscillatorType = 'sine',
    ) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtx.currentTime + duration / 1000,
        );

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration / 1000);
      }, delay);
    };

    switch (type) {
      case 'workStart': // Drill start
        play(880, 150);
        break;
      case 'workEnd': // Drill end
        play(523, 300);
        break;
      case 'pauseStart': // Pause start
        play(659, 100);
        play(523, 100, 120);
        break;
      case 'pauseEnd': // Pause end warning (get ready)
        play(659, 80, 0, 'square');
        play(659, 80, 150, 'square');
        break;
      default:
        break;
    }
  }, []);

  const initAudio = useCallback(() => {
    if (typeof window !== 'undefined' && !audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      } catch (e) {
        console.error('Web Audio API is not supported in this browser');
      }
    }
  }, []);

  const resetPlayback = useCallback(
    (nextStatus: TimerStatus = 'idle') => {
      clearTick();
      const firstSeconds = config.intervals[0]?.seconds ?? 0;
      setPlayback({
        status: nextStatus,
        activeSet: 1,
        intervalIndex: 0,
        timeLeft: firstSeconds,
      });
    },
    [clearTick, config.intervals],
  );

  const advanceInterval = useCallback(() => {
    setPlayback((prev) => {
      const intervalsCount = config.intervals.length;
      if (intervalsCount === 0) {
        return {
          status: 'idle',
          activeSet: 1,
          intervalIndex: 0,
          timeLeft: 0,
        };
      }

      const isLastInterval = prev.intervalIndex >= intervalsCount - 1;
      let nextIndex = prev.intervalIndex + 1;
      let nextSet = prev.activeSet;

      if (isLastInterval) {
        nextSet += 1;
        if (nextSet > config.sets) {
          clearTick();
          if (prev.status === 'running') {
            onComplete?.();
          }
          return {
            status: 'finished',
            activeSet: prev.activeSet,
            intervalIndex: prev.intervalIndex,
            timeLeft: 0,
          };
        }
        nextIndex = 0;
      }

      const nextInterval = config.intervals[nextIndex];
      if (nextInterval) {
        if (nextInterval.kind === 'work') {
          playBeep('workStart');
        } else {
          playBeep('pauseStart');
        }
      }

      const nextDuration = nextInterval?.seconds ?? 0;
      return {
        status: prev.status,
        activeSet: nextSet,
        intervalIndex: nextIndex,
        timeLeft: nextDuration,
      };
    });
  }, [clearTick, config.intervals, config.sets, onComplete, playBeep]);

  useEffect(() => {
    if (playback.status !== 'running') {
      clearTick();
      return;
    }

    if (playback.timeLeft <= 0) {
      advanceInterval();
      return;
    }

    if (playback.timeLeft === 2) {
      // Play warning with 1 second left.
      const current = config.intervals[playback.intervalIndex];
      if (current) {
        const nextIsWork =
          (config.intervals[playback.intervalIndex + 1] ??
            config.intervals[0])?.kind === 'work';
        if (current.kind === 'work') {
          playBeep('workEnd');
        } else if (nextIsWork) {
          playBeep('pauseEnd');
        }
      }
    }

    intervalRef.current = window.setInterval(() => {
      setPlayback((prev) => ({
        ...prev,
        timeLeft: Math.max(prev.timeLeft - 1, 0),
      }));
    }, 1000);

    return clearTick;
  }, [
    advanceInterval,
    clearTick,
    config.intervals,
    playBeep,
    playback.status,
    playback.timeLeft,
    playback.intervalIndex,
  ]);

  const currentInterval = config.intervals[playback.intervalIndex];
  const nextInterval = useMemo(() => {
    if (!currentInterval) return undefined;
    const isLastIntervalInSet =
      playback.intervalIndex >= config.intervals.length - 1;
    if (isLastIntervalInSet) {
      const isLastSet = playback.activeSet >= config.sets;
      if (isLastSet) return undefined;
      return config.intervals[0];
    }
    return config.intervals[playback.intervalIndex + 1];
  }, [
    config.intervals,
    playback.activeSet,
    playback.intervalIndex,
    config.sets,
    currentInterval,
  ]);

  const handleStart = () => {
    initAudio();
    if (config.intervals.length === 0) return;

    if (playback.status === 'finished') {
      const firstInterval = config.intervals[0];
      if (firstInterval?.kind === 'work') playBeep('workStart');
      else playBeep('pauseStart');
      resetPlayback('running');
      return;
    }

    if (playback.status === 'idle') {
      const firstInterval = config.intervals[0];
      if (firstInterval?.kind === 'work') playBeep('workStart');
      else playBeep('pauseStart');
    }

    setPlayback((prev) => ({ ...prev, status: 'running' }));
  };

  const handlePause = () => {
    setPlayback((prev) => ({ ...prev, status: 'paused' }));
  };

  const handleReset = () => {
    clearTick();
    resetPlayback('idle');
  };

  const handleSkip = () => {
    advanceInterval();
  };

  const handleAddSeconds = (amount: number) => {
    setPlayback((prev) => ({
      ...prev,
      timeLeft: Math.max(prev.timeLeft + amount, 0),
    }));
  };

  const handlePresetSelect = (value: string) => {
    if (value === selectedPresetId) return;
    const preset = presetOptions.find((option) => option.id === value);
    if (!preset) return;
    setSelectedPresetId(preset.id);
  };

  const isRunning = playback.status === 'running';
  const isPaused = playback.status === 'paused';
  const isFinished = playback.status === 'finished';
  const disableStart = config.intervals.length === 0;
  const disablePresetSelect = isRunning;

  const totalSeconds = useMemo(() => {
    const setDuration = config.intervals.reduce(
      (sum, interval) => sum + interval.seconds,
      0,
    );
    return setDuration * config.sets;
  }, [config.intervals, config.sets]);

  const elapsedSeconds = useMemo(() => {
    if (playback.status === 'finished') return totalSeconds;
    const completedSetsDuration =
      (playback.activeSet - 1) *
      config.intervals.reduce((sum, i) => sum + i.seconds, 0);
    const completedIntervalsDuration = config.intervals
      .slice(0, playback.intervalIndex)
      .reduce((sum, interval) => sum + interval.seconds, 0);
    const currentIntervalDuration =
      config.intervals[playback.intervalIndex]?.seconds ?? 0;
    const currentIntervalElapsed =
      currentIntervalDuration - playback.timeLeft;
    return (
      completedSetsDuration +
      completedIntervalsDuration +
      Math.max(currentIntervalElapsed, 0)
    );
  }, [
    config.intervals,
    playback.activeSet,
    playback.intervalIndex,
    playback.timeLeft,
    playback.status,
    totalSeconds,
  ]);

  const progress =
    totalSeconds > 0 ? Math.min(elapsedSeconds / totalSeconds, 1) : 0;

  return (
    <div
      className={cn(
        'space-y-6 rounded-lg border bg-card p-6 shadow-sm',
        className,
      )}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{label}</h2>
        <p className="text-sm text-muted-foreground">
          Select a preset training plan and use the timer controls to guide your
          session.
        </p>
      </div>

      {hasPresets ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Preset
          </span>
          <Select
            value={selectedPresetId ?? ''}
            onValueChange={handlePresetSelect}
            disabled={disablePresetSelect}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Choose preset" />
            </SelectTrigger>
            <SelectContent>
              {presetOptions.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {/* Video Player Section */}
      {videoDrills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Drill Demonstrations</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isRunning}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Choose Drill</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {videoDrills.map((video) => (
                  <DropdownMenuItem
                    key={video.id}
                    onSelect={() => handleVideoSelect(video)}
                  >
                    {video.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedVideo ? (
            <VideoPlayer
              key={selectedVideo.id}
              videoUrl={MAIN_VIDEO_URL}
              startTime={selectedVideo.startTime}
            />
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
              <div className="text-center p-4">
                <PlayCircle className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  Select a drill from the dropdown to see a demonstration.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Set {Math.min(playback.activeSet, config.sets)} of {config.sets}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">Total</span>
          <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
            {formatSeconds(totalSeconds)}
          </span>
          <span className="font-medium">Elapsed</span>
          <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
            {formatSeconds(elapsedSeconds)}
          </span>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 text-sm font-medium">
          Rounds
          <div className="flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-background/50 px-3 py-1 text-base shadow-xs md:text-sm">
            {config.sets}
          </div>
        </div>
        <div className="space-y-1 md:col-span-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Current
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
            <div>
              <div className="text-sm font-semibold">
                {currentInterval?.label ?? 'No interval'}
              </div>
              <div className="text-xs capitalize text-muted-foreground">
                {currentInterval?.kind ?? 'n/a'}
              </div>
            </div>
            <div className="font-mono text-3xl tabular-nums">
              {formatSeconds(playback.timeLeft)}
            </div>
          </div>
          {nextInterval !== undefined ? (
            <div className="text-xs text-muted-foreground">
              Next: {nextInterval.label} · {formatSeconds(nextInterval.seconds)}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Next: sequence complete
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleStart}
          disabled={disableStart || isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {playback.status === 'paused' ? 'Resume' : 'Start'}
        </Button>
        <Button
          onClick={handlePause}
          disabled={!isRunning}
          variant="outline"
          className="gap-2"
        >
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button
          onClick={handleSkip}
          disabled={!isRunning && !isPaused}
          variant="outline"
          className="gap-2"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
        <Button onClick={handleReset} variant="secondary" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={() => handleAddSeconds(10)}
          variant="ghost"
          className="gap-1"
          disabled={!isRunning && !isPaused}
        >
          <Plus className="h-4 w-4" />
          10s
        </Button>
      </div>

      {isFinished ? (
        <div className="rounded border border-dashed bg-muted/40 p-3 text-sm text-muted-foreground">
          Sequence complete. Press Reset to run again.
        </div>
      ) : null}
    </div>
  );
}
