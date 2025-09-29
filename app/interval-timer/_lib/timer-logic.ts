import type { TimerPhase, WorkoutPreset } from './types';

const PREPARE_DURATION = 10; // 10 seconds prepare time before starting

/**
 * Generates a flat array of timer phases from a structured workout preset.
 * This is the core logic that translates a workout plan into a playable sequence.
 */
export function generatePhasesFromPreset(preset: WorkoutPreset): TimerPhase[] {
  const phases: Omit<TimerPhase, 'phaseIndex' | 'totalPhases'>[] = [];

  // Add a preparation phase at the beginning
  phases.push({
    type: 'prepare',
    name: 'Get Ready!',
    duration: PREPARE_DURATION,
    side: 'none',
    setNumber: 1,
    totalSets: preset.exercises.reduce((sum, ex) => sum + ex.sets, 0),
    exerciseIndex: 0,
    instructions: `The workout will begin in ${PREPARE_DURATION} seconds.`,
  });

  preset.exercises.forEach((exercise, exerciseIndex) => {
    for (let set = 1; set <= exercise.sets; set++) {
      if (exercise.sideSpecific) {
        // Left Side
        phases.push({
          type: exercise.type,
          name: exercise.name,
          duration: exercise.duration,
          side: 'left',
          setNumber: set,
          totalSets: exercise.sets,
          exerciseIndex,
          instructions: exercise.instructions,
        });
        // Rest After Left Side
        if (exercise.restAfter > 0) {
          phases.push({
            type: 'rest',
            name: 'Rest',
            duration: exercise.restAfter,
            side: 'none',
            setNumber: set,
            totalSets: exercise.sets,
            exerciseIndex,
          });
        }
        // Right Side
        phases.push({
          type: exercise.type,
          name: exercise.name,
          duration: exercise.duration,
          side: 'right',
          setNumber: set,
          totalSets: exercise.sets,
          exerciseIndex,
          instructions: exercise.instructions,
        });
        // Rest After Right Side (end of set)
        if (exercise.restAfter > 0) {
          phases.push({
            type: 'rest',
            name: 'Rest',
            duration: exercise.restAfter,
            side: 'none',
            setNumber: set,
            totalSets: exercise.sets,
            exerciseIndex,
          });
        }
      } else {
        // Non-side-specific exercise
        phases.push({
          type: exercise.type,
          name: exercise.name,
          duration: exercise.duration,
          side: 'none',
          setNumber: set,
          totalSets: exercise.sets,
          exerciseIndex,
          instructions: exercise.instructions,
        });
        // Rest after exercise
        if (exercise.restAfter > 0) {
          phases.push({
            type: 'rest',
            name: 'Rest',
            duration: exercise.restAfter,
            side: 'none',
            setNumber: set,
            totalSets: exercise.sets,
            exerciseIndex,
          });
        }
      }
    }
  });

  // Add a final "finished" phase
  phases.push({
    type: 'finished',
    name: 'Workout Complete!',
    duration: 0,
    side: 'none',
    setNumber: preset.exercises[preset.exercises.length - 1].sets,
    totalSets: preset.exercises[preset.exercises.length - 1].sets,
    exerciseIndex: preset.exercises.length - 1,
  });

  const totalPhases = phases.length;
  return phases.map((p, i) => ({ ...p, phaseIndex: i, totalPhases }));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}