'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Timer, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TimerOverlay({ isOpen, onClose }: TimerOverlayProps) {
    const [timeLeft, setTimeLeft] = useState(30); // Default 30 seconds
    const [isRunning, setIsRunning] = useState(false);
    const [initialTime, setInitialTime] = useState(30);

    // Timer effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Play sound notification when timer ends
                        playTimerSound();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const playTimerSound = () => {
        try {
            const audio = new Audio('/assets/sounds/timer.mp3');
            audio.play().catch((error) => {
                console.warn('Could not play timer sound:', error);
            });
        } catch (error) {
            console.warn('Could not play timer sound:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(initialTime);
    };

    const handleTimeAdjust = (delta: number) => {
        const newTime = Math.max(5, initialTime + delta); // Minimum 5 seconds
        setInitialTime(newTime);
        if (!isRunning) {
            setTimeLeft(newTime);
        }
    };

    const handleClose = () => {
        setIsRunning(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <Card className="mx-4 w-full max-w-md">
                <CardContent className="p-6">
                    {/* Header with close button */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Timer className="text-primary h-5 w-5" />
                            <h2 className="text-lg font-semibold">Timer</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close timer</span>
                        </Button>
                    </div>

                    {/* Timer display */}
                    <div className="mb-6 text-center">
                        <div className="text-primary mb-2 font-mono text-6xl font-bold">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {isRunning ? 'Running...' : 'Ready'}
                        </div>
                    </div>

                    {/* Time adjustment controls */}
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTimeAdjust(-5)}
                            disabled={isRunning || initialTime <= 5}
                            className="h-10 w-10"
                        >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease time by 5 seconds</span>
                        </Button>

                        <div className="min-w-[80px] text-center">
                            <div className="text-muted-foreground text-sm">Set Time</div>
                            <div className="text-lg font-semibold">
                                {formatTime(initialTime)}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTimeAdjust(5)}
                            disabled={isRunning}
                            className="h-10 w-10"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase time by 5 seconds</span>
                        </Button>
                    </div>

                    {/* Control buttons */}
                    <div className="flex gap-3">
                        {!isRunning ? (
                            <Button
                                onClick={handleStart}
                                className="flex-1"
                                size="lg"
                                disabled={timeLeft === 0}
                            >
                                Start
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePause}
                                variant="outline"
                                className="flex-1"
                                size="lg"
                            >
                                Pause
                            </Button>
                        )}

                        <Button
                            onClick={handleReset}
                            variant="outline"
                            size="lg"
                            disabled={isRunning && timeLeft === initialTime}
                        >
                            Reset
                        </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="bg-muted h-2 w-full rounded-full">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                                style={{
                                    width: `${((initialTime - timeLeft) / initialTime) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
