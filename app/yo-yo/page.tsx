'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/util/utils';

type RankingMap = Record<string, number>;

const DISTANCE_OPTIONS = [
  40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600,
  640, 680, 720, 760, 800, 840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160,
  1200, 1240, 1280,
] as const;
const LOCAL_STORAGE_KEY = 'yo-yo-ranking';

function formatDistance(distance: number): string {
  return `${Intl.NumberFormat().format(distance)} m`;
}

export default function YoYoRankingPage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [armedPlayer, setArmedPlayer] = useState<string | null>(null);
  const [dialogPlayer, setDialogPlayer] = useState<string | null>(null);
  const [distanceInput, setDistanceInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [rankings, setRankings] = useState<RankingMap>({});

  useEffect(() => {
    let isMounted = true;

    const loadPlayers = async () => {
      try {
        const response = await fetch('/data/yo-yo/players.json');
        if (!response.ok) {
          throw new Error('Spieler konnten nicht geladen werden.');
        }
        const data = (await response.json()) as string[];
        if (isMounted) {
          setPlayers(data);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error ? error.message : 'Unbekannter Fehler.',
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as unknown;
      if (!parsed || typeof parsed !== 'object') return;

      const validatedEntries = Object.entries(parsed as Record<string, unknown>)
        .reduce<RankingMap>((accumulator, [name, value]) => {
          const numericValue =
            typeof value === 'number' ? value : Number(value);
          if (Number.isFinite(numericValue) && numericValue > 0) {
            accumulator[name] = numericValue;
          }
          return accumulator;
        }, {});

      setRankings(validatedEntries);
    } catch {
      // Ignore malformed cached data.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (Object.keys(rankings).length === 0) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(rankings),
        );
      }
    } catch {
      // Ignore storage errors (e.g. quota exceeded, private mode).
    }
  }, [rankings]);

  const rankingList = useMemo(
    () =>
      Object.entries(rankings).sort(([, aDistance], [, bDistance]) =>
        bDistance - aDistance,
      ),
    [rankings],
  );

  const handleButtonClick = (name: string) => {
    if (armedPlayer === name) {
      setDialogPlayer(name);
      const existingDistance = rankings[name];
      const prefillValue =
        existingDistance !== undefined &&
          DISTANCE_OPTIONS.some((option) => option === existingDistance)
          ? String(existingDistance)
          : '';
      setDistanceInput(prefillValue);
      setInputError(null);
      return;
    }

    setArmedPlayer(name);
  };

  const handleResetRankings = () => {
    setRankings({});
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setDialogPlayer(null);
    setDistanceInput('');
    setInputError(null);
    setArmedPlayer(null);
  };

  const handleDistanceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dialogPlayer) return;

    const rawValue = distanceInput.trim();
    if (!rawValue) {
      setInputError('Bitte eine Distanz eintragen.');
      return;
    }

    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setInputError('Bitte eine gültige Distanz in Metern angeben.');
      return;
    }

    setRankings((previous) => ({ ...previous, [dialogPlayer]: numericValue }));
    handleDialogClose();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Yo-Yo Test</h1>
        <p className="text-muted-foreground text-sm">
          Wähle eine Spielerin oder einen Spieler aus und erfasse die
          gelaufene Distanz.
        </p>
      </header>

      {loading && (
        <p className="text-muted-foreground text-sm">Lade Spieler...</p>
      )}

      {loadError && (
        <p className="text-destructive text-sm">{loadError}</p>
      )}

      {!loading && !loadError && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {players.map((name) => (
            <Button
              key={name}
              type="button"
              variant="outline"
              aria-pressed={armedPlayer === name}
              onClick={() => handleButtonClick(name)}
              className={cn(
                'justify-start text-left text-base font-medium',
                armedPlayer === name &&
                'border-red-500 text-red-600 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]',
              )}
            >
              {name}
            </Button>
          ))}
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold">Ranking</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetRankings}
            disabled={rankingList.length === 0}
          >
            Zurücksetzen
          </Button>
        </div>
        {rankingList.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Noch keine Distanzen erfasst.
          </p>
        ) : (
          <ol className="grid gap-2">
            {rankingList.map(([name, distance], index) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-md border bg-card p-3"
              >
                <span className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium">
                    {index + 1}.
                  </span>
                  <span>{name}</span>
                </span>
                <span className="font-semibold">{formatDistance(distance)}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <Dialog open={dialogPlayer !== null} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distanz eintragen</DialogTitle>
            <DialogDescription>
              {dialogPlayer
                ? `${dialogPlayer} eine Distanz in Metern zuordnen.`
                : 'Trage eine Distanz in Metern ein.'}
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleDistanceSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="distance">Distanz (Meter)</Label>
              <Select
                value={distanceInput || undefined}
                onValueChange={(value) => {
                  setDistanceInput(value);
                  setInputError(null);
                }}
              >
                <SelectTrigger id="distance">
                  <SelectValue placeholder="Distanz auswählen" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {DISTANCE_OPTIONS.map((distance) => (
                    <SelectItem key={distance} value={String(distance)}>
                      {distance} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inputError && (
                <p className="text-destructive text-sm">{inputError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Abbrechen
              </Button>
              <Button type="submit">Speichern</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
