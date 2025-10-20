import unified from '@/data/players/players.json';
import { SportData } from '../util/sports-utils';

// Build SportData[] from unified players.json
const TESTS: { key: string; name: string; format: (v: number) => string }[] = [
  {
    key: 'Schnelligkeit (20m)',
    name: 'Schnelligkeit (20m)',
    format: (v) => `${String(v).replace('.', ',')}s`,
  },
  {
    key: 'Antritt (10m)',
    name: 'Antritt (10m)',
    format: (v) => `${String(v).replace('.', ',')}s`,
  },
  {
    key: 'Gewandtheit',
    name: 'Gewandtheit',
    format: (v) => `${String(v).replace('.', ',')}s`,
  },
  {
    key: 'Dribbling',
    name: 'Dribbling',
    format: (v) => `${String(v).replace('.', ',')}s`,
  },
  {
    key: 'Balljonglieren',
    name: 'Balljonglieren',
    format: (v) => `${String(v).replace('.', ',')} P.`,
  },
];

interface PlayerResultEntry {
  value?: number | null;
}

interface UnifiedPlayer {
  name: string;
  results?: Record<string, PlayerResultEntry[]>;
}

const unifiedPlayers: UnifiedPlayer[] = Array.isArray(unified.players)
  ? (unified.players as UnifiedPlayer[])
  : [];

export const sportsData: SportData[] = TESTS.map((t) => ({
  name: t.name,
  data: unifiedPlayers
    .map((player) => {
      const entries = player.results?.[t.key] ?? [];
      if (entries.length === 0) return null;

      const latest = entries[entries.length - 1];
      if (latest?.value == null) return null;

      return { name: player.name, score: t.format(latest.value) };
    })
    .filter(
      (record): record is { name: string; score: string } => record !== null,
    ),
}));
