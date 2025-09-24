'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const YoYoTestInterface = dynamic(
  () => import('./_components/yo-yo-test-interface'),
  {
    ssr: false,
    loading: () => (
      <div className="py-8 text-center text-muted-foreground">
        Loading Test Interface...
      </div>
    ),
  },
);

export default function YoYoIR1TestPage() {
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/data/yo-yo/players.json', {
          cache: 'force-cache',
        });
        if (!res.ok) throw new Error(String(res.status));
        const arr = (await res.json()) as string[];
        if (!cancelled) setPlayers(arr);
      } catch {
        // Fallback to bundled config for dev
        try {
          const mod = await import('./_lib/config');
          if (!cancelled) setPlayers((mod as any).PLAYERS as string[]);
        } catch {
          // ignore
        }
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Yo-Yo Intermittent Recovery Test Level 1
        </h1>
        <p className="text-muted-foreground mt-2">
          An interactive tool for administering and recording the Yo-Yo IR1
          test.
        </p>
      </div>

      <YoYoTestInterface players={players} />
    </div>
  );
}
