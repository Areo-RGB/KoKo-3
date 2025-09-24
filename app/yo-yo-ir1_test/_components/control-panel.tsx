'use client';

import type { TestPhase } from '@/app/yo-yo-ir1_test/_lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Pause,
  Play,
  RotateCcw,
  Square,
  Timer,
  UserPlus,
} from 'lucide-react';
import type { JSX } from 'react';

export interface ControlPanelProps {
  isRunning: boolean;
  testPhase: TestPhase;
  currentTime: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onOpenRecord: () => void;
  onOpenWarn: () => void;
}

const phaseColorMap: Record<TestPhase, string> = {
  ready: 'bg-blue-500',
  running: 'bg-green-500',
  recovery: 'bg-yellow-500',
  finished: 'bg-red-500',
};

export default function ControlPanel({
  isRunning,
  testPhase,
  currentTime,
  onStart,
  onPause,
  onStop,
  onReset,
  onOpenRecord,
  onOpenWarn,
}: ControlPanelProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Test Control
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-white',
              phaseColorMap[testPhase] ?? 'bg-gray-500',
            )}
          >
            {testPhase.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Button
            onClick={onStart}
            disabled={isRunning || testPhase === 'finished'}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentTime === 0 ? 'Start Test' : 'Resume'}
            </span>
            <span className="sm:hidden">
              {currentTime === 0 ? 'Start' : 'Resume'}
            </span>
          </Button>
          <Button
            onClick={onPause}
            disabled={!isRunning}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button
            onClick={onStop}
            disabled={testPhase === 'ready' || testPhase === 'finished'}
            variant="destructive"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            variant="secondary"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
            onClick={onOpenRecord}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Record Player</span>
            <span className="sm:hidden">Record</span>
          </Button>

          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 sm:w-auto"
            onClick={onOpenWarn}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Warn Player</span>
            <span className="sm:hidden">Warn</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
