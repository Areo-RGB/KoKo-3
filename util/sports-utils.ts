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

export interface PlayerPercentRank {
  name: string;
  leistungsdiagnostikAverage: number;
  koordinationAverage: number;
  motorikAverage: number;
  leistungsdiagnostikRank: number;
  koordinationRank: number;
  motorikRank: number;
}

// Categorize sports into Leistungsdiagnostik and Koordination (matching JavaScript logic)
export const leistungsdiagnostikSports = [
  'Schnelligkeit (20m)',
  'Antritt (10m)',
  'Gewandtheit',
  'Dribbling',
  'Balljonglieren',
];

export const koordinationSports = [
  'Seilspringen',
  'Seit. Hin- und Herspringen',
  'Rumpfbeugen',
  'Standweitsprung',
];

export const motorikSports = [
  'Seilspringen',
  'Liegestütze',
  'Standweitsprung',
  'Seit. Hin- und Herspringen',
  'Sit-Ups',
  'Rumpfbeugen',
];

/**
 * Build chart-ready data for a single player's exercises.
 * For better visual intuition we convert percentRank -> betterThanPercent = 100 - percentRank
 * so higher slices mean stronger performance.
 */
export function getPlayerExerciseChartData(
  sportsData: SportData[],
  playerName: string,
) {
  const labels: string[] = [];
  const data: number[] = [];

  sportsData.forEach((sport) => {
    labels.push(sport.name);
    const playerResult = sport.data.find((p) => p.name === playerName);

    let percentRank: number;
    if (!playerResult) {
      percentRank = 100; // Player not found, worst rank
    } else if (isScoreExcluded(playerResult.score)) {
      percentRank = 50; // Player has "-" score, assign 50% rank points
    } else {
      percentRank = calculatePercentRank(
        playerResult.rank ?? 99,
        sport.data.length,
      );
    }

    const betterThan = Math.max(0, 100 - percentRank); // higher is better
    data.push(Number(betterThan.toFixed(1)));
  });

  return { labels, data };
}

/**
 * Group exercises by named categories and sum the 'betterThan' values for each group.
 * categoryMap: { categoryName: string[] } where arrays are sport names.
 */
export function getPlayerCategoryChartData(
  sportsData: SportData[],
  playerName: string,
  categoryMap: Record<string, string[]>,
  options?: { aggregate?: 'sum' | 'average' },
) {
  const labels: string[] = [];
  const data: number[] = [];
  const aggregate = options?.aggregate ?? 'sum';

  for (const [category, sportNames] of Object.entries(categoryMap)) {
    labels.push(category);
    let sum = 0;
    let count = 0;
    sportNames.forEach((sportName) => {
      const sport = sportsData.find((s) => s.name === sportName);
      if (!sport) return;
      const entry = sport.data.find((e) => e.name === playerName);

      let percentRank: number;
      if (!entry) {
        percentRank = 100; // Player not found, worst rank
      } else if (isScoreExcluded(entry.score)) {
        percentRank = 50; // Player has "-" score, assign 50% rank points
      } else {
        percentRank = calculatePercentRank(entry.rank ?? 99, sport.data.length);
      }

      const betterThan = Math.max(0, 100 - percentRank);
      sum += betterThan;
      count++;
    });

    const value = aggregate === 'average' && count > 0 ? sum / count : sum;
    data.push(Number(value.toFixed(1)));
  }

  return { labels, data };
}

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
export function calculatePercentRank(
  rank: number,
  totalParticipants: number,
): number {
  if (totalParticipants <= 1) return 0;
  return ((rank - 1) / (totalParticipants - 1)) * 100;
}

/**
 * Format percent rank as a percentage string
 */
export function formatPercentRank(percentRank: number): string {
  return `${percentRank.toFixed(1)}%`;
}

/**
 * Convert percent rank to "better than X%" format
 * Formula: 100 - percentRank = percentage of participants performed worse
 */
export function convertToBetterThanPercent(percentRank: number): number {
  return Math.round(100 - percentRank);
}

/**
 * Format as "better than X%" string
 */
export function formatBetterThanPercent(percentRank: number): string {
  const betterThan = convertToBetterThanPercent(percentRank);
  return `${betterThan}%`;
}

