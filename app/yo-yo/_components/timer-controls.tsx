'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  hasParticipants: boolean;
  onStartTest: () => void;
  onPauseTest: () => void;
  onResumeTest: () => void;
  onResetTest: () => void;
  enableAudio: boolean;
  onToggleAudio: (enabled: boolean) => void;
  onPlayAudioSignal: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  hasParticipants,
  onStartTest,
  onPauseTest,
  onResumeTest,
  onResetTest,
  enableAudio,
  onToggleAudio,
  onPlayAudioSignal
}: TimerControlsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Main Control Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {!isRunning ? (
              <Button 
                onClick={onStartTest}
                disabled={!hasParticipants}
                size="lg"
                className="min-w-32"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Test
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button 
                    onClick={onPauseTest}
                    variant="outline"
                    size="lg"
                    className="min-w-32"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    onClick={onResumeTest}
                    variant="outline"
                    size="lg"
                    className="min-w-32"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                )}
              </>
            )}
            
            <Button 
              onClick={onResetTest}
              variant="destructive"
              size="lg"
              className="min-w-32"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {/* Audio Controls */}
          <div className="flex items-center justify-between space-x-2 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="audio-toggle"
                checked={enableAudio}
                onCheckedChange={onToggleAudio}
              />
              <Label htmlFor="audio-toggle" className="flex items-center cursor-pointer">
                {enableAudio ? (
                  <Volume2 className="mr-2 h-4 w-4" />
                ) : (
                  <VolumeX className="mr-2 h-4 w-4" />
                )}
                Audio Signals
              </Label>
            </div>
            
            <Button
              onClick={onPlayAudioSignal}
              variant="outline"
              size="sm"
              disabled={!enableAudio}
            >
              Test Sound
            </Button>
          </div>
          
          {/* Status Message */}
          {!hasParticipants && (
            <div className="text-center text-sm text-muted-foreground bg-yellow-500/10 p-2 rounded-md border border-yellow-500/30 dark:bg-yellow-500/20 dark:border-yellow-500/40">
              Please select at least one participant to start the test
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
