'use client';

import type {
  PlayerRecord,
  PlayerWarning,
} from '@/app/yo-yo-ir1_test/_lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { JSX, ReactNode } from 'react';

type EventItem = PlayerRecord | PlayerWarning;

export interface PlayerEventListProps {
  title: string;
  icon: ReactNode;
  items: EventItem[];
  titleClassName?: string;
  itemClassName?: string;
  metricClassName?: string;
}

export default function PlayerEventList({
  title,
  icon,
  items,
  titleClassName,
  itemClassName,
  metricClassName,
}: PlayerEventListProps): JSX.Element | null {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center gap-2 text-sm sm:text-base',
            titleClassName,
          )}
        >
          {icon}
          <span className="hidden sm:inline">
            {title} ({items.length})
          </span>
          <span className="sm:hidden">
            {title.split(' ')[0]} ({items.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex flex-col gap-2 rounded-lg p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-3',
                itemClassName,
              )}
            >
              <div className="flex-1">
                <div className="font-semibold text-sm sm:text-base">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  {item.timestamp}
                </div>
              </div>
              <div className="flex items-center justify-between sm:block sm:text-right">
                <div
                  className={cn(
                    'text-lg font-bold sm:text-lg',
                    metricClassName,
                  )}
                >
                  {item.distance}m
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  Level {item.level}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
