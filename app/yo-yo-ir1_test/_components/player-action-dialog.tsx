'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { JSX, ReactNode } from 'react';

export interface PlayerActionDialogProps {
  open: boolean;
  title: ReactNode;
  description: string;
  playerName: string;
  confirmText: string;
  confirmClassName?: string;
  onChangeName: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PlayerActionDialog({
  open,
  title,
  description,
  playerName,
  confirmText,
  confirmClassName,
  onChangeName,
  onClose,
  onConfirm,
}: PlayerActionDialogProps): JSX.Element {
  const handleConfirm = () => {
    if (playerName.trim()) onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-md sm:mx-0 sm:w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="player-name-input">Player Name</Label>
            <Input
              id="player-name-input"
              value={playerName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Enter player name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
              }}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!playerName.trim()}
              className={cn(confirmClassName)}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
