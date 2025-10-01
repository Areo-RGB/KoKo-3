'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SegmentKind = 'run' | 'recovery';

type YoYoLevel = {
  level: number;
  speedKmh: number;
  shuttles: number;
};

type Segment = {
  id: string;
  kind: SegmentKind;
  level: YoYoLevel;
  shuttleIndex: number;
  globalShuttle: number;
  durationSeconds: number;
  pacePer20mSeconds: number;
};

const SHUTTLE_DISTANCE_M = 40;
const RECOVERY_SECONDS = 10;

const YOYO_LEVELS: YoYoLevel[] = [
  { level: 1, speedKmh: 10, shuttles: 4 },
  { level: 2, speedKmh: 10.5, shuttles: 4 },
  { level: 3, speedKmh: 11, shuttles: 4 },
  { level: 4, speedKmh: 11.5, shuttles: 4 },
  { level: 5, speedKmh: 12, shuttles: 4 },
  { level: 6, speedKmh: 12.5, shuttles: 4 },
  { level: 7, speedKmh: 13, shuttles: 5 },
  { level: 8, speedKmh: 13.5, shuttles: 5 },
  { level: 9, speedKmh: 14, shuttles: 5 },
  { level: 10, speedKmh: 14.5, shuttles: 5 },
  { level: 11, speedKmh: 15, shuttles: 6 },
  { level: 12, speedKmh: 15.5, shuttles: 6 },
  { level: 13, speedKmh: 16, shuttles: 6 },
  { level: 14, speedKmh: 16.5, shuttles: 6 },
  { level: 15, speedKmh: 17, shuttles: 7 },
  { level: 16, speedKmh: 17.5, shuttles: 7 },
  { level: 17, speedKmh: 18, shuttles: 9 },
];

function buildSegments(levels: YoYoLevel[]): Segment[] {
  const segments: Segment[] = [];
  let globalShuttle = 0;

  levels.forEach((level, index) => {
    const speedMs = level.speedKmh / 3.6;
    const runDuration = SHUTTLE_DISTANCE_M / speedMs;
    const isLastLevel = index === levels.length - 1;

    for (let shuttleIndex = 0; shuttleIndex < level.shuttles; shuttleIndex += 1) {
      globalShuttle += 1;

      segments.push({
        id: `L${level.level}-S${shuttleIndex + 1}-run`,
        kind: 'run',
        level,
        shuttleIndex,
        globalShuttle,
        durationSeconds: runDuration,
        pacePer20mSeconds: runDuration / 2,
      });

      const isLastShuttleOverall = isLastLevel && shuttleIndex === level.shuttles - 1;

      if (!isLastShuttleOverall) {
        segments.push({
          id: `L${level.level}-S${shuttleIndex + 1}-recovery`,
          kind: 'recovery',
          level,
          shuttleIndex,
          globalShuttle,
          durationSeconds: RECOVERY_SECONDS,
          pacePer20mSeconds: 0,
        });
      }
    }
  });

  return segments;
}

function formatClock(value: number): string {
  if (!Number.isFinite(value)) {
    return '00.0';
  }

  const safe = Math.max(0, value);
  const totalTenths = Math.round(safe * 10);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  }

  return `${seconds.toString().padStart(2, '0')}.${tenths}`;
}

function formatDistance(value: number): string {
  return `${value.toLocaleString('de-DE')} m`;
}

type StatusStatProps = {
  label: string;
  value: string;
  emphasize?: boolean;
};

function StatusStat({ label, value, emphasize = false }: StatusStatProps) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3 text-center">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          'mt-1 text-base font-semibold sm:text-lg',
          emphasize && 'text-primary',
        )}
      >
        {value}
      </div>
    </div>
  );
}

