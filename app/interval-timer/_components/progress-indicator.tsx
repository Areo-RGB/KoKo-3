import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { TimerState } from '../_lib/types';

interface ProgressIndicatorProps {
  state: TimerState;
}

export default function ProgressIndicator({ state }: ProgressIndicatorProps) {
  const overallProgress = state.totalTime > 0 ? (state.currentTime / state.totalTime) * 100 : 0;
  const phaseProgress = state.activePhase?.duration ?? 0 > 0
    ? ((state.activePhase!.duration - state.phaseTimeRemaining) / state.activePhase!.duration) * 100
    : 0;
    
  const nextPhase = state.activePhase ? state.phases[state.activePhase.phaseIndex + 1] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Overall Progress</label>
          <Progress value={overallProgress} className="mt-1" />
          <div className="text-xs text-muted-foreground mt-1 text-right">{Math.round(overallProgress)}%</div>
        </div>
        <div>
          <label className="text-sm font-medium">Current Phase Progress</label>
          <Progress value={phaseProgress} className="mt-1" />
        </div>
        <div className="text-sm">
          <span className="font-medium">Next: </span>
          <span className="text-muted-foreground">
            {nextPhase && nextPhase.type !== 'finished' ? `${nextPhase.name} (${nextPhase.duration}s)` : 'Workout End'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}