'use client';

import ControlPanel from '@/app/yo-yo-ir1_test/_components/control-panel';
import CurrentInstruction from '@/app/yo-yo-ir1_test/_components/current-instruction';
import PlayerActionDialog from '@/app/yo-yo-ir1_test/_components/player-action-dialog';
import PlayerEventList from '@/app/yo-yo-ir1_test/_components/player-event-list';
import StatisticsDashboard from '@/app/yo-yo-ir1_test/_components/statistics-dashboard';
import useYoYoTest from '@/app/yo-yo-ir1_test/_hooks/use-yo-yo-test';
import type { JSX } from 'react';
import { memo, useMemo, useState } from 'react';

import useAudioManager from '@/app/yo-yo-ir1_test/_hooks/use-audio-manager';
import useShuttleBeeps from '@/app/yo-yo-ir1_test/_hooks/use-shuttle-beeps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Activity,
  AlertTriangle,
  PlayCircle,
  UserPlus,
  UserX,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { PlayerStatus } from '../_lib/types';

interface YoYoTestInterfaceProps {
  players: string[];
}

type DialogState = {
  type: 'record' | 'warn' | null;
  playerName: string;
};

// Memoized PlayerButton to avoid re-rendering all when one changes
const PlayerButton = memo(function PlayerButton({
  player,
  playerState,
  onClick,
}: {
  player: string;
  playerState: PlayerStatus;
  onClick: (player: string) => void;
}) {
  const isWarned = playerState === 'warned';
  const isRecorded = playerState === 'recorded';

  const buttonVariant: 'default' | 'destructive' | 'secondary' | 'outline' =
    isRecorded ? 'secondary' : isWarned ? 'outline' : 'default';

  const icon = isRecorded ? (
    <UserX className="h-4 w-4" />
  ) : isWarned ? (
    <AlertTriangle className="h-4 w-4" />
  ) : null;

  return (
    <Button
      variant={buttonVariant}
      size="sm"
      onClick={() => onClick(player)}
      disabled={isRecorded}
      className={cn(
        'flex items-center gap-1 text-xs',
        isWarned &&
          'border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100',
      )}
    >
      {icon}
      {player}
    </Button>
  );
});

