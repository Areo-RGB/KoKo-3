'use client';

import ControlPanel from './_components/control-panel';
import ExerciseVideoCard from './_components/exercise-video-card';
import PresetSelector from './_components/preset-selector';
import ProgressIndicator from './_components/progress-indicator';
import TimerDisplay from './_components/timer-display';
import { useIntervalTimer } from './_hooks/use-interval-timer';

export default function IntervalTimerPage() {
  const { state, controls, audio } = useIntervalTimer();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Interval Timer</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Customizable timer for workouts and drills.
        </p>
      </div>

      <div className="space-y-6">
        {!state.selectedPreset ? (
          <PresetSelector
            selectedPreset={state.selectedPreset}
            onSelectPreset={controls.selectPreset}
          />
        ) : (
          <>
            <TimerDisplay
              phase={state.activePhase}
              timeRemaining={state.phaseTimeRemaining}
            />
            <ControlPanel
              status={state.status}
              isMuted={audio.isMuted}
              volume={audio.volume}
              onStart={controls.start}
              onPause={controls.pause}
              onStop={controls.stop}
              onReset={controls.reset}
              onSkip={controls.skip}
              onToggleMute={audio.toggleMute}
              onVolumeChange={audio.setVolume}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <ProgressIndicator state={state} />
              <ExerciseVideoCard phase={state.activePhase} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
