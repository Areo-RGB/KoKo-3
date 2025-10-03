import { useCallback, useEffect, useReducer, useRef } from 'react';
import { generatePhasesFromPreset } from '../_lib/timer-logic';
import type { TimerPhase, TimerState, WorkoutPreset } from '../_lib/types';
import { useIntervalAudio } from './use-interval-audio';

type TimerAction =
  | { type: 'SELECT_PRESET'; preset: WorkoutPreset }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'TICK'; newTime: number }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'SKIP' };

const initialState: TimerState = {
  status: 'ready',
  currentTime: 0,
  activePhase: null,
  phaseTimeRemaining: 0,
  totalTime: 0,
  phases: [],
  selectedPreset: null,
};

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'SELECT_PRESET': {
      const phases = generatePhasesFromPreset(action.preset);
      const totalTime = phases.reduce((sum, p) => sum + p.duration, 0);
      return {
        ...initialState,
        selectedPreset: action.preset,
        phases,
        activePhase: phases[0] ?? null,
        phaseTimeRemaining: phases[0]?.duration ?? 0,
        totalTime,
      };
    }
    case 'START':
      return { ...state, status: 'running' };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'TICK': {
      const { newTime } = action;
      let elapsed = 0;
      let activePhase = state.activePhase;
      let phaseIndex = state.activePhase?.phaseIndex ?? 0;

      for (let i = 0; i < state.phases.length; i++) {
        const phase = state.phases[i];
        if (newTime < elapsed + phase.duration) {
          activePhase = phase;
          phaseIndex = i;
          break;
        }
        elapsed += phase.duration;
      }

      const phaseStartTime = state.phases
        .slice(0, phaseIndex)
        .reduce((sum, p) => sum + p.duration, 0);
      const phaseTimeRemaining = Math.max(
        0,
        phaseStartTime + (activePhase?.duration ?? 0) - newTime,
      );

      if (newTime >= state.totalTime) {
        return {
          ...state,
          status: 'finished',
          currentTime: state.totalTime,
          activePhase: state.phases[state.phases.length - 1],
          phaseTimeRemaining: 0,
        };
      }

      return {
        ...state,
        currentTime: newTime,
        activePhase,
        phaseTimeRemaining,
      };
    }
    case 'STOP':
      return {
        ...initialState,
        selectedPreset: state.selectedPreset,
        phases: state.phases,
        activePhase: state.phases[0] ?? null,
        phaseTimeRemaining: state.phases[0]?.duration ?? 0,
        totalTime: state.totalTime,
      };
    case 'RESET': {
      if (!state.activePhase || state.phases.length === 0) {
        return state;
      }

      let targetIndex = state.activePhase.phaseIndex;
      while (targetIndex > 0) {
        const current = state.phases[targetIndex];
        const previous = state.phases[targetIndex - 1];
        if (
          previous.exerciseIndex !== current.exerciseIndex ||
          previous.setNumber !== current.setNumber
        ) {
          break;
        }
        targetIndex -= 1;
      }

      const targetPhase = state.phases[targetIndex];
      const phaseStartTime = state.phases
        .slice(0, targetIndex)
        .reduce((sum, phase) => sum + phase.duration, 0);

      return {
        ...state,
        status: 'ready',
        currentTime: phaseStartTime,
        activePhase: targetPhase,
        phaseTimeRemaining: targetPhase.duration,
      };
    }
    case 'SKIP': {
      if (!state.activePhase) return state;
      const currentPhaseEndTime = state.phases
        .slice(0, state.activePhase.phaseIndex + 1)
        .reduce((sum, p) => sum + p.duration, 0);
      return reducer(state, { type: 'TICK', newTime: currentPhaseEndTime });
    }
    default:
      return state;
  }
}

export function useIntervalTimer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const rafId = useRef<number | null>(null);
  const lastTickTime = useRef<number | null>(null);
  const audio = useIntervalAudio();
  const stateRef = useRef<TimerState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const prevPhaseRef = useRef<TimerPhase | null>(null);

  useEffect(() => {
    const oldPhase = prevPhaseRef.current;
    const newPhase = state.activePhase;

    if (oldPhase?.phaseIndex !== newPhase?.phaseIndex && newPhase) {
      if (
        newPhase.type === 'work' ||
        newPhase.type === 'hold' ||
        newPhase.type === 'reps'
      )
        audio.playStartBeep();
      else if (newPhase.type === 'rest') audio.playRestBeep();
      else if (newPhase.type === 'finished') audio.playFinishBeep();

      if (oldPhase && oldPhase.setNumber !== newPhase.setNumber)
        audio.playTransitionBeep();
      if (
        oldPhase &&
        oldPhase.side !== 'none' &&
        newPhase.side !== 'none' &&
        oldPhase.side !== newPhase.side
      )
        audio.playSideChangeBeep();
    }

    prevPhaseRef.current = newPhase;
  }, [state.activePhase, audio]);

  const tick = useCallback((timestamp: number) => {
    if (!lastTickTime.current) {
      lastTickTime.current = timestamp;
    }
    const deltaTime = (timestamp - lastTickTime.current) / 1000;
    lastTickTime.current = timestamp;

    const currentState = stateRef.current;
    const newTime = currentState.currentTime + deltaTime;
    dispatch({ type: 'TICK', newTime });

    if (newTime >= currentState.totalTime) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      lastTickTime.current = null;
    } else {
      rafId.current = requestAnimationFrame(tick);
    }
  }, []);

  useEffect(() => {
    if (state.status === 'running') {
      if (!rafId.current) {
        lastTickTime.current = performance.now();
        rafId.current = requestAnimationFrame(tick);
      }
    } else {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = null;
      lastTickTime.current = null;
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [state.status, tick]);

  const controls = {
    selectPreset: useCallback(
      (preset: WorkoutPreset) => dispatch({ type: 'SELECT_PRESET', preset }),
      [],
    ),
    start: useCallback(() => dispatch({ type: 'START' }), []),
    pause: useCallback(() => dispatch({ type: 'PAUSE' }), []),
    stop: useCallback(() => dispatch({ type: 'STOP' }), []),
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
    skip: useCallback(() => dispatch({ type: 'SKIP' }), []),
  };

  return { state, controls, audio };
}
