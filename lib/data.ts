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

export const sportsData: SportData[] = TESTS.map((t) => ({
  name: t.name,
  data: (unified.players as any[])
    .map((p) => {
      const arr = (p.results?.[t.key] || []) as { value?: number | null }[];
      if (!arr.length) return null;
      const latest = arr[arr.length - 1];
      if (latest?.value == null) return null;
      return { name: p.name, score: t.format(latest.value) };
    })
    .filter(Boolean) as any,
}));

export const participants = Array.from(
  new Set((unified.players as any[]).map((p) => p.name)),
).sort();
