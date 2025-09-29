import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, RotateCcw, SkipForward, Square, Volume2, VolumeX } from 'lucide-react';
import type { TimerStatus } from '../_lib/types';

interface ControlPanelProps {
  status: TimerStatus;
  isMuted: boolean;
  volume: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function ControlPanel({
  status, isMuted, volume,
  onStart, onPause, onStop, onReset, onSkip, onToggleMute, onVolumeChange
}: ControlPanelProps) {
  const isRunning = status === 'running';
  const isReady = status === 'ready';
  const isFinished = status === 'finished';

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button onClick={isRunning ? onPause : onStart} disabled={isFinished} size="lg">
            {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isRunning ? 'Pause' : (isReady ? 'Start' : 'Resume')}
          </Button>
          <Button onClick={onStop} disabled={isReady || isFinished} variant="destructive" size="lg">
            <Square className="mr-2 h-5 w-5" />
            Stop
          </Button>
          <Button onClick={onSkip} disabled={!isRunning} variant="outline" size="lg">
            <SkipForward className="mr-2 h-5 w-5" />
            Skip
          </Button>
          <Button onClick={onReset} disabled={isReady && status !== 'finished'} variant="outline" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" size="icon" onClick={onToggleMute}>
            {isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={v => onVolumeChange(v[0] / 100)}
            max={100}
            step={1}
          />
        </div>
      </CardContent>
    </Card>
  );
}