'use client';

import {
  MAX_TEST_DURATION_SECONDS,
  SHUTTLE_EVENTS,
} from '@/app/yo-yo-ir1_test/_lib/generate-shuttle-events';
import {
  computeLevelSnapshots,
  processEvents,
  type LevelSnapshot,
} from '@/app/yo-yo-ir1_test/_lib/test-logic';
import type {
  LevelInfo,
  PlayerRecord,
  PlayerStatus,
  PlayerWarning,
  ShuttleEvent,
  TestPhase,
} from '@/app/yo-yo-ir1_test/_lib/types';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

interface YoYoState {
  isRunning: boolean;
  currentTime: number; // seconds
  currentEventIndex: number;
  completedShuttles: number;
  currentLevel: number;
  currentSpeed: number; // km/h
  totalDistance: number; // meters
  testPhase: TestPhase;
  events: ShuttleEvent[];
  maxTime: number;
  availableLevels: LevelInfo[];
  levelSnapshots: LevelSnapshot[];
  isLoaded: boolean;
  // Centralized test-related UI state
  playerStates: Record<string, PlayerStatus>;
  recordedPlayers: PlayerRecord[];
  warnedPlayers: PlayerWarning[];
}

type YoYoAction =
  | {
      type: 'SET_EVENTS';
      events: ShuttleEvent[];
      maxTime: number;
      availableLevels: LevelInfo[];
      levelSnapshots: LevelSnapshot[];
    }
  | { type: 'SET_TIME'; time: number }
  | { type: 'SET_RUNNING'; running: boolean }
  | { type: 'FINISH' }
  | { type: 'PATCH'; patch: Partial<YoYoState> }
  | { type: 'RESET' }
  | { type: 'LOAD_PLAYERS'; players: string[] }
  | { type: 'WARN_PLAYER'; playerName: string; now: number }
  | { type: 'RECORD_PLAYER'; playerName: string; now: number };

const initialState: YoYoState = {
  isRunning: false,
  currentTime: 0,
  currentEventIndex: 0,
  completedShuttles: 0,
  currentLevel: 1,
  currentSpeed: 10.0,
  totalDistance: 0,
  testPhase: 'ready',
  events: [],
  maxTime: 1800,
  availableLevels: [],
  levelSnapshots: [],
  isLoaded: false,
  playerStates: {},
  recordedPlayers: [],
  warnedPlayers: [],
};

function reducer(state: YoYoState, action: YoYoAction): YoYoState {
  switch (action.type) {
    case 'SET_EVENTS': {
      return {
        ...state,
        events: action.events,
        maxTime: action.maxTime,
        availableLevels: action.availableLevels,
        levelSnapshots: action.levelSnapshots,
        isLoaded: true,
      };
    }
    case 'SET_TIME': {
      return { ...state, currentTime: action.time };
    }
    case 'SET_RUNNING': {
      return { ...state, isRunning: action.running };
    }
    case 'FINISH': {
      return {
        ...state,
        isRunning: false,
        testPhase: 'finished',
        currentTime: state.maxTime,
      };
    }
    case 'PATCH': {
      return { ...state, ...action.patch };
    }
    case 'LOAD_PLAYERS': {
      const nextStates: Record<string, PlayerStatus> = {};
      for (const p of action.players) nextStates[p] = 'normal';
      return { ...state, playerStates: nextStates };
    }
    case 'WARN_PLAYER': {
      const name = action.playerName.trim();
      if (!name) return state;
      // Skip if already recorded
      if (state.playerStates[name] === 'recorded') return state;
      const warned: PlayerWarning = {
        id: `${name}-${action.now}`,
        name,
        distance: state.totalDistance,
        level: state.currentLevel,
        timestamp: new Date(action.now).toLocaleTimeString(),
        reason: 'Warning issued during test',
      };
      return {
        ...state,
        playerStates: { ...state.playerStates, [name]: 'warned' },
        warnedPlayers: [...state.warnedPlayers, warned],
      };
    }
    case 'RECORD_PLAYER': {
      const name = action.playerName.trim();
      if (!name) return state;
      const recorded: PlayerRecord = {
        id: `${name}-${action.now}`,
        name,
        distance: state.totalDistance,
        level: state.currentLevel,
        timestamp: new Date(action.now).toLocaleTimeString(),
      };
      return {
        ...state,
        playerStates: { ...state.playerStates, [name]: 'recorded' },
        recordedPlayers: [...state.recordedPlayers, recorded],
      };
    }
    case 'RESET': {
      return {
        ...state,
        isRunning: false,
        currentTime: 0,
        currentEventIndex: 0,
        completedShuttles: 0,
        currentLevel: 1,
        currentSpeed: 10.0,
        totalDistance: 0,
        testPhase: 'ready',
        recordedPlayers: [],
        warnedPlayers: [],
        // keep playerStates but reset statuses to normal
        playerStates: Object.fromEntries(
          Object.keys(state.playerStates).map((n) => [
            n,
            'normal' as PlayerStatus,
          ]),
        ),
      };
    }
    default:
      return state;
  }
}

export interface UseYoYoTestReturn {
  state: YoYoState & { nextEvent?: ShuttleEvent };
  controls: {
    start: () => void;
    pause: () => void;
    stop: () => void;
    reset: () => void;
    jumpToLevel: (level: number) => void;
    formatTime: (seconds: number) => string;
    loadPlayers: (players: string[]) => void;
    warnPlayer: (playerName: string) => void;
    recordPlayer: (playerName: string) => void;
  };
}

