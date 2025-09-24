'use client';

import type { LevelInfo } from '@/app/yo-yo-ir1_test/_lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity, MapPin, Target, Zap } from 'lucide-react';
import type { JSX } from 'react';

export interface StatisticsDashboardProps {
  currentLevel: number;
  currentSpeed: number;
  completedShuttles: number;
  totalDistance: number;
  availableLevels: LevelInfo[];
  isRunning: boolean;
  onJumpToLevel: (level: number) => void;
}

export default function StatisticsDashboard({
  currentLevel,
  currentSpeed,
  completedShuttles,
  totalDistance,
  availableLevels,
  isRunning,
  onJumpToLevel,
}: StatisticsDashboardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5" />
          Test Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Control Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Current Level
            </span>
            <span className="text-2xl font-bold">{currentLevel}</span>
          </div>
          <Select
            value={currentLevel.toString()}
            onValueChange={(v) => onJumpToLevel(parseInt(v, 10))}
            disabled={isRunning}
          >
            <SelectTrigger aria-label="Jump to level" className="w-full">
              <SelectValue placeholder="Jump to level..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {availableLevels.map(({ level }) => (
                <SelectItem key={level} value={level.toString()}>
                  Level {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              Speed
            </div>
            <div className="text-lg font-bold">{currentSpeed.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              Shuttles
            </div>
            <div className="text-lg font-bold">{completedShuttles}</div>
            <div className="text-xs text-muted-foreground">completed</div>
          </div>

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Distance
            </div>
            <div className="text-lg font-bold">{totalDistance}</div>
            <div className="text-xs text-muted-foreground">meters</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
