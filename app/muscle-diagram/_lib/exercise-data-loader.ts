// Optimized data loader for exercise data that fetches only what's needed
export interface MuscleExercise {
  title: string;
  videos: string[];
}

export interface MuscleInfo {
  name: string;
  description: string;
  details: string[];
}

export interface MuscleData {
  exerciseData: MuscleExercise | null;
  stretchingData: MuscleExercise | null;
  muscleInfo: MuscleInfo | null;
}

// Cache for loaded muscle data to avoid repeated fetches
const muscleDataCache = new Map<string, MuscleData>();

/**
 * Fetches exercise data for a specific muscle group
 * Only loads data when actually needed, reducing bundle size and initial load time
 */
export async function loadMuscleData(
  muscleGroup: string,
): Promise<MuscleData | null> {
  // Check cache first
  if (muscleDataCache.has(muscleGroup)) {
    return muscleDataCache.get(muscleGroup)!;
  }

  try {
    const response = await fetch(`/data/exercises/${muscleGroup}.json`);
    if (!response.ok) {
      console.warn(`Failed to load data for muscle group: ${muscleGroup}`);
      return null;
    }

    const data: MuscleData = await response.json();

    // Cache the data
    muscleDataCache.set(muscleGroup, data);

    return data;
  } catch (error) {
    console.error(`Error loading muscle data for ${muscleGroup}:`, error);
    return null;
  }
}

/**
 * Preloads muscle data for multiple muscle groups
 * Useful for warming up the cache when the user is likely to access multiple muscles
 */
export async function preloadMuscleData(muscleGroups: string[]): Promise<void> {
  const promises = muscleGroups
    .filter((group) => !muscleDataCache.has(group))
    .map((group) => loadMuscleData(group));

  await Promise.allSettled(promises);
}

/**
 * Gets available muscle groups from the index
 */
export async function getAvailableMuscleGroups(): Promise<string[]> {
  try {
    const response = await fetch('/data/exercises/index.json');
    if (!response.ok) {
      throw new Error('Failed to load muscle groups index');
    }

    const { muscles } = await response.json();
    return muscles;
  } catch (error) {
    console.error('Error loading muscle groups index:', error);
    // Fallback to known muscle groups
    return [
      'abdominals',
      'biceps',
      'calves',
      'chest',
      'forearms',
      'glutes',
      'hamstrings',
      'lats',
      'lowerback',
      'quads',
      'shoulders',
      'triceps',
      'traps',
      'obliques',
    ];
  }
}

/**
 * Legacy compatibility function for components that still expect the old format
 * This will be removed once all components are updated
 */
export function createLegacyDataStructure(
  muscleDataMap: Map<string, MuscleData>,
) {
  const exerciseData: Record<string, MuscleExercise> = {};
  const stretchingData: Record<string, MuscleExercise> = {};
  const muscleInfo: Record<string, MuscleInfo> = {};

  muscleDataMap.forEach((data, muscleGroup) => {
    if (data.exerciseData) {
      exerciseData[muscleGroup] = data.exerciseData;
    }
    if (data.stretchingData) {
      stretchingData[muscleGroup] = data.stretchingData;
    }
    if (data.muscleInfo) {
      muscleInfo[muscleGroup] = data.muscleInfo;
    }
  });

  return { exerciseData, stretchingData, muscleInfo };
}
