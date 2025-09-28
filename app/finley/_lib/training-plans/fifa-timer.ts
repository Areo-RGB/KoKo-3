import type { TrainingTimerConfigInput } from '@/components/training-timer';
import { FIFA_LEVEL_1_DATA } from './fifa';

const DEFAULT_STAGE_SECONDS = 45;

const RANGE_REGEX = /(\d+)\s*[-–]\s*(\d+)/;
const SINGLE_DIGIT_REGEX = /(\d+)/;

function clampSeconds(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return fallback;
  }
  return value;
}

function parseDuration(durationStr?: string): number {
  if (!durationStr) {
    return DEFAULT_STAGE_SECONDS;
  }

  const rangeMatch = durationStr.match(RANGE_REGEX);
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1], 10);
    const high = parseInt(rangeMatch[2], 10);
    return clampSeconds(Math.round((low + high) / 2), DEFAULT_STAGE_SECONDS);
  }

  const singleMatch = durationStr.match(SINGLE_DIGIT_REGEX);
  if (singleMatch) {
    return clampSeconds(parseInt(singleMatch[1], 10), DEFAULT_STAGE_SECONDS);
  }

  return DEFAULT_STAGE_SECONDS;
}

function parseSets(setsStr: string): number {
  const match = setsStr.match(SINGLE_DIGIT_REGEX);
  if (match) {
    const count = parseInt(match[1], 10);
    return Number.isNaN(count) || count <= 0 ? 1 : count;
  }
  return 1;
}

function normaliseLabel(label: string): string {
  return label.replace(/\s+/g, ' ').trim();
}

function inferKind(label: string): 'work' | 'rest' | 'pause' {
  const lower = label.toLowerCase();
  if (lower.includes('pause')) {
    return 'pause';
  }
  if (
    lower.includes('rest') ||
    lower.includes('reset') ||
    lower.includes('breath')
  ) {
    return 'rest';
  }
  return 'work';
}

export function buildFifaTimerConfig(): TrainingTimerConfigInput {
  const intervals = FIFA_LEVEL_1_DATA.drills.flatMap(
    (drill, index, drillsArray) => {
      const seconds = parseDuration(drill.duration);
      const repetitions = parseSets(drill.sets);
      let stageLabel = normaliseLabel(drill.drillname);

      if (drill.sets.includes('per side') || drill.sets.includes('per leg')) {
        stageLabel = `${stageLabel} (pro Seite/Bein)`;
      }

      const kind = inferKind(stageLabel);

      let drillIntervals;

      if (repetitions <= 1) {
        drillIntervals = [
          {
            label: stageLabel,
            seconds,
            kind,
            videoId: drill.videoId,
          },
        ];
      } else {
        drillIntervals = Array.from({ length: repetitions }, (_, i) => ({
          label: `${stageLabel} (Satz ${i + 1}/${repetitions})`,
          seconds,
          kind,
          videoId: drill.videoId,
        }));
      }

      // Add a 10-second pause after the drill, but not for the very last one.
      if (index < drillsArray.length - 1) {
        drillIntervals.push({
          label: 'Pause',
          seconds: 10,
          kind: 'pause',
        });
      }

      return drillIntervals;
    },
  );

  const safeIntervals =
    intervals.length > 0
      ? intervals
      : [
          {
            label: 'FIFA 11+ Session',
            seconds: DEFAULT_STAGE_SECONDS,
            kind: 'work' as const,
          },
        ];

  return {
    sets: 1,
    intervals: safeIntervals,
  };
}
