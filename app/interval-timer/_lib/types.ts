export type ExerciseType = 'work' | 'hold' | 'reps';
export type IntervalPhaseType = ExerciseType | 'rest' | 'prepare' | 'finished';
export type ExerciseSide = 'none' | 'left' | 'right';

export interface Exercise {
  name: string;
  type: ExerciseType;
  sets: number;
  reps?: number;
  duration: number; // seconds
  restAfter: number; // seconds
  sideSpecific?: boolean;
  instructions?: string;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

// This is the flattened structure the timer works with
export interface TimerPhase {
  type: IntervalPhaseType;
  name: string;
  duration: number;
  side: ExerciseSide;
  setNumber: number;
  totalSets: number;
  exerciseIndex: number;
  totalPhases: number;
  phaseIndex: number;
  instructions?: string;
}

export type TimerStatus = 'ready' | 'running' | 'paused' | 'finished';

export interface TimerState {
  status: TimerStatus;
  currentTime: number; // overall workout time in seconds
  activePhase: TimerPhase | null;
  phaseTimeRemaining: number;
  totalTime: number;
  phases: TimerPhase[];
  selectedPreset: WorkoutPreset | null;
}
