// Pure logic functions for Yo-Yo IR1 test processing
import type { ShuttleEvent, TestPhase } from './types';

export interface LevelSnapshot {
  level: number;
  timestamp: number;
  currentEventIndex: number;
  completedShuttles: number;
  totalDistance: number;
  currentSpeed: number;
}

export interface FinishWarning {
  eventIndex: number;
  triggerTime: number;
}

// Pre-compute the state at the start of each level
export function computeLevelSnapshots(events: ShuttleEvent[]): LevelSnapshot[] {
  const snapshots: LevelSnapshot[] = [];
  let currentLevel = 0;
  let currentSpeed = 10.0;
  let completedShuttles = 0;
  let totalDistance = 0;

  events.forEach((event, index) => {
    switch (event.type) {
      case 'speed_change':
        if (event.details.speedKmh !== undefined) {
          currentSpeed = event.details.speedKmh;
        }
        break;
      case 'distance_change':
        if (event.details.accumulatedDistM !== undefined) {
          totalDistance = event.details.accumulatedDistM;
        }
        break;
      case 'finish':
        if (event.details.shuttles !== undefined) {
          completedShuttles = event.details.shuttles;
        }
        break;
      case 'beep_start':
        if (
          event.details.level !== undefined &&
          event.details.level > currentLevel
        ) {
          currentLevel = event.details.level;
          snapshots.push({
            level: currentLevel,
            timestamp: event.timestamp,
            currentEventIndex: index,
            completedShuttles,
            totalDistance,
            currentSpeed,
          });
        }
        if (event.details.shuttles !== undefined) {
          completedShuttles = event.details.shuttles;
        }
        break;
      default:
        break;
    }
  });

  return snapshots;
}

// Build pre-delay finish warnings to cue just before finishing a shuttle
export function buildFinishWarnings(
  events: ShuttleEvent[],
  preDelay: number,
): FinishWarning[] {
  const out: FinishWarning[] = [];
  events.forEach((evt, idx) => {
    if (evt.type === 'finish') {
      out.push({
        eventIndex: idx,
        triggerTime: Math.max(0, evt.timestamp - preDelay),
      });
    }
  });
  return out;
}

// Stateless event processor that returns a patch for state updates up to targetTime
export function processEvents(
  events: ShuttleEvent[],
  state: {
    currentEventIndex: number;
    currentLevel: number;
    currentSpeed: number;
    completedShuttles: number;
    totalDistance: number;
    testPhase: TestPhase;
  },
  targetTime: number,
): {
  currentEventIndex: number;
  currentLevel: number;
  currentSpeed: number;
  completedShuttles: number;
  totalDistance: number;
  testPhase: TestPhase;
} {
  let newEventIndex = state.currentEventIndex;
  let currentLevel = state.currentLevel;
  let currentSpeed = state.currentSpeed;
  let completedShuttles = state.completedShuttles;
  let totalDistance = state.totalDistance;
  let testPhase: TestPhase = state.testPhase;

  while (
    newEventIndex < events.length &&
    targetTime >= events[newEventIndex].timestamp
  ) {
    const evt = events[newEventIndex];
    switch (evt.type) {
      case 'speed_change':
        if (evt.details.speedKmh !== undefined)
          currentSpeed = evt.details.speedKmh;
        break;
      case 'beep_start':
        if (evt.details.level !== undefined) currentLevel = evt.details.level;
        if (evt.details.shuttles !== undefined)
          completedShuttles = evt.details.shuttles;
        testPhase = 'running';
        break;
      case 'turn':
        // no-op for pure state at the moment
        break;
      case 'finish':
        if (evt.details.shuttles !== undefined)
          completedShuttles = evt.details.shuttles;
        break;
      case 'distance_change':
        if (evt.details.accumulatedDistM !== undefined)
          totalDistance = evt.details.accumulatedDistM;
        break;
      case 'pause_start':
        testPhase = 'recovery';
        break;
      case 'pause_end':
        testPhase = 'running';
        break;
    }
    newEventIndex += 1;
  }

  return {
    currentEventIndex: newEventIndex,
    currentLevel,
    currentSpeed,
    completedShuttles,
    totalDistance,
    testPhase,
  };
}
