import { useIntervalTimer } from '../_hooks/use-interval-timer';
import type { TimerState } from '../_lib/types';
import ControlPanel from './control-panel';
import ExerciseInstructions from './exercise-instructions';
import PresetSelector from './preset-selector';
import ProgressIndicator from './progress-indicator';
import TimerDisplay from './timer-display';

type IntervalTimerControls = ReturnType<typeof useIntervalTimer>['controls'];
type IntervalTimerAudio = ReturnType<typeof useIntervalTimer>['audio'];

interface IntervalTimerInterfaceProps {
  state: TimerState;
  controls: IntervalTimerControls;
  audio: IntervalTimerAudio;
}

export default function IntervalTimerInterface({ state, controls, audio }: IntervalTimerInterfaceProps) {
  return (
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
          <div className="grid md:grid-cols-2 gap-6">
            <ProgressIndicator state={state} />
            <ExerciseInstructions instructions={state.activePhase?.instructions ?? null} />
          </div>
        </>
      )}
    </div>
  );
}
