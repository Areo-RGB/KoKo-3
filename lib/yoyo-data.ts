export interface Player {
  id: string;
  name: string;
}

export interface YoYoRecord {
  date: string; // ISO date (YYYY-MM-DD)
  value: number; // meters
}

export interface PlayerSeries {
  player: Player;
  records: YoYoRecord[];
}

function toIsoDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRng(seed: string) {
  const seedFn = xmur3(seed);
  return mulberry32(seedFn());
}

export interface YoYoData {
  dates: string[];
  players: Player[];
  series: PlayerSeries[];
  averageByDate: { date: string; average: number }[];
  latestByPlayer: { playerId: string; name: string; value: number }[];
}

export function generateYoYoData(
  seed = 'yoyo-10x10',
  opts: {
    dates?: number;
    players?: number;
    startDate?: string;
    names?: string[];
  } = {},
): YoYoData {
  const rng = seededRng(seed);
  const countDates = Math.max(1, Math.floor(opts.dates ?? 10));
  const countPlayers = Math.max(1, Math.floor(opts.players ?? 10));
  // dates weekly from start
  const start = new Date(opts.startDate ?? '2024-04-01');
  const dates: string[] = Array.from({ length: countDates }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    return toIsoDateLocal(d);
  });

  const players: Player[] = Array.from({ length: countPlayers }, (_, i) => ({
    id: `p${i + 1}`,
    name: opts.names?.[i] ?? `Player ${i + 1}`,
  }));

  const series: PlayerSeries[] = players.map((player, pIdx) => {
    // Baseline around 500m (±80m)
    let value = 500 + (Math.floor(rng() * 161) - 80);
    const records: YoYoRecord[] = dates.map((date, dIdx) => {
      // Random drift per week
      const drift = Math.floor(rng() * 130) - 50; // -50 .. +80
      // Slight long-term upward trend for variety
      const trend = Math.floor((dIdx * (30 + pIdx)) / 10);
      value = Math.max(400, value + drift + trend);
      // Round to nearest 10 for realism
      const rounded = Math.round(value / 10) * 10;
      return { date, value: rounded };
    });
    return { player, records };
  });

  const averageByDate = dates.map((date, idx) => {
    const sum = series.reduce((acc, s) => acc + s.records[idx].value, 0);
    const avg = Math.round(sum / series.length);
    return { date, average: avg };
  });

  const latestByPlayer = series.map((s) => {
    const last = s.records[s.records.length - 1];
    return { playerId: s.player.id, name: s.player.name, value: last.value };
  });

  return { dates, players, series, averageByDate, latestByPlayer };
}
