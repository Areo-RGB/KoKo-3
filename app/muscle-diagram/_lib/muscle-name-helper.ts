/**
 * Maps SVG muscle IDs to the corresponding exercise data keys and display names
 * for the muscle diagram experience. The logic lives alongside the route to
 * keep all per-page helpers colocated.
 */

// Mapping from SVG muscle IDs to exercise data muscle groups
export const muscleToExerciseDataMap: Record<string, string> = {
  // SVG muscle ID -> Exercise data key
  biceps: 'biceps',
  chest: 'chest',
  abs: 'abdominals',
  abdominals: 'abdominals',
  calves: 'calves',
  gastrocnemius: 'calves',
  soleus: 'calves',
  forearms: 'forearms',
  'wrist-extensors': 'forearms',
  'wrist-flexors': 'forearms',
  'gluteus-maximus': 'glutes',
  'gluteus-medius': 'glutes',
  glutes: 'glutes',
  'medial-hamstrings': 'hamstrings',
  'lateral-hamstrings': 'hamstrings',
  hamstrings: 'hamstrings',
  lats: 'lats',
  lowerback: 'lowerback',
  'lower-back': 'lowerback',
  quadriceps: 'quads',
  'outer-quadricep': 'quads',
  'rectus-femoris': 'quads',
  'inner-quadricep': 'quads',
  'vastus-lateralis': 'quads',
  'vastus-medialis': 'quads',
  shoulders: 'shoulders',
  'lateral-deltoid': 'shoulders',
  'posterior-deltoid': 'shoulders',
  'anterior-deltoid': 'shoulders',
  'upper-trapezius': 'traps',
  'lower-trapezius': 'traps',
  'traps-middle': 'traps',
  traps: 'traps',
  'medial-head-triceps': 'triceps',
  'long-head-triceps': 'triceps',
  'lateral-head-triceps': 'triceps',
  triceps: 'triceps',
  neck: 'neck',
  'upper-chest': 'chest',
  'lower-chest': 'chest',
  obliques: 'abdominals',
  'lower-abdominals': 'abdominals',
  'upper-abdominals': 'abdominals',
  'rectus-abdominis': 'abdominals',
  'external-obliques': 'abdominals',
  'inner-thigh': 'adductors',
  tibialis: 'shins',
  'tibialis-anterior': 'shins',
  sartorius: 'sartorius',
  groin: 'groin',
  'serratus-anterior': 'serratus',
  brachialis: 'biceps',
};

export const muscleNameMap: Record<string, string> = {
  // Shared muscles (both views)
  neck: 'Neck',
  feet: 'Feet',
  'upper-trapezius': 'Upper Trapezius',
  gastrocnemius: 'Gastrocnemius (Calves)',
  soleus: 'Soleus',
  'inner-thigh': 'Inner Thigh (Adductors)',
  'wrist-extensors': 'Wrist Extensors',
  'wrist-flexors': 'Wrist Flexors',
  hands: 'Hands',

  // Spezifische Muskeln der Rückansicht
  'medial-hamstrings': 'Mediale Beinbeuger',
  'lateral-hamstrings': 'Laterale Beinbeuger',
  'gluteus-maximus': 'Gluteus Maximus (Großer Gesäßmuskel)',
  'gluteus-medius': 'Gluteus Medius (Mittlerer Gesäßmuskel)',
  lowerback: 'Unterer Rücken (Rückenstrecker)',
  lats: 'Latissimus Dorsi (Lat)',
  'medial-head-triceps': 'Medialer Kopf des Trizeps',
  'long-head-triceps': 'Langer Kopf des Trizeps',
  'lateral-head-triceps': 'Lateraler Kopf des Trizeps',
  'lateral-deltoid': 'Seitlicher Deltamuskel',
  'posterior-deltoid': 'Hinterer Deltamuskel',
  'lower-trapezius': 'Unterer Trapezius',
  'traps-middle': 'Mittlerer Trapezius',

  // Spezifische Muskeln der Vorderansicht
  groin: 'Adduktoren (Leiste)',
  tibialis: 'Vorderer Schienbeinmuskel (Schienbein)',
  'outer-quadricep': 'Vastus Lateralis (Äußerer Quadrizeps)',
  'rectus-femoris': 'Rectus Femoris (Mittlerer Quadrizeps)',
  'inner-quadricep': 'Vastus Medialis (Innerer Quadrizeps)',
  'long-head-bicep': 'Langer Kopf des Bizeps',
  'short-head-bicep': 'Kurzer Kopf des Bizeps',
  obliques: 'Seitliche Bauchmuskeln',
  'lower-abdominals': 'Untere Bauchmuskeln',
  'upper-abdominals': 'Obere Bauchmuskeln',

  // Common alternative names
  chest: 'Chest (Pectorals)',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  forearms: 'Forearms',
  abs: 'Abdominals',
  quadriceps: 'Quadriceps',
  'hip-flexors': 'Hip Flexors',
  'tibialis-anterior': 'Tibialis Anterior (Shins)',
  'anterior-deltoid': 'Anterior Deltoid',
  brachialis: 'Brachialis',
  'upper-chest': 'Upper Chest',
  'lower-chest': 'Lower Chest',
  'serratus-anterior': 'Serratus Anterior',
  'rectus-abdominis': 'Rectus Abdominis',
  'external-obliques': 'External Obliques',
  'vastus-lateralis': 'Vastus Lateralis',
  'vastus-medialis': 'Vastus Medialis',
  sartorius: 'Sartorius',
};

/**
 * Converts a muscle group ID to a human-readable name.
 */
export function getMuscleDisplayName(muscleId: string | null): string {
  if (muscleId == null || muscleId === '') return '';

  if (muscleNameMap[muscleId]) {
    return muscleNameMap[muscleId];
  }

  return muscleId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Walks up the DOM tree to find the closest SVG group ID for a hovered element.
 */
export function getMuscleIdFromElement(element: Element): string | null {
  if (element.id) {
    return element.id;
  }

  let parent = element.parentElement;
  while (parent) {
    if (parent.id && parent.tagName.toLowerCase() === 'g') {
      return parent.id;
    }
    parent = parent.parentElement;
  }

  return null;
}

/**
 * Maps a muscle ID to the exercise data key consumed by the page.
 */
export function getExerciseDataKey(muscleId: string | null): string | null {
  if (muscleId == null || muscleId === '') return null;
  return muscleToExerciseDataMap[muscleId] || null;
}

/**
 * Formats muscle name for display.
 */
export function formatMuscleForDisplay(muscleId: string | null): string {
  const displayName = getMuscleDisplayName(muscleId);
  if (!displayName) return '';
  return displayName;
}
