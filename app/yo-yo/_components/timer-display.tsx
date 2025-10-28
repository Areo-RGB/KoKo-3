'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShuttleInfo } from '../_lib/yoyo-protocol';
import { formatTime, getShuttleDisplayText } from '../_lib/yoyo-protocol';

interface TimerDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isResting: boolean;
  pauseTimeRemaining: number;
  currentShuttle: ShuttleInfo | null;
  nextShuttle: ShuttleInfo | null;
  shuttleIndex: number;
}

export function TimerDisplay({
  elapsedTime,
  isRunning,
  isPaused,
  isResting,
  pauseTimeRemaining,
  currentShuttle,
  nextShuttle,
  shuttleIndex,
}: TimerDisplayProps) {
  const formattedTime = formatTime(elapsedTime);
  const totalShuttles = 85; // Correct total for standard Yo-Yo IR1 test

  const CIRCLE_RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="text-center">
          {/* Main Timer Display */}
          <div className="mb-4">
            <div
              className={`text-6xl font-mono font-bold tracking-wider ${isRunning && !isPaused
                  ? 'text-green-600'
                  : isPaused
                    ? 'text-yellow-600'
                    : 'text-gray-600'
                }`}
            >
              {formattedTime}
            </div>
            <div className="text-sm text-muted-foreground">
              {isResting
                ? 'Recovery Period'
                : isRunning && !isPaused
                  ? 'Test in Progress'
                  : isPaused
                    ? 'Test Paused'
                    : 'Ready to Start'}
            </div>
          </div>

          {/* Pause Timer */}
          {isResting && (
            <div className="mb-6 animate-in fade-in duration-300">
              <div className="text-sm font-medium text-primary uppercase tracking-wider">
                Recovery
              </div>
              <div className="relative mt-2 mx-auto h-28 w-28">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-primary/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={CIRCLE_RADIUS}
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={CIRCLE_RADIUS}
                    cx="50"
                    cy="50"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: CIRCUMFERENCE,
                      strokeDashoffset:
                        CIRCUMFERENCE -
                        (CIRCUMFERENCE * Math.max(0, pauseTimeRemaining)) / 10,
                      transition: 'stroke-dashoffset 0.1s linear',
                    }}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold font-mono text-primary">
                  {pauseTimeRemaining > 0
                    ? pauseTimeRemaining.toFixed(1)
                    : '0.0'}
                </div>
              </div>
            </div>
          )}

          {/* Shuttle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/30">
              <div className="text-sm font-medium text-primary mb-1">
                Current Shuttle
              </div>
              <div className="text-lg font-bold text-primary">
                {currentShuttle
                  ? getShuttleDisplayText(currentShuttle)
                  : 'Not Started'}
              </div>
              {currentShuttle && (
                <div className="text-xs text-primary/80 mt-1">
                  Distance: {currentShuttle.distance}m
                </div>
              )}
            </div>

            <div className="bg-muted rounded-lg p-3 border border-muted-foreground/30">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Next Shuttle
              </div>
              <div className="text-lg font-bold text-muted-foreground">
                {nextShuttle
                  ? getShuttleDisplayText(nextShuttle)
                  : 'Test Complete'}
              </div>
              {nextShuttle && (
                <div className="text-xs text-muted-foreground/80 mt-1">
                  Starts at: {formatTime(nextShuttle.startTime)}
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Test Progress</span>
              <span>
                {shuttleIndex + 1} / {totalShuttles} shuttles
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((shuttleIndex + 1) / totalShuttles) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
