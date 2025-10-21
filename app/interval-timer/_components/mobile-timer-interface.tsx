'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MobileQuickActions, TrainingActions } from '@/components/ui/mobile-quick-actions';
import { MobileBottomSheet } from '@/components/ui/mobile-bottom-sheet';
import { MobilePullToRefresh } from '@/components/ui/mobile-pull-to-refresh';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  Settings,
  ChevronUp,
  Activity,
  Flame,
  Timer as TimerIcon,
} from 'lucide-react';
import type { TimerStatus } from '../_lib/types';
import { cn } from '@/lib/utils';

interface MobileTimerInterfaceProps {
  status: TimerStatus;
  isMuted: boolean;
  volume: number;
  activePhase: any;
  phaseTimeRemaining: number;
  totalTime: number;
  currentRound?: number;
  totalRounds?: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSettings?: () => void;
}

export function MobileTimerInterface({
  status,
  isMuted,
  volume,
  activePhase,
  phaseTimeRemaining,
  totalTime,
  currentRound,
  totalRounds,
  onStart,
  onPause,
  onStop,
  onReset,
  onSkip,
  onToggleMute,
  onVolumeChange,
  onSettings,
}: MobileTimerInterfaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const isRunning = status === 'running';
  const isReady = status === 'ready';
  const isFinished = status === 'finished';

  // Animate phase transitions
  useEffect(() => {
    if (activePhase) {
      setIsAnimating(true);
      intervalRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [activePhase?.id]);

  const handleMainAction = () => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalTime > 0 ? ((totalTime - phaseTimeRemaining) / totalTime) * 100 : 0;

  return (
    <MobilePullToRefresh
      onRefresh={async () => onReset()}
      disabled={isRunning}
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto max-w-md px-4 py-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Interval Timer</h1>
          <p className="text-muted-foreground">
            {isRunning ? 'Training läuft' : isReady ? 'Bereit' : isFinished ? 'Abgeschlossen' : 'Pausiert'}
          </p>
        </div>

        {/* Main Timer Display */}
        <Card className="mb-6 overflow-hidden border-0 shadow-xl">
          <CardContent className="p-6">
            {/* Progress Ring */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="transform -rotate-90 w-48 h-48">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                  className={cn(
                    'transition-all duration-1000 ease-out',
                    isRunning ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={cn(
                  'text-4xl font-bold transition-all duration-300',
                  isAnimating && 'scale-110',
                  isRunning ? 'text-primary' : 'text-foreground'
                )}>
                  {formatTime(phaseTimeRemaining)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {activePhase?.name || 'Vorbereitung'}
                </div>
              </div>
            </div>

            {/* Phase Info */}
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Runde</div>
                <div className="text-lg font-semibold">
                  {currentRound}/{totalRounds}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Dauer</div>
                <div className="text-lg font-semibold">
                  {formatTime(totalTime)}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className="text-lg font-semibold capitalize">
                  {status}
                </div>
              </div>
            </div>

            {/* Main Control Button */}
            <div className="flex justify-center mb-6">
              <Button
                size="lg"
                onClick={handleMainAction}
                disabled={isFinished}
                className={cn(
                  'h-16 w-16 rounded-full transition-all duration-300',
                  'shadow-lg hover:shadow-xl active:scale-95',
                  isRunning
                    ? 'bg-destructive hover:bg-destructive/90'
                    : 'bg-primary hover:bg-primary/90'
                )}
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            <TrainingActions
              isPlaying={isRunning}
              isMuted={isMuted}
              volume={volume}
              onPlayPause={handleMainAction}
              onMute={onToggleMute}
              onVolumeChange={onVolumeChange}
              onDownload={() => {}}
              onMore={() => setShowDetails(true)}
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-600">
                {Math.floor(totalTime / 60)} kcal
              </div>
              <div className="text-xs text-muted-foreground">Geschätzt</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">
                125 bpm
              </div>
              <div className="text-xs text-muted-foreground">Herzfrequenz</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Hint */}
        {isReady && (
          <div className="text-center animate-bounce">
            <ChevronUp className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Tippen Sie auf den Play-Button zum Starten
            </p>
          </div>
        )}
      </div>

      {/* Details Bottom Sheet */}
      <MobileBottomSheet
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Timer-Einstellungen"
        height="half"
        showHandle={true}
      >
        <div className="space-y-4">
          {/* Additional Controls */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onSkip}
              disabled={!isRunning}
              className="h-12"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Überspringen
            </Button>
            <Button
              variant="outline"
              onClick={onStop}
              disabled={isReady || isFinished}
              className="h-12"
            >
              <Square className="mr-2 h-4 w-4" />
              Stopp
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={onReset}
            disabled={isReady}
            className="w-full h-12"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Zurücksetzen
          </Button>

          {onSettings && (
            <Button
              variant="outline"
              onClick={onSettings}
              className="w-full h-12"
            >
              <Settings className="mr-2 h-4 w-4" />
              Erweiterte Einstellungen
            </Button>
          )}
        </div>
      </MobileBottomSheet>
    </MobilePullToRefresh>
  );
}