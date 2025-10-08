// Sports data calculation utilities

export interface PlayerData {
  rank?: number; // Optional - will be calculated dynamically
  name: string;
  score: string;
  videoUrl?: string;
  videoUrl_current?: string;
  videoUrl_old_01?: string;
  videoUrl_old_02?: string;
  videoUrl_old_03?: string;
  videoUrl_old_04?: string;
  videoUrl_old_05?: string;
  [key: `videoUrl_old_${string}`]: string | undefined;
}

export interface SportData {
  name: string;
  data: PlayerData[];
}

// Categorize sports into Leistungsdiagnostik and Koordination (matching JavaScript logic)
const leistungsdiagnostikSports = [
  'Schnelligkeit (20m)',
  'Antritt (10m)',
  'Gewandtheit',
  'Dribbling',
  'Balljonglieren',
];

const koordinationSports = [
  'Seilspringen',
  'Seit. Hin- und Herspringen',
  'Rumpfbeugen',
  'Standweitsprung',
];

const motorikSports = [
  'Seilspringen',
  'Liegestütze',
  'Standweitsprung',
  'Seit. Hin- und Herspringen',
  'Sit-Ups',
  'Rumpfbeugen',
];

/**
 * Check if a score entry should be excluded from calculations (contains "-")
 */
function isScoreExcluded(score: string): boolean {
  return score.includes('-');
}

/**
 * Calculate percent rank for a given rank and total participants
 * Formula: ((rank - 1) / (totalParticipants - 1)) * 100
 */
function calculatePercentRank(
  rank: number,
  totalParticipants: number,
): number {
  if (totalParticipants <= 1) return 0;
  return ((rank - 1) / (totalParticipants - 1)) * 100;
}

/**
 * Get video URL for a specific player and exercise
 */
export function getVideoForPlayer(
  playerName: string,
  exerciseName: string,
  sportsData: SportData[],
): string | null {
  const sport = sportsData.find((s) => s.name === exerciseName);
  if (!sport) return null;

  const player = sport.data.find((p) => p.name === playerName);
  if (!player) return null;

  return player.videoUrl ?? null;
}

/**
 * Check if a player has a video for a specific exercise
 */
export function hasVideo(
  playerName: string,
  exerciseName: string,
  sportsData: SportData[],
): boolean {
  return getVideoForPlayer(playerName, exerciseName, sportsData) !== null;
}

/**
 * Detect scoring type based on score format
 */
function detectScoreType(
  score: string,
): 'lower-better' | 'higher-better' {
  if (score.endsWith('s')) {
    // Time scores: lower is better
    return 'lower-better';
  } else if (
    score.endsWith('P.') ||
    score.endsWith('Wdh') ||
    score.endsWith('cm')
  ) {
    // Points, repetitions, distance: higher is better
    return 'higher-better';
  }
  // Default to lower is better for time-like scores
  return 'lower-better';
}

/**
 * Parse score string to numeric value for comparison
 */
function parseScore(score: string): number {
  // Remove units and convert to number
  const numStr = score
    .replace(/[^\d,.-]/g, '') // Remove non-numeric chars except comma, dot, minus
    .replace(',', '.'); // Convert German decimal comma to dot

  return parseFloat(numStr) || 0;
}

/**
 * Calculate ranks for players in a sport based on their scores
 */
function calculateRanks(players: PlayerData[]): PlayerData[] {
  if (players.length === 0) return players;

  // Detect score type from first valid score
  const scoreType = detectScoreType(players[0].score);

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = parseScore(a.score);
    const scoreB = parseScore(b.score);

    if (scoreType === 'lower-better') {
      return scoreA - scoreB; // Ascending for times (lower is better)
    } else {
      return scoreB - scoreA; // Descending for points (higher is better)
    }
  });

  // Assign ranks, handling ties
  let currentRank = 1;
  return sortedPlayers.map((player, index) => {
    if (index > 0) {
      const currentScore = parseScore(player.score);
      const previousScore = parseScore(sortedPlayers[index - 1].score);

      // If scores are different, update rank
      if (currentScore !== previousScore) {
        currentRank = index + 1;
      }
      // If scores are the same, keep the same rank
    }

    return {
      ...player,
      rank: currentRank,
    };
  });
}

/**
 * Add calculated ranks to all sports data
 */
function addCalculatedRanks(sportsData: SportData[]): SportData[] {
  return sportsData.map((sport) => ({
    ...sport,
    data: calculateRanks(sport.data),
  }));
}

/**
 * Get sports data with calculated ranks
 */
export function getSportsDataWithRanks(sportsData: SportData[]): SportData[] {
  return addCalculatedRanks(sportsData);
}
