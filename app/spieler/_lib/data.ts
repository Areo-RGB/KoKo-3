import unified from '@/data/players/players.json';

type Unified = typeof unified;

function getPlayer(name: string): Unified['players'][number] | undefined {
  return (unified.players as Unified['players']).find((p) => p.name === name);
}

export function getPlayersFromTests(): string[] {
  return [...new Set(unified.players.map((p) => p.name))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getCurrentResultsForPlayer(name: string) {
  const p = getPlayer(name);
  const getLatest = (key: string) => {
    const arr = (p?.results as any)?.[key] as
      | { date: string | null; value: number | null; unit: string }[]
      | undefined;
    if (!arr || arr.length === 0) return null;
    // Sort by date string; nulls last
    const sorted = [...arr].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
    return sorted[sorted.length - 1];
  };

  const yoyo = getLatest('yoyoIr1');
  const jong = getLatest('jonglieren');

  return {
    yoyo: yoyo
      ? { value: yoyo.value, date: yoyo.date, unit: yoyo.unit }
      : {
          value: null as number | null,
          date: null as string | null,
          unit: 'm',
        },
    jonglieren: jong
      ? { value: jong.value, date: jong.date, unit: jong.unit }
      : {
          value: null as number | null,
          date: null as string | null,
          unit: 'x',
        },
  };
}
