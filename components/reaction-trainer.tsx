'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ReactionTrainerProps {
    defaultIntervalMs?: number;
    onIntervalChange?: (intervalMs: number) => void;
    className?: string;
}

interface ColorCell {
    id: number;
    name: string;
    bgClass: string;
}

const COLOR_CELLS: ColorCell[] = [
    { id: 0, name: 'Gelb', bgClass: 'bg-yellow-400' },
    { id: 1, name: 'Grün', bgClass: 'bg-green-500' },
    { id: 2, name: 'Rot', bgClass: 'bg-red-500' },
    { id: 3, name: 'Blau', bgClass: 'bg-blue-500' },
];

const PRESET_INTERVALS = [250, 500, 1000, 1500, 2000];

function getRandomIndexExcluding(excludedIndex: number): number {
    let nextIndex = excludedIndex;
    while (nextIndex === excludedIndex) {
        nextIndex = Math.floor(Math.random() * COLOR_CELLS.length);
    }
    return nextIndex;
}

function getRandomNumberExcluding(previousNumber: number): number {
    let next = previousNumber;
    while (next === previousNumber) {
        next = Math.floor(Math.random() * 4) + 1; // 1..4
    }
    return next;
}

export function ReactionTrainer({
    defaultIntervalMs = 1000,
    onIntervalChange,
    className,
}: ReactionTrainerProps) {
    const [isRunning, setIsRunning] = React.useState<boolean>(false);
    const [intervalMs, setIntervalMs] = React.useState<number>(
        Number.isFinite(defaultIntervalMs) && defaultIntervalMs > 0
            ? defaultIntervalMs
            : 1000,
    );
    const [durationSeconds, setDurationSeconds] = React.useState<number>(0);
    const [activeIndex, setActiveIndex] = React.useState<number>(
        Math.floor(Math.random() * COLOR_CELLS.length),
    );
    const [isNumberEnabled, setIsNumberEnabled] = React.useState<boolean>(false);
    const [activeNumber, setActiveNumber] = React.useState<number>(
        Math.floor(Math.random() * 4) + 1,
    );
    const [isFullscreenOpen, setIsFullscreenOpen] = React.useState<boolean>(false);
    const fullscreenRef = React.useRef<HTMLDivElement | null>(null);
    const stopTimeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (!isRunning) return;
        const timerId = setInterval(() => {
            setActiveIndex((prev) => getRandomIndexExcluding(prev));
            setActiveNumber((prev) => getRandomNumberExcluding(prev));
        }, intervalMs);
        return () => clearInterval(timerId);
    }, [isRunning, intervalMs]);

    function handleSetInterval(ms: number) {
        const clamped = Math.max(100, Math.min(60000, Math.round(ms)));
        setIntervalMs(clamped);
        if (typeof onIntervalChange === 'function') onIntervalChange(clamped);
    }

    function openFullscreen() {
        setIsFullscreenOpen(true);
    }

    function closeFullscreen() {
        if (document.fullscreenElement && document.exitFullscreen) {
            document
                .exitFullscreen()
                .catch(() => {
                    // ignore
                })
                .finally(() => setIsFullscreenOpen(false));
            return;
        }
        setIsFullscreenOpen(false);
    }

    React.useEffect(() => {
        if (!isFullscreenOpen) return;
        const el = fullscreenRef.current;
        el?.requestFullscreen?.().catch(() => {
            // If Fullscreen API is blocked, we still show the overlay.
        });

        function onKeyDown(ev: KeyboardEvent) {
            if (ev.key === 'Escape') closeFullscreen();
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isFullscreenOpen]);

    React.useEffect(() => {
        function onFsChange() {
            if (!document.fullscreenElement) setIsFullscreenOpen(false);
        }
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    function handleStart() {
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
        setIsRunning(true);
        if (durationSeconds > 0) {
            stopTimeoutRef.current = window.setTimeout(() => {
                setIsRunning(false);
                stopTimeoutRef.current = null;
            }, durationSeconds * 1000);
        }
    }

    function handleStop() {
        setIsRunning(false);
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
    }

    React.useEffect(() => {
        if (!isRunning) return;
        if (stopTimeoutRef.current) {
            clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = null;
        }
        if (durationSeconds > 0) {
            stopTimeoutRef.current = window.setTimeout(() => {
                setIsRunning(false);
                stopTimeoutRef.current = null;
            }, durationSeconds * 1000);
        }
        return () => {
            if (stopTimeoutRef.current) {
                clearTimeout(stopTimeoutRef.current);
                stopTimeoutRef.current = null;
            }
        };
    }, [durationSeconds, isRunning]);

    return (
        <div className={cn('space-y-6', className)}>
            <div className="flex flex-wrap items-end gap-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:items-end">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="interval-input">Intervall (ms)</Label>
                        <Input
                            id="interval-input"
                            type="number"
                            inputMode="numeric"
                            min={100}
                            max={60000}
                            step={50}
                            value={intervalMs}
                            onChange={(e) => handleSetInterval(Number(e.target.value))}
                            className="w-40"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="duration-input">Dauer (s)</Label>
                        <Input
                            id="duration-input"
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={3600}
                            step={1}
                            value={durationSeconds}
                            onChange={(e) =>
                                setDurationSeconds(
                                    Math.max(0, Math.round(Number(e.target.value) || 0)),
                                )
                            }
                            className="w-40"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="sr-only">Voreinstellungen</span>
                        {PRESET_INTERVALS.map((ms) => (
                            <Button
                                key={ms}
                                type="button"
                                variant={ms === intervalMs ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleSetInterval(ms)}
                                aria-pressed={ms === intervalMs}
                            >
                                {ms} ms
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            id="show-number"
                            type="checkbox"
                            className="size-4"
                            checked={isNumberEnabled}
                            onChange={(e) => setIsNumberEnabled(e.target.checked)}
                        />
                        <Label htmlFor="show-number">Zahl anzeigen</Label>
                    </div>
                </div>

                <div className="ml-auto flex gap-2">
                    <Button
                        type="button"
                        onClick={handleStart}
                        disabled={isRunning}
                    >
                        Start
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleStop}
                        disabled={!isRunning}
                    >
                        Stopp
                    </Button>
                    <Button type="button" variant="outline" onClick={openFullscreen}>
                        Vollbild
                    </Button>
                </div>
            </div>

            <div
                role="grid"
                aria-label="Reaktionstrainer - 2x2 Farben"
                className="mx-auto grid aspect-square w-full max-w-2xl grid-cols-2 gap-4"
            >
                {COLOR_CELLS.map((cell) => {
                    const isActive = cell.id === activeIndex;
                    return (
                        <div
                            key={cell.id}
                            role="gridcell"
                            aria-selected={isActive}
                            className={cn(
                                'relative rounded-xl transition-all duration-150 ease-out',
                                cell.bgClass,
                                isActive
                                    ? 'opacity-100 shadow-lg ring-4 ring-white/60 dark:ring-white/30'
                                    : 'opacity-30',
                            )}
                        >
                            <span className="sr-only">
                                {isActive
                                    ? `${cell.name} aktiv${isNumberEnabled ? `, Zahl ${activeNumber}` : ''}`
                                    : `${cell.name} inaktiv`}
                            </span>
                            {isActive && isNumberEnabled ? (
                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
                                    {activeNumber}
                                </span>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div aria-live="polite" className="sr-only">
                Aktive Farbe: {COLOR_CELLS[activeIndex]?.name}
                {isNumberEnabled ? `, Zahl: ${activeNumber}` : ''}
            </div>

            {isFullscreenOpen ? (
                <div
                    ref={fullscreenRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Reaktionstrainer Vollbild"
                    className="fixed inset-0 z-50 bg-background"
                >
                    <div className="absolute right-3 top-3 z-50">
                        <Button size="sm" variant="secondary" onClick={closeFullscreen}>
                            Schließen
                        </Button>
                    </div>
                    <div
                        role="grid"
                        aria-label="Reaktionstrainer - 2x2 Farben"
                        className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0"
                    >
                        {COLOR_CELLS.map((cell) => {
                            const isActive = cell.id === activeIndex;
                            return (
                                <div
                                    key={cell.id}
                                    role="gridcell"
                                    aria-selected={isActive}
                                    className={cn(
                                        'relative rounded-none transition-all duration-150 ease-out',
                                        cell.bgClass,
                                        isActive ? 'opacity-100' : 'opacity-30',
                                    )}
                                >
                                    <span className="sr-only">
                                        {isActive ? `${cell.name} aktiv` : `${cell.name} inaktiv`}
                                    </span>
                                    {isActive && isNumberEnabled ? (
                                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-7xl font-bold text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.6)] sm:text-8xl md:text-9xl">
                                            {activeNumber}
                                        </span>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}


