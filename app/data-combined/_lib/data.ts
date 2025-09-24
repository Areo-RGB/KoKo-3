// Server-only module: reads JSON files with fs/path. Do not import from client components.
import performanceRatingsRaw from '@/data/normative/performance_ratings.json';
import { promises as fs } from 'fs';
import path from 'path';
import { PlayerPerformance } from '../_components/columns';

// Strongly-typed view of performance_ratings.json
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
  ranges: Record<string, PerformanceRangeSpec>;
}

interface AgeCategorySpec {
  overall_categories_description?: Record<string, string>;
  exercises: ExerciseSpec[];
}

type PerformanceRatings = Record<string, AgeCategorySpec>;

const performanceRatings: PerformanceRatings =
  performanceRatingsRaw as PerformanceRatings;

// Parse the CSV data into structured format
export async function getPlayerData(): Promise<PlayerPerformance[]> {
  const base = path.join(process.cwd(), 'data', 'data-table-demo');
  const [playersJson, metricsJson] = await Promise.all([
    fs.readFile(path.join(base, 'players.json'), 'utf8'),
    fs.readFile(path.join(base, 'metrics.json'), 'utf8'),
  ]);
  const players = JSON.parse(playersJson) as {
    U11: string[];
    U12: string[];
    U13: string[];
    U14: string[];
    U15: string[];
    realU12: Array<{
      name: string;
      speed20m: number;
      speed10m: number;
      agility: number;
      dribbling: number;
      ballJuggling: number;
    }>;
  };
  const metrics = JSON.parse(metricsJson) as Record<
    string,
    Record<string, Record<string, number>>
  >;

  const categories = ['U11', 'U12', 'U13', 'U14', 'U15'] as const;
  const performanceData: PlayerPerformance[] = [];

  // Benchmark players by category
  categories.forEach((cat) => {
    const names = players[cat] || [];
    names.forEach((name, idx) => {
      performanceData.push({
        id: `${cat.toLowerCase()}-${idx + 1}`,
        name,
        speed20m: metrics.speed20m?.[cat]?.[name] ?? 0,
        speed10m: metrics.speed10m?.[cat]?.[name] ?? 0,
        agility: metrics.agility?.[cat]?.[name] ?? 0,
        dribbling: metrics.dribbling?.[cat]?.[name] ?? 0,
        ballControl: metrics.ballControl?.[cat]?.[name] ?? 0,
        ballJuggling: metrics.ballJuggling?.[cat]?.[name] ?? 0,
        overallRank: idx + 1,
        category: cat,
        isRealPlayer: false,
        prRank: 0,
      });
    });
  });

  // Real U12 players (provided with measured values)
  (players.realU12 || []).forEach((p, idx) => {
    performanceData.push({
      id: `u12-real-${idx + 1}`,
      name: p.name,
      speed20m: p.speed20m,
      speed10m: p.speed10m,
      agility: p.agility,
      dribbling: p.dribbling,
      ballControl: 0, // not provided
      ballJuggling: p.ballJuggling,
      overallRank: idx + 1,
      category: 'U12',
      isRealPlayer: true,
      prRank: 0,
    });
  });

  // Calculate PR ranks for all players
  performanceData.forEach((player) => {
    player.prRank = calculatePRRank(player, performanceData);
  });

  return performanceData;
}

// Helper functions to extract performance data
// Large inline metric maps removed; data now loaded from JSON files above.

// Color scale utility functions
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

  const ranges = exercise.ranges;

  // Convert value to number for comparison
  const numValue =
    typeof value === 'number' ? value : parseFloat(String(value));

  // Helper function to check if value is in range
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

  // Determine color based on performance ranges
  if (ranges.Excellent && isInRange(ranges.Excellent, numValue)) {
    return 'bg-green-300 dark:bg-green-800/50'; // Excellent - strong green
  } else if (ranges['Very Good'] && isInRange(ranges['Very Good'], numValue)) {
    return 'bg-green-200 dark:bg-green-800/40'; // Very Good - medium green
  } else if (ranges.Good && isInRange(ranges.Good, numValue)) {
    return 'bg-green-100 dark:bg-green-800/30'; // Good - light green
  } else if (
    ranges['Above Average'] &&
    isInRange(ranges['Above Average'], numValue)
  ) {
    return 'bg-orange-100 dark:bg-orange-900/30'; // Above Average - light orange
  } else if (ranges.Average && isInRange(ranges.Average, numValue)) {
    return 'bg-orange-200 dark:bg-orange-800/40'; // Average - orange
  } else if (
    ranges['Below Average'] &&
    isInRange(ranges['Below Average'], numValue)
  ) {
    return 'bg-red-100 dark:bg-red-900/30'; // Below Average - light red
  } else {
    // Fallback for values outside defined ranges
    return 'bg-red-200 dark:bg-red-800/40'; // Default - red
  }
}

export function getOverallPerformanceColor(player: PlayerPerformance): string {
  // Use Speed (20m) as the primary metric for overall color
  return getPerformanceColor(
    player.speed20m,
    'Schnelligkeit (20 m)',
    player.category,
  );
}

// PR Rank calculation helper functions
export function calculatePercentileRank(
  value: number,
  allValues: number[],
  isLowerBetter: boolean,
): number {
  if (allValues.length === 0) return 0;

  const sortedValues = [...allValues].sort((a, b) => a - b);

  if (isLowerBetter) {
    // For lower_is_better, count how many values are worse (higher) than the given value
    const worseCount = sortedValues.filter((v) => v > value).length;
    return Math.round((worseCount / allValues.length) * 100);
  } else {
    // For higher_is_better, count how many values are worse (lower) than the given value
    const worseCount = sortedValues.filter((v) => v < value).length;
    return Math.round((worseCount / allValues.length) * 100);
  }
}

export function calculatePRRank(
  player: PlayerPerformance,
  allPlayers: PlayerPerformance[],
): number {
  // Only calculate PR rank for real players
  if (!player.isRealPlayer) return 0;

  // Get all real players in the same category
  const categoryRealPlayers = allPlayers.filter(
    (p) => p.category === player.category && p.isRealPlayer,
  );

  if (categoryRealPlayers.length === 0) return 0;

  // Define exercises with their types
  const exercises = [
    { name: 'speed20m', isLowerBetter: true },
    { name: 'speed10m', isLowerBetter: true },
    { name: 'agility', isLowerBetter: true },
    { name: 'dribbling', isLowerBetter: true },
    { name: 'ballControl', isLowerBetter: true },
    { name: 'ballJuggling', isLowerBetter: false },
  ];

  const percentileRanks: number[] = [];

  exercises.forEach((exercise) => {
    const values = categoryRealPlayers.map(
      (p) => p[exercise.name as keyof PlayerPerformance] as number,
    );
    const playerValue = player[
      exercise.name as keyof PlayerPerformance
    ] as number;
    const percentileRank = calculatePercentileRank(
      playerValue,
      values,
      exercise.isLowerBetter,
    );
    percentileRanks.push(percentileRank);
  });

  // Calculate average percentile rank
  const averagePR =
    percentileRanks.reduce((sum, rank) => sum + rank, 0) /
    percentileRanks.length;
  return Math.round(averagePR);
}