export default function YoYoIr1Page() {
  const segments = useMemo(() => buildSegments(YOYO_LEVELS), []);
  const totalRunSegments = useMemo(
    () => segments.filter((segment) => segment.kind === 'run').length,
    [segments],
  );
  const totalPlannedDistance = totalRunSegments * SHUTTLE_DISTANCE_M;

  const [segmentIndex, setSegmentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    segments[0]?.durationSeconds ?? 0,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [completedShuttles, setCompletedShuttles] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [beepEnabled, setBeepEnabled] = useState(true);

  const currentSegment = segments[segmentIndex] ?? null;
  const nextSegment = segments[segmentIndex + 1] ?? null;

  const progressPercent =
    totalRunSegments > 0 ? (completedShuttles / totalRunSegments) * 100 : 0;
  const completedDistance = completedShuttles * SHUTTLE_DISTANCE_M;

  const hasUserInteractedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(
    (kind: SegmentKind = 'run') => {
      if (!beepEnabled || typeof window === 'undefined') {
        return;
      }

      try {
        let context = audioContextRef.current;

        if (!context) {
          context = new AudioContext();
          audioContextRef.current = context;
        }

        if (context.state === 'suspended') {
          void context.resume();
        }

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        const frequency = kind === 'run' ? 880 : 660;
        const duration = kind === 'run' ? 0.18 : 0.12;

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);

        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + duration,
        );

        oscillator.connect(gain).connect(context.destination);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration);
      } catch {
        setBeepEnabled(false);
      }
    },
    [beepEnabled],
  );

  useEffect(
    () => () => {
      audioContextRef.current?.close().catch(() => {
        /* ignore cleanup errors */
      });
    },
    [],
  );

  useEffect(() => {
    setTimeRemaining(segments[segmentIndex]?.durationSeconds ?? 0);
  }, [segmentIndex, segments]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.11) {
          return 0;
        }
        return Number((prev - 0.1).toFixed(2));
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const advanceSegment = useCallback(() => {
    setSegmentIndex((current) => {
      const finishedSegment = segments[current];

      if (!finishedSegment) {
        return current;
      }

      if (finishedSegment.kind === 'run') {
        setCompletedShuttles((count) =>
          count < totalRunSegments ? count + 1 : count,
        );
      }

      const nextIndex = current + 1;

      if (nextIndex >= segments.length) {
        setHasFinished(true);
        setIsRunning(false);
        setTimeRemaining(0);
        return current;
      }

      setTimeRemaining(segments[nextIndex].durationSeconds);
      return nextIndex;
    });
  }, [segments, totalRunSegments]);

  useEffect(() => {
    if (!isRunning || hasFinished) {
      return;
    }

    if (timeRemaining > 0) {
      return;
    }

    const timeout = window.setTimeout(() => advanceSegment(), 80);
    return () => window.clearTimeout(timeout);
  }, [timeRemaining, isRunning, hasFinished, advanceSegment]);

  useEffect(() => {
    if (!beepEnabled || !hasUserInteractedRef.current || !currentSegment) {
      return;
    }

    playBeep(currentSegment.kind);
  }, [segmentIndex, beepEnabled, currentSegment, playBeep]);

  useEffect(() => {
    if (!hasFinished || !beepEnabled || !hasUserInteractedRef.current) {
      return;
    }

    playBeep('run');
  }, [hasFinished, beepEnabled, playBeep]);

  const handleStart = useCallback(() => {
    if (!currentSegment || hasFinished) {
      return;
    }

    hasUserInteractedRef.current = true;
    if (audioContextRef.current?.state === 'suspended') {
      void audioContextRef.current.resume();
    }

    setIsRunning(true);
    playBeep(currentSegment.kind);
  }, [currentSegment, hasFinished, playBeep]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setHasFinished(false);
    setSegmentIndex(0);
    setCompletedShuttles(0);
    setTimeRemaining(segments[0]?.durationSeconds ?? 0);
  }, [segments]);

  const levelSummaries = useMemo(() => {
    let cumulative = 0;

    return YOYO_LEVELS.map((level) => {
      const levelDistance = level.shuttles * SHUTTLE_DISTANCE_M;
      cumulative += levelDistance;

      return {
        level: level.level,
        speedKmh: level.speedKmh,
        shuttles: level.shuttles,
        levelDistance,
        cumulativeDistance: cumulative,
      };
    });
  }, []);

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Yo-Yo IR1 Test</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Folge den vorgegebenen Lauf- und Erholungsphasen, um den Yo-Yo
          Intermittent Recovery Test Level&nbsp;1 mit deiner Mannschaft zu
          steuern. Jeder Shuttle umfasst 2x20&nbsp;m (40&nbsp;m) mit
          anschliessenden 10&nbsp;s aktiver Erholung.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Live-Status</CardTitle>
            <CardDescription>
              Aktuelle Phase, Zielgeschwindigkeit und Fortschritt des Tests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold',
                    currentSegment?.kind === 'run'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-50'
                      : 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-50',
                  )}
                >
                  {currentSegment?.kind === 'run' ? 'Lauf' : 'Erholung'}
                </span>
                <div className="mt-4 text-6xl font-semibold tabular-nums sm:text-7xl">
                  {formatClock(timeRemaining)}
                </div>
                {hasFinished && (
                  <p className="mt-4 text-sm font-medium text-primary">
                    Test abgeschlossen - bitte auf "Reset" klicken, um von vorne
                    zu starten.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatusStat
                  label="Level"
                  value={
                    currentSegment ? `L${currentSegment.level.level}` : '--'
                  }
                  emphasize
                />
                <StatusStat
                  label="Shuttle"
                  value={
                    currentSegment
                      ? `${currentSegment.globalShuttle}/${totalRunSegments}`
                      : '--'
                  }
                />
                <StatusStat
                  label="Tempo"
                  value={
                    currentSegment
                      ? `${currentSegment.level.speedKmh.toFixed(1)} km/h`
                      : '--'
                  }
                />
                <StatusStat
                  label="Distanz erreicht"
                  value={formatDistance(completedDistance)}
                />
                <StatusStat
                  label="Plan gesamt"
                  value={formatDistance(totalPlannedDistance)}
                />
                <StatusStat
                  label="Pace (20 m)"
                  value={
                    currentSegment && currentSegment.kind === 'run'
                      ? formatClock(currentSegment.pacePer20mSeconds)
                      : '--'
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Shuttles abgeschlossen</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Als Naechstes
                </div>
                <div className="mt-1 text-sm font-medium">
                  {nextSegment
                    ? nextSegment.kind === 'run'
                      ? `Lauf L${nextSegment.level.level} - Shuttle ${
                          nextSegment.shuttleIndex + 1
                        }`
                      : 'Erholung (10 s)'
                    : 'Test beendet'}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Hinweis
                </div>
                <div className="mt-1 text-sm">
                  Die angezeigten Zeiten folgen einer vereinfachten
                  Yo-Yo-IR1-Pace. Passe bei Bedarf Geschwindigkeiten oder
                  Shuttle-Anzahl an.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Steuerung</CardTitle>
            <CardDescription>
              Test starten, pausieren oder zuruecksetzen. Audio-Beep optional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleStart}
                disabled={isRunning || hasFinished}
                className="min-w-[110px]"
              >
                <Play className="mr-2 size-4" />
                Start
              </Button>
              <Button
                onClick={handlePause}
                variant="secondary"
                disabled={!isRunning}
                className="min-w-[110px]"
              >
                <Pause className="mr-2 size-4" />
                Pause
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="min-w-[110px]"
              >
                <RotateCcw className="mr-2 size-4" />
                Reset
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2 px-3"
              onClick={() => setBeepEnabled((value) => !value)}
            >
              {beepEnabled ? (
                <>
                  <Volume2 className="size-4" />
                  Beep an
                </>
              ) : (
                <>
                  <VolumeX className="size-4" />
                  Beep aus
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Der erste Ton startet, sobald du auf "Start" klickst. Einige
              Browser verlangen dafuer eine Interaktion (Tippen oder Klick).
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testfahrplan</CardTitle>
          <CardDescription>
            Uebersicht ueber Level, Soll-Geschwindigkeit und kumulative Distanz.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead className="text-muted-foreground text-xs uppercase tracking-wide">
              <tr className="border-b">
                <th className="py-2 text-left">Level</th>
                <th className="py-2 text-left">Geschwindigkeit</th>
                <th className="py-2 text-left">Shuttles</th>
                <th className="py-2 text-left">Leveldistanz</th>
                <th className="py-2 text-left">Kumuliert</th>
              </tr>
            </thead>
            <tbody>
              {levelSummaries.map((level) => (
                <tr
                  key={level.level}
                  className={cn(
                    'border-b border-border/60 transition-colors',
                    currentSegment?.level.level === level.level &&
                      'bg-primary/5 font-semibold',
                  )}
                >
                  <td className="py-2">L{level.level}</td>
                  <td className="py-2">{level.speedKmh.toFixed(1)} km/h</td>
                  <td className="py-2">{level.shuttles}</td>
                  <td className="py-2">
                    {formatDistance(level.levelDistance)}
                  </td>
                  <td className="py-2">
                    {formatDistance(level.cumulativeDistance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Praxis-Tipps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
            <li>
              Richte zwei Markierungen im Abstand von 20 m ein und sorge fuer
              eine 5 m lange Erholungszone hinter jeder Linie.
            </li>
            <li>
              Starte mit einem kurzen Aufwaermen. Sobald du "Start" drueckst,
              folgt die erste Laufphase (40 m) und danach automatisch die
              Erholungspause.
            </li>
            <li>
              Wenn ein Spieler die Ziellinie zweimal hintereinander verpasst,
              ist der Test fuer ihn beendet. Notiere den letzten vollstaendig
              absolvierten Shuttle (Level plus Nummer) sowie die Gesamtstrecke.
            </li>
            <li>
              Passe bei Bedarf Geschwindigkeiten oder Shuttle-Anzahl im Code an,
              um alternative Protokolle abzubilden (z. B. Yo-Yo IR2).
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