export function calculatePlayerPercentRanks(
  sportsData: SportData[],
): PlayerPercentRank[] {
  const players = Array.from(
    new Set(
      sportsData.flatMap((sport) => sport.data.map((entry) => entry.name)),
    ),
  ).sort();

  // Calculate percent ranks for each player
  const playerPercentRanks = players.map((playerName) => {
    let leistungsdiagnostikTotal = 0;
    let leistungsdiagnostikCount = 0;
    let koordinationTotal = 0;
    let koordinationCount = 0;
    let motorikTotal = 0;
    let motorikCount = 0;

    sportsData.forEach((sport) => {
      const playerResult = sport.data.find((p) => p.name === playerName);

      let percentRank: number;
      if (!playerResult) {
        percentRank = 100; // Player not found, worst rank
      } else if (isScoreExcluded(playerResult.score)) {
        percentRank = 50; // Player has "-" score, assign 50% rank points
      } else {
        percentRank = calculatePercentRank(
          playerResult.rank ?? 99,
          sport.data.length,
        );
      }

      if (leistungsdiagnostikSports.includes(sport.name)) {
        leistungsdiagnostikTotal += percentRank;
        leistungsdiagnostikCount++;
      }
      if (koordinationSports.includes(sport.name)) {
        koordinationTotal += percentRank;
        koordinationCount++;
      }
      if (motorikSports.includes(sport.name)) {
        motorikTotal += percentRank;
        motorikCount++;
      }
    });

    return {
      name: playerName,
      leistungsdiagnostikAverage:
        leistungsdiagnostikCount > 0
          ? leistungsdiagnostikTotal / leistungsdiagnostikCount
          : 100,
      koordinationAverage:
        koordinationCount > 0 ? koordinationTotal / koordinationCount : 100,
      motorikAverage: motorikCount > 0 ? motorikTotal / motorikCount : 100,
    };
  });

  // Calculate rankings based on averages
  const sortedByLeistungsdiagnostik = [...playerPercentRanks].sort(
    (a, b) => a.leistungsdiagnostikAverage - b.leistungsdiagnostikAverage,
  );

  const sortedByKoordination = [...playerPercentRanks].sort(
    (a, b) => a.koordinationAverage - b.koordinationAverage,
  );

  const sortedByMotorik = [...playerPercentRanks].sort(
    (a, b) => a.motorikAverage - b.motorikAverage,
  );

  // Assign ranks
  return playerPercentRanks.map((player) => ({
    name: player.name,
    leistungsdiagnostikAverage: player.leistungsdiagnostikAverage,
    koordinationAverage: player.koordinationAverage,
    motorikAverage: player.motorikAverage,
    leistungsdiagnostikRank:
      sortedByLeistungsdiagnostik.findIndex((p) => p.name === player.name) + 1,
    koordinationRank:
      sortedByKoordination.findIndex((p) => p.name === player.name) + 1,
    motorikRank: sortedByMotorik.findIndex((p) => p.name === player.name) + 1,
  }));
}

export function getOverallRank(
  playerName: string,
  disciplineTab: 'technical',
  playerPercentRanks: PlayerPercentRank[],
): number {
  const player = playerPercentRanks.find((p) => p.name === playerName);
  if (!player) return 0;

  // Match the JavaScript logic exactly:
  // rank: state.disciplineTab === 'technical' ? player.leistungsdiagnostikRank : player.koordinationRank
  return disciplineTab === 'technical'
    ? player.leistungsdiagnostikRank
    : player.koordinationRank;
}

/**
 * Get simple overall score (sum of ranks) - alternative method
 */
export function getSimpleOverallScore(
  playerName: string,
  disciplines: SportData[],
): number {
  return disciplines.reduce((total, sport) => {
    const entry = sport.data.find((d) => d.name === playerName);

    if (!entry) {
      // Player not found, assign worst possible rank
      return total + (sport.data.length + 1);
    } else if (isScoreExcluded(entry.score)) {
      // Player has "-" score, assign middle rank (50% of total participants)
      return total + Math.ceil(sport.data.length / 2);
    } else {
      return total + (entry.rank ?? 99);
    }
  }, 0);
}

/**
 * Get all exercise data for a specific player
 */
export interface PlayerExerciseData {
  exercise: string;
  score: string;
  rank: number;
  totalParticipants: number;
}

export function getPlayerData(
  playerName: string,
  sportsData: SportData[],
): PlayerExerciseData[] {
  return sportsData
    .map((sport) => {
      const entry = sport.data.find((d) => d.name === playerName);

      if (!entry) {
        return null;
      }

      return {
        exercise: sport.name,
        score: entry.score,
        rank: entry.rank,
        totalParticipants: sport.data.length,
      };
    })
    .filter((data): data is PlayerExerciseData => data !== null);
}

/**
 * Get overall percentage for a specific player (same calculation as daten page)
 */
export function getPlayerOverallPercentage(
  playerName: string,
  sportsData: SportData[],
): string {
  const playerPercentRanks = calculatePlayerPercentRanks(sportsData);
  const player = playerPercentRanks.find((p) => p.name === playerName);

  if (!player) {
    return '0%';
  }

  // Calculate overall average (same as 'Gesamt' tab on daten page)
  const averagePercentRank =
    (player.leistungsdiagnostikAverage +
      player.koordinationAverage +
      player.motorikAverage) /
    3;

  return formatBetterThanPercent(averagePercentRank);
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
export function detectScoreType(
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
export function parseScore(score: string): number {
  // Remove units and convert to number
  const numStr = score
    .replace(/[^\d,.-]/g, '') // Remove non-numeric chars except comma, dot, minus
    .replace(',', '.'); // Convert German decimal comma to dot

  return parseFloat(numStr) || 0;
}

/**
 * Calculate ranks for players in a sport based on their scores
 */
export function calculateRanks(players: PlayerData[]): PlayerData[] {
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
export function addCalculatedRanks(sportsData: SportData[]): SportData[] {
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
