'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Timer } from 'lucide-react';
import * as React from 'react';

interface TimerToggleProps extends React.ComponentPropsWithoutRef<'button'> {
  iconClassName?: string;
}

export function TimerToggle({
  className,
  iconClassName,
  ...props
}: TimerToggleProps): React.ReactElement {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Open timer"
      className={cn(
        'hover:bg-muted rounded-full p-2 transition-colors',
        className,
      )}
      {...props}
    >
      <Timer className={cn('text-muted-foreground h-5 w-5', iconClassName)} />
      <span className="sr-only">Open timer</span>
    </Button>
  );
}
