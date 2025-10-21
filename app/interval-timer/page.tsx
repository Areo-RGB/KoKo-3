'use client';

import ControlPanel from './_components/control-panel';
import ExerciseVideoCard from './_components/exercise-video-card';
import PresetSelector from './_components/preset-selector';
import ProgressIndicator from './_components/progress-indicator';
import TimerDisplay from './_components/timer-display';
import { MobileTimerInterface } from './_components/mobile-timer-interface';
import { MobileFooterNavEnhanced } from '@/components/layout/mobile-footer-nav-enhanced';
import { useIntervalTimer } from './_hooks/use-interval-timer';
import '@/app/mobile-styles.css';

export default function IntervalTimerPage() {
  const { state, controls, audio } = useIntervalTimer();

  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        {state.selectedPreset ? (
          <MobileTimerInterface
            status={state.status}
            isMuted={audio.isMuted}
            volume={audio.volume}
            activePhase={state.activePhase}
            phaseTimeRemaining={state.phaseTimeRemaining}
            totalTime={state.totalTime}
            currentRound={state.activePhase?.setNumber || 1}
            totalRounds={state.activePhase?.totalSets || 1}
            onStart={controls.start}
            onPause={controls.pause}
            onStop={controls.stop}
            onReset={controls.reset}
            onSkip={controls.skip}
            onToggleMute={audio.toggleMute}
            onVolumeChange={audio.setVolume}
          />
        ) : (
          <div className="container mx-auto max-w-md px-4 py-6 pb-20">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Interval Timer</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Wählen Sie ein Trainings-Präset
              </p>
            </div>
            <PresetSelector
              selectedPreset={state.selectedPreset}
              onSelectPreset={controls.selectPreset}
            />
          </div>
        )}
        <MobileFooterNavEnhanced />
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="container mx-auto max-w-2xl px-4 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">Interval Timer</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
              Customizable timer for workouts and drills.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
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
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <ProgressIndicator state={state} />
                  <ExerciseVideoCard phase={state.activePhase} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
