'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectNative } from '@/components/ui/select-native';
import {
  Pause,
  Play,
  RotateCcw,
  StepBack,
  StepForward,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useTrainingTimer } from './use-training-timer';

export type Interval = {
  label: string;
  seconds: number;
  kind: 'work' | 'rest' | 'pause';
  videoId?: string;
};

export type TrainingTimerConfigInput = {
  sets: number;
  intervals: Interval[];
};

type Preset = {
  id: string;
  label: string;
  config: TrainingTimerConfigInput;
};

type TrainingTimerProps = {
  label?: string;
  defaultConfig: TrainingTimerConfigInput;
  presets?: Preset[];
  initialPresetId?: string;
};

function secondsToTimestamp(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${min}:${sec}`;
}

export function TrainingTimer({
  label = 'Interval Timer',
  defaultConfig,
  presets,
  initialPresetId,
}: TrainingTimerProps) {
  const [selectedPresetId, setSelectedPresetId] = useState(
    initialPresetId ?? presets?.[0]?.id,
  );

  const currentConfig = useMemo(() => {
    if (!presets || !selectedPresetId) {
      return defaultConfig;
    }
    return presets.find((p) => p.id === selectedPresetId)?.config ?? defaultConfig;
  }, [selectedPresetId, presets, defaultConfig]);

  const {
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
  } = useTrainingTimer(currentConfig);

  const progressPercent =
    totalDuration > 0 ? (totalTimeElapsed / totalDuration) * 100 : 0;

  useEffect(() => {
    // Play a sound at the end of an interval
    if (status === 'running' && timeRemainingInInterval === 3) {
      // could play a countdown sound
    }
    if (status === 'running' && timeRemainingInInterval === 0) {
      // could play a finish sound
    }
  }, [timeRemainingInInterval, status]);

  return (
    <Card className="max-w-xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{label}</CardTitle>
          {presets && presets.length > 0 && (
            <SelectNative
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              aria-label="Select a timer preset"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </SelectNative>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-foreground">
              {secondsToTimestamp(totalDuration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Elapsed</span>
            <span className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-foreground">
              {secondsToTimestamp(totalTimeElapsed)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
            <span className="rounded-md bg-primary/20 px-2.5 py-1 text-sm font-semibold font-mono tabular-nums text-primary">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>

      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-2">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            {currentInterval?.kind === 'work' && 'Übung'}
            {currentInterval?.kind === 'rest' && 'Pause'}
            {currentInterval?.kind === 'pause' && 'Nächste Übung'}
            {' '}{currentIndex + 1} / {currentConfig.intervals.length}
          </p>
          <p className="text-xl font-semibold truncate" title={currentInterval?.label}>
            {currentInterval?.label || 'Ready'}
          </p>
        </div>
        <div className="text-7xl font-bold tracking-tighter tabular-nums text-primary">
          {secondsToTimestamp(timeRemainingInInterval)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 relative">
        <Button variant="outline" size="icon" onClick={prev} disabled={status === 'running' || currentIndex === 0}>
          <StepBack className="h-5 w-5" />
          <span className="sr-only">Previous Interval</span>
        </Button>
        {status === 'running' ? (
          <Button size="lg" className="w-28" onClick={pause}>
            <Pause className="mr-2 h-5 w-5" /> Pause
          </Button>
        ) : (
          <Button size="lg" className="w-28" onClick={start}>
            <Play className="mr-2 h-5 w-5" />
            {status === 'paused' ? 'Resume' : status === 'finished' ? 'Restart' : 'Start'}
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={next} disabled={status === 'running' || status === 'finished'}>
          <StepForward className="h-5 w-5" />
          <span className="sr-only">Next Interval</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={reset} className="absolute right-6">
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">Reset Timer</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
