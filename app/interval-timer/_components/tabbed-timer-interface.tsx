'use client';

import { BookOpen, Timer as TimerIcon } from 'lucide-react';
import { useMemo } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useIntervalTimer } from '../_hooks/use-interval-timer';
import ExerciseLibrary from './exercise-library';
import IntervalTimerInterface from './interval-timer-interface';

export default function TabbedTimerInterface() {
  const { state, controls, audio } = useIntervalTimer();

  const selectedPreset = useMemo(
    () => state.selectedPreset ?? null,
    [state.selectedPreset],
  );

  return (
    <Tabs defaultValue="timer" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Interval Timer
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your session and review exercise guidance without losing your
            place.
          </p>
        </div>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger className="gap-2" value="timer">
            <TimerIcon className="size-4" />
            <span>Timer</span>
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="library">
            <BookOpen className="size-4" />
            <span>Exercise Library</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent className="space-y-6" forceMount value="timer">
        <IntervalTimerInterface
          state={state}
          controls={controls}
          audio={audio}
        />
      </TabsContent>

      <TabsContent className="space-y-6" value="library">
        <ExerciseLibrary selectedPreset={selectedPreset} />
      </TabsContent>
    </Tabs>
  );
}