export default function YoYoTestInterface({
  players,
}: YoYoTestInterfaceProps): JSX.Element {
  const { state, controls } = useYoYoTest(players);
  const audioManager = useAudioManager({ playerNames: players });

  const shuttleBeeps = useShuttleBeeps({
    events: state.events,
    currentTime: state.currentTime,
    currentEventIndex: state.currentEventIndex,
    isRunning: state.isRunning,
    testPhase: state.testPhase,
  });

  // Audio control functions
  const handleStart = () => {
    void (async () => {
      await shuttleBeeps.start();
      controls.start();
    })();
  };

  const handlePause = () => {
    shuttleBeeps.pause();
    controls.pause();
  };

  const handleStop = () => {
    shuttleBeeps.pause();
    controls.stop();
  };

  const handleReset = () => {
    shuttleBeeps.seek(0, 0);
    controls.reset();
  };

  const handleJumpToLevel = (level: number) => {
    const snapshot = state.levelSnapshots.find((s) => s.level === level);
    controls.jumpToLevel(level);
    if (snapshot) {
      shuttleBeeps.seek(snapshot.timestamp, snapshot.currentEventIndex);
    }
  };

  // Player button handler
  const handlePlayerClick = (playerName: string) => {
    const currentState = state.playerStates[playerName];
    if (currentState === 'normal') {
      controls.warnPlayer(playerName);
      void audioManager.playWarning(playerName);
    } else if (currentState === 'warned') {
      controls.recordPlayer(playerName);
      void audioManager.playElimination(playerName, state.totalDistance);
    }
  };

  // Consolidated dialog state
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    playerName: '',
  });

  const handleConfirmDialog = () => {
    if (!dialogState.playerName.trim()) return;
    const name = dialogState.playerName.trim();
    if (dialogState.type === 'record') {
      controls.recordPlayer(name);
    } else if (dialogState.type === 'warn') {
      controls.warnPlayer(name);
    }
    setDialogState({ type: null, playerName: '' });
  };

  const resultsCard = useMemo(() => {
    if (state.testPhase !== 'finished') return null;
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Test Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">Final Level:</div>
              <div className="text-xl">{state.currentLevel}</div>
            </div>
            <div>
              <div className="font-semibold">Total Shuttles:</div>
              <div className="text-xl">{state.completedShuttles}</div>
            </div>
            <div>
              <div className="font-semibold">Total Distance:</div>
              <div className="text-xl">{state.totalDistance}m</div>
            </div>
            <div>
              <div className="font-semibold">Test Duration:</div>
              <div className="text-xl">
                {controls.formatTime(state.currentTime)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [
    state.testPhase,
    state.currentLevel,
    state.completedShuttles,
    state.totalDistance,
    state.currentTime,
    controls,
  ]);

  // Loading state for lazy-loaded events
  if (!state.isLoaded) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Initializing Test Data...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
      <ControlPanel
        isRunning={state.isRunning}
        testPhase={state.testPhase}
        currentTime={state.currentTime}
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
        onOpenRecord={() => setDialogState({ type: 'record', playerName: '' })}
        onOpenWarn={() => setDialogState({ type: 'warn', playerName: '' })}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Shuttle Audio Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Shuttle beeps are generated in real time via the Web Audio API.
                The tones are scheduled from the same timer driving the
                interface, so drift between the visuals and the cues is
                eliminated.
              </p>
              <div className="flex items-center justify-between rounded-md border border-muted/40 bg-muted/30 p-3 text-xs sm:text-sm">
                <span className="font-medium text-foreground">
                  Audio Status
                </span>
                <span className="text-foreground/80">
                  {shuttleBeeps.isSupported
                    ? shuttleBeeps.contextState === 'running'
                      ? 'Active'
                      : shuttleBeeps.contextState === 'suspended'
                        ? 'Ready'
                        : shuttleBeeps.contextState === 'uninitialized'
                          ? 'Not started'
                          : shuttleBeeps.contextState
                    : 'Unsupported'}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="flex w-full items-center justify-center gap-2"
                onClick={() => {
                  void shuttleBeeps.start();
                }}
                disabled={!shuttleBeeps.isSupported}
              >
                <PlayCircle className="h-4 w-4" />
                Initialize audio cues
              </Button>
            </CardContent>
          </Card>

          <CurrentInstruction
            event={state.nextEvent}
            formatTime={controls.formatTime}
          />
        </div>

        <div className="space-y-4">
          <StatisticsDashboard
            currentLevel={state.currentLevel}
            currentSpeed={state.currentSpeed}
            completedShuttles={state.completedShuttles}
            totalDistance={state.totalDistance}
            availableLevels={state.availableLevels}
            isRunning={state.isRunning}
            onJumpToLevel={handleJumpToLevel}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Player Management</span>
            <Button
              variant={audioManager.muted ? 'default' : 'outline'}
              size="sm"
              onClick={audioManager.toggleMuted}
              className="flex items-center gap-1"
              aria-label={
                audioManager.muted
                  ? 'Unmute audio notifications'
                  : 'Mute audio notifications'
              }
            >
              {audioManager.muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {audioManager.muted ? 'Muted' : 'Audio ON'}
              </span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {players.map((player) => (
              <PlayerButton
                key={player}
                player={player}
                playerState={state.playerStates[player]}
                onClick={handlePlayerClick}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Click a player once to issue a warning, click again to record their
            elimination.
          </p>
        </CardContent>
      </Card>

      {(state.recordedPlayers.length > 0 || state.warnedPlayers.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <PlayerEventList
            title="Recorded Players"
            icon={<Users className="h-5 w-5" />}
            items={state.recordedPlayers}
            titleClassName="text-green-600"
            itemClassName="bg-green-50 border border-green-200"
            metricClassName="text-green-700"
          />
          <PlayerEventList
            title="Player Warnings"
            icon={<AlertTriangle className="h-5 w-5" />}
            items={state.warnedPlayers}
            titleClassName="text-orange-600"
            itemClassName="bg-orange-50 border border-orange-200"
            metricClassName="text-orange-700"
          />
        </div>
      )}

      {dialogState.type && (
        <PlayerActionDialog
          open={!!dialogState.type}
          onClose={() => setDialogState({ type: null, playerName: '' })}
          playerName={dialogState.playerName}
          onChangeName={(name) =>
            setDialogState({ ...dialogState, playerName: name })
          }
          onConfirm={handleConfirmDialog}
          title={
            dialogState.type === 'record' ? (
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" /> Record Player Result
              </span>
            ) : (
              <span className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" /> Warn Player
              </span>
            )
          }
          description={`Enter player name to ${dialogState.type} at ${state.totalDistance}m (Level ${state.currentLevel}).`}
          confirmText={
            dialogState.type === 'record' ? 'Record Result' : 'Issue Warning'
          }
          confirmClassName={
            dialogState.type === 'warn'
              ? 'bg-orange-600 hover:bg-orange-700'
              : ''
          }
        />
      )}

      {resultsCard}
    </div>
  );
}
