import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatTime } from '../_lib/timer-logic';
import type { TimerPhase } from '../_lib/types';

interface TimerDisplayProps {
  phase: TimerPhase | null;
  timeRemaining: number;
}

const phaseColors: Record<string, string> = {
  prepare: 'bg-blue-500 text-blue-50',
  work: 'bg-green-600 text-green-50',
  hold: 'bg-orange-500 text-orange-50',
  reps: 'bg-purple-600 text-purple-50',
  rest: 'bg-indigo-500 text-indigo-50',
  finished: 'bg-gray-700 text-gray-100',
};

export default function TimerDisplay({ phase, timeRemaining }: TimerDisplayProps) {
  const bgColor = phase ? phaseColors[phase.type] : 'bg-gray-200 dark:bg-gray-800';
  const timeStr = formatTime(timeRemaining);

  return (
    <Card className={cn('transition-colors duration-500', bgColor)}>
      <CardContent className="p-6 text-center">
        <div className="mb-2">
          <Badge variant="secondary" className="text-lg">
            {phase?.type.toUpperCase() ?? 'READY'}
          </Badge>
        </div>
        <div className="font-mono text-8xl font-bold tracking-tighter text-white">
          {timeStr}
        </div>
        <div className="mt-2 text-2xl font-semibold text-white/90">
          {phase?.name}
          {phase?.side && phase.side !== 'none' && ` (${phase.side.toUpperCase()})`}
        </div>
        {phase && phase.type !== 'prepare' && phase.type !== 'finished' && (
          <div className="mt-1 text-base text-white/80">
            Set {phase.setNumber} / {phase.totalSets}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
