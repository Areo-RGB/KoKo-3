import type { ShuttleEvent } from '@/app/yo-yo-ir1_test/_lib/types';

interface StageConfig {
  speedLevel: number;
  speedKmh: number;
  shuttles: number;
  runDuration: number; // seconds to complete shuttle
  turnDuration: number; // seconds to reach 20m turn point
}

const STAGE_CONFIG: readonly StageConfig[] = [
  {
    speedLevel: 5,
    speedKmh: 10,
    shuttles: 1,
    runDuration: 14.4,
    turnDuration: 7.2,
  },
  {
    speedLevel: 9,
    speedKmh: 12,
    shuttles: 1,
    runDuration: 12,
    turnDuration: 6,
  },
  {
    speedLevel: 11,
    speedKmh: 13,
    shuttles: 2,
    runDuration: 11.08,
    turnDuration: 5.54,
  },
  {
    speedLevel: 12,
    speedKmh: 13.5,
    shuttles: 3,
    runDuration: 10.67,
    turnDuration: 5.33,
  },
  {
    speedLevel: 13,
    speedKmh: 14,
    shuttles: 4,
    runDuration: 10.29,
    turnDuration: 5.14,
  },
  {
    speedLevel: 14,
    speedKmh: 14.5,
    shuttles: 8,
    runDuration: 9.93,
    turnDuration: 4.96,
  },
  {
    speedLevel: 15,
    speedKmh: 15,
    shuttles: 8,
    runDuration: 9.6,
    turnDuration: 4.8,
  },
  {
    speedLevel: 16,
    speedKmh: 15.5,
    shuttles: 8,
    runDuration: 9.29,
    turnDuration: 4.64,
  },
  {
    speedLevel: 17,
    speedKmh: 16,
    shuttles: 8,
    runDuration: 9,
    turnDuration: 4.5,
  },
  {
    speedLevel: 18,
    speedKmh: 16.5,
    shuttles: 8,
    runDuration: 8.73,
    turnDuration: 4.37,
  },
  {
    speedLevel: 19,
    speedKmh: 17,
    shuttles: 8,
    runDuration: 8.47,
    turnDuration: 4.24,
  },
  {
    speedLevel: 20,
    speedKmh: 17.5,
    shuttles: 8,
    runDuration: 8.23,
    turnDuration: 4.12,
  },
  {
    speedLevel: 21,
    speedKmh: 18,
    shuttles: 8,
    runDuration: 8,
    turnDuration: 4,
  },
  {
    speedLevel: 22,
    speedKmh: 18.5,
    shuttles: 8,
    runDuration: 7.78,
    turnDuration: 3.89,
  },
  {
    speedLevel: 23,
    speedKmh: 19,
    shuttles: 8,
    runDuration: 7.58,
    turnDuration: 3.79,
  },
] as const;

const SHUTTLE_DISTANCE_METERS = 40;
const REST_DURATION_SECONDS = 10;

const roundToHundredth = (value: number): number =>
  Math.round(value * 100) / 100;
const formatSpeedDescription = (speedLevel: number, speedKmh: number): string =>
  `Speed level changed to ${speedLevel} (${speedKmh.toFixed(1)} km/h)`;

export const generateShuttleEvents = (): ShuttleEvent[] => {
  const events: ShuttleEvent[] = [];
  let currentTime = 0;
  let accumulatedDistance = 0;
  let globalShuttleIndex = 0;

  for (const stage of STAGE_CONFIG) {
    currentTime = roundToHundredth(currentTime);

    events.push({
      timestamp: currentTime,
      type: 'speed_change',
      details: {
        speedLevel: stage.speedLevel,
        speedKmh: stage.speedKmh,
        description: formatSpeedDescription(stage.speedLevel, stage.speedKmh),
      },
    });

    for (let shuttle = 1; shuttle <= stage.shuttles; shuttle += 1) {
      const startTime = roundToHundredth(currentTime);
      globalShuttleIndex += 1;

      events.push({
        timestamp: startTime,
        type: 'beep_start',
        details: {
          level: globalShuttleIndex,
          speedLevel: stage.speedLevel,
          shuttles: shuttle,
          speedKmh: stage.speedKmh,
          description: `Start shuttle ${shuttle}`,
        },
      });

      const turnTime = roundToHundredth(startTime + stage.turnDuration);
      events.push({
        timestamp: turnTime,
        type: 'turn',
        details: {
          level: globalShuttleIndex,
          speedLevel: stage.speedLevel,
          shuttles: shuttle,
          description: 'Turn at 20m',
        },
      });

      const finishTime = roundToHundredth(startTime + stage.runDuration);
      events.push({
        timestamp: finishTime,
        type: 'finish',
        details: {
          level: globalShuttleIndex,
          speedLevel: stage.speedLevel,
          shuttles: shuttle,
          description: `Finish shuttle ${shuttle}`,
        },
      });

      accumulatedDistance += SHUTTLE_DISTANCE_METERS;
      events.push({
        timestamp: finishTime,
        type: 'distance_change',
        details: {
          accumulatedDistM: accumulatedDistance,
          description: `Accumulated distance changed to ${accumulatedDistance}m`,
        },
      });

      events.push({
        timestamp: finishTime,
        type: 'pause_start',
        details: {
          level: globalShuttleIndex,
          speedLevel: stage.speedLevel,
          shuttles: shuttle,
          description: 'Start 10s rest',
        },
      });

      const restEndTime = roundToHundredth(finishTime + REST_DURATION_SECONDS);
      events.push({
        timestamp: restEndTime,
        type: 'pause_end',
        details: {
          level: globalShuttleIndex,
          speedLevel: stage.speedLevel,
          shuttles: shuttle,
          description: 'End rest',
        },
      });

      currentTime = restEndTime;
    }
  }

  return events;
};

export const SHUTTLE_EVENTS: ShuttleEvent[] = generateShuttleEvents();

export const MAX_TEST_DURATION_SECONDS: number =
  SHUTTLE_EVENTS.length > 0
    ? SHUTTLE_EVENTS[SHUTTLE_EVENTS.length - 1].timestamp
    : 1800;
