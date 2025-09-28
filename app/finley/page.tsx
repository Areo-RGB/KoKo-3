'use client';

import { TrainingTimer } from '@/components/training-timer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildFifaTimerConfig } from './_lib/training-plans/fifa-timer';
import DailyChecklistTimeline from '@/components/comp-534';

const FIFA_TIMER_CONFIG = buildFifaTimerConfig();

const TIMER_PRESETS = [
  {
    id: 'fifa_1',
    label: 'FIFA 11+ (Part 2, Level 1)',
    config: FIFA_TIMER_CONFIG,
  },
];

export default function FinleyPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Finley Training Hub
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Snapshot of Finley&apos;s current focus areas, guided playlists, and
          interval tools to keep sessions sharp.
        </p>
      </header>

      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList>
          <TabsTrigger value="checklist">Ziele</TabsTrigger>
          <TabsTrigger value="timer">Interval Timer</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-6">
          <section className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Levels</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Celebrate the micro-goals that keep momentum high.
            </p>
            <DailyChecklistTimeline />
          </section>
        </TabsContent>

        <TabsContent value="timer">
          <TrainingTimer
            label="Finley&apos;s Interval Timer"
            defaultConfig={FIFA_TIMER_CONFIG}
            presets={TIMER_PRESETS}
            initialPresetId="fifa_1"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