export function useYoYoTest(initialPlayers?: string[]): UseYoYoTestReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Refs to support drift-free timer and minimal per-frame checks
  const rafIdRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const stateRef = useRef<YoYoState>(initialState);
  const eventsRef = useRef<ShuttleEvent[]>([]);

  // Keep a live ref of state for the rAF loop
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const precomputedSnapshots = useMemo(
    () => computeLevelSnapshots(SHUTTLE_EVENTS),
    [],
  );
  const precomputedLevels = useMemo<LevelInfo[]>(
    () =>
      precomputedSnapshots.map((snapshot) => ({
        level: snapshot.level,
        timestamp: snapshot.timestamp,
        eventIndex: snapshot.currentEventIndex,
      })),
    [precomputedSnapshots],
  );

  useEffect(() => {
    eventsRef.current = SHUTTLE_EVENTS;
    dispatch({
      type: 'SET_EVENTS',
      events: SHUTTLE_EVENTS,
      maxTime: MAX_TEST_DURATION_SECONDS,
      availableLevels: precomputedLevels,
      levelSnapshots: precomputedSnapshots,
    });
  }, [precomputedLevels, precomputedSnapshots]);

  // Process events up to a target time using pure logic
  const processUpTo = useCallback((targetTime: number): void => {
    const s = stateRef.current;
    const events = eventsRef.current;
    if (!s.isLoaded || events.length === 0) return;

    const patch = processEvents(
      events,
      {
        currentEventIndex: s.currentEventIndex,
        currentLevel: s.currentLevel,
        currentSpeed: s.currentSpeed,
        completedShuttles: s.completedShuttles,
        totalDistance: s.totalDistance,
        testPhase: s.testPhase,
      },
      targetTime,
    );

    dispatch({ type: 'PATCH', patch });
  }, []);

  // Drift-free rAF-driven timer
  const tick = useCallback(
    (ts: number): void => {
      if (!stateRef.current.isRunning) {
        rafIdRef.current = null;
        lastTsRef.current = null;
        return;
      }
      const last = lastTsRef.current ?? ts;
      const dt = Math.max(0, (ts - last) / 1000);
      lastTsRef.current = ts;

      const s = stateRef.current;
      const newTime = Math.min(s.currentTime + dt, s.maxTime);
      processUpTo(newTime);
      dispatch({ type: 'SET_TIME', time: newTime });

      if (newTime >= s.maxTime) {
        dispatch({ type: 'FINISH' });
        rafIdRef.current = null;
        lastTsRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    },
    [processUpTo],
  );

  // Start/stop the animation loop when running state changes
  useEffect(() => {
    if (state.isRunning && rafIdRef.current == null) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
    if (!state.isRunning && rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = null;
    }
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      lastTsRef.current = null;
    };
  }, [state.isRunning, tick]);

  // Public controls
  const start = useCallback((): void => {
    dispatch({ type: 'SET_RUNNING', running: true });
  }, []);

  const pause = useCallback((): void => {
    dispatch({ type: 'SET_RUNNING', running: false });
  }, []);

  const stop = useCallback((): void => {
    dispatch({
      type: 'PATCH',
      patch: { isRunning: false, testPhase: 'finished' },
    });
  }, []);

  const reset = useCallback((): void => {
    dispatch({ type: 'RESET' });
  }, []);

  // Centralized state: players, warnings, records
  const loadPlayers = useCallback((players: string[]): void => {
    dispatch({ type: 'LOAD_PLAYERS', players });
  }, []);

  const warnPlayer = useCallback((playerName: string): void => {
    dispatch({ type: 'WARN_PLAYER', playerName, now: Date.now() });
  }, []);

  const recordPlayer = useCallback((playerName: string): void => {
    dispatch({ type: 'RECORD_PLAYER', playerName, now: Date.now() });
  }, []);

  const jumpToLevel = useCallback((level: number): void => {
    const snapshots = stateRef.current.levelSnapshots;
    const snapshot = snapshots.find((s) => s.level === level);
    if (!snapshot) return;

    // Stop running during jump
    dispatch({ type: 'SET_RUNNING', running: false });

    dispatch({
      type: 'PATCH',
      patch: {
        currentTime: snapshot.timestamp,
        currentEventIndex: snapshot.currentEventIndex,
        currentLevel: snapshot.level,
        completedShuttles: snapshot.completedShuttles,
        totalDistance: snapshot.totalDistance,
        currentSpeed: snapshot.currentSpeed,
        testPhase: 'ready',
      },
    });
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  }, []);

  const nextEvent = useMemo<ShuttleEvent | undefined>(() => {
    return state.events[state.currentEventIndex];
  }, [state.events, state.currentEventIndex]);

  // Load players on mount/changes
  useEffect(() => {
    if (initialPlayers && initialPlayers.length > 0) {
      dispatch({ type: 'LOAD_PLAYERS', players: initialPlayers });
    }
  }, [initialPlayers]);

  return {
    state: { ...state, nextEvent },
    controls: {
      start,
      pause,
      stop,
      reset,
      jumpToLevel,
      formatTime,
      loadPlayers,
      warnPlayer,
      recordPlayer,
    },
  };
}

export default useYoYoTest;
