import performanceRatingsRaw from '@/data/normative/performance_ratings.json';

interface PerformanceRangeSpec {
  min_inclusive?: string;
  min_exclusive?: string;
  max_inclusive?: string;
  max_exclusive?: string;
}

interface ExerciseSpec {
  name: string;
  unit: string;
  type: 'lower_is_better' | 'higher_is_better';
  ranges?: Record<string, PerformanceRangeSpec>;
  performance_tiers?: Record<string, string>;
}

interface AgeCategorySpec {
  overall_categories_description?: Record<string, string>;
  exercises: ExerciseSpec[];
}

type PerformanceRatings = Record<string, AgeCategorySpec>;

const performanceRatings: PerformanceRatings =
  performanceRatingsRaw as PerformanceRatings;

export function getPerformanceColor(
  value: number,
  exerciseName: string,
  category: string,
): string {
  const categoryData =
    performanceRatings[category as keyof typeof performanceRatings];
  if (!categoryData) return '';

  const exercise = categoryData.exercises.find(
    (ex) => ex.name === exerciseName,
  );
  if (!exercise) return '';

  // Prefer explicit ranges if present; otherwise, derive approximate buckets
  const ranges = exercise.ranges;

  const numValue =
    typeof value === 'number' ? value : parseFloat(String(value));

  const isInRange = (range: PerformanceRangeSpec, v: number): boolean => {
    if (
      range.min_inclusive !== undefined &&
      v < parseFloat(range.min_inclusive)
    )
      return false;
    if (
      range.min_exclusive !== undefined &&
      v <= parseFloat(range.min_exclusive)
    )
      return false;
    if (
      range.max_inclusive !== undefined &&
      v > parseFloat(range.max_inclusive)
    )
      return false;
    if (
      range.max_exclusive !== undefined &&
      v >= parseFloat(range.max_exclusive)
    )
      return false;
    return true;
  };

  if (ranges) {
    if (ranges.Excellent && isInRange(ranges.Excellent, numValue)) {
      return 'bg-green-300 dark:bg-green-800/50';
    } else if (
      ranges['Very Good'] &&
      isInRange(ranges['Very Good'], numValue)
    ) {
      return 'bg-green-200 dark:bg-green-800/40';
    } else if (ranges.Good && isInRange(ranges.Good, numValue)) {
      return 'bg-green-100 dark:bg-green-800/30';
    } else if (
      ranges['Above Average'] &&
      isInRange(ranges['Above Average'], numValue)
    ) {
      return 'bg-orange-100 dark:bg-orange-900/30';
    } else if (ranges.Average && isInRange(ranges.Average, numValue)) {
      return 'bg-orange-200 dark:bg-orange-800/40';
    } else if (
      ranges['Below Average'] &&
      isInRange(ranges['Below Average'], numValue)
    ) {
      return 'bg-red-100 dark:bg-red-900/30';
    }
    return 'bg-red-200 dark:bg-red-800/40';
  }

  // Fallback when only tier cutoffs exist; approximate scale based on type
  const type = exercise.type;
  const tiers = exercise.performance_tiers || {};
  const values = Object.values(tiers)
    .map((v) => parseFloat(v))
    .filter((v) => !Number.isNaN(v));
  if (values.length >= 2) {
    values.sort((a, b) => a - b);
    // For lower_is_better, lower value = greener; reverse for higher_is_better
    const pos = values.findIndex((v) =>
      type === 'lower_is_better' ? numValue <= v : numValue >= v,
    );
    if (pos <= 0) return 'bg-green-300 dark:bg-green-800/50';
    if (pos === 1) return 'bg-green-200 dark:bg-green-800/40';
    if (pos === 2) return 'bg-green-100 dark:bg-green-800/30';
    if (pos === 3) return 'bg-orange-100 dark:bg-orange-900/30';
    if (pos === 4) return 'bg-orange-200 dark:bg-orange-800/40';
    return 'bg-red-100 dark:bg-red-900/30';
  }

  return '';
}

export function getOverallPerformanceColor(player: {
  speed20m: number;
  category: string;
}): string {
  return getPerformanceColor(
    player.speed20m,
    'Schnelligkeit (20 m)',
    player.category,
  );
}
