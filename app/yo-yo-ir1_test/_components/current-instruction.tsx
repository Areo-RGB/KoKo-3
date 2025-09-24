'use client';

import type { ShuttleEvent } from '@/app/yo-yo-ir1_test/_lib/types';
import type { JSX } from 'react';

export interface CurrentInstructionProps {
  event?: ShuttleEvent;
  formatTime: (seconds: number) => string;
}

export default function CurrentInstruction({
  event,
  formatTime,
}: CurrentInstructionProps): JSX.Element | null {
  // Hidden as requested
  return null;
}
