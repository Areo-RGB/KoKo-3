'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Pause, Play, Square, Star, StarOff, Volume2 } from 'lucide-react';
import React from 'react';

type SoundItem = {
  id: string;
  label: string;
  src: string;
  sources: string[];
  ttsFallback?: boolean;
};
type Topic = { id: string; name: string; sounds: SoundItem[] };

const FAVORITES_KEY = 'soundboard:favorites';

function normalizeFavoriteKey(raw: string) {
  if (raw.includes('::')) return raw;
  const parts = raw.split(':').filter(Boolean);
  if (parts.length >= 2) {
    const topicId = parts[parts.length - 2];
    const soundId = parts[parts.length - 1];
    return `${topicId}::${soundId}`;
  }
  return raw;
}

export default function SoundboardPage() {
  const [collection, setCollection] = React.useState<string>('lol');
  const [activeTopic, setActiveTopic] = React.useState<string>('');
  const [volume, setVolume] = React.useState<number>(0.8);
  const [lastPlayed, setLastPlayed] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState<boolean>(false);
  const [topics, setTopics] = React.useState<Topic[] | null>(null);
  const [variantTarget, setVariantTarget] = React.useState<SoundItem | null>(
    null,
  );
  const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set());
  const [favoritesHydrated, setFavoritesHydrated] = React.useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const makeFavoriteKey = React.useCallback(
    (topicId: string, soundId: string) => `${topicId}::${soundId}`,
    [],
  );

  const favoriteLookup = React.useMemo(() => {
    const map = new Map<string, Set<string>>();
    favoriteIds.forEach((key) => {
      const [topicId, soundId] = key.split('::');
      if (!topicId || !soundId) return;
      const bucket = map.get(topicId) ?? new Set<string>();
      bucket.add(soundId);
      map.set(topicId, bucket);
    });
    return map;
  }, [favoriteIds]);

  // Load manifest from server (DO Spaces listing)
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      const loadFavorites = () => {
        if (typeof window === 'undefined') return;
        try {
          const raw = window.localStorage.getItem(FAVORITES_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as string[];
            if (Array.isArray(parsed)) {
              setFavoriteIds(
                new Set(
                  parsed.map((value) => normalizeFavoriteKey(String(value))),
                ),
              );
            }
          }
        } catch {
          // ignore malformed data
        } finally {
          setFavoritesHydrated(true);
        }
      };

      loadFavorites();

      try {
        const res = await fetch('/api/soundboard/manifest');
        if (!res.ok) throw new Error('manifest_fetch_failed');
        const data = (await res.json()) as { topics: Topic[] };
        if (!cancelled) {
          setTopics(data.topics);
        }
      } catch {
        // Keep topics null to show empty state
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!favoritesHydrated || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(Array.from(favoriteIds)),
      );
    } catch {
      // ignore storage failure (quota, etc.)
    }
  }, [favoriteIds, favoritesHydrated]);

  // Keep references to currently playing HTMLAudioElements
  const playingMap = React.useRef<Map<string, HTMLAudioElement>>(new Map());

  const stopAll = React.useCallback(() => {
    playingMap.current.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    });
    playingMap.current.clear();
  }, []);

  const speak = React.useCallback(
    (text: string) => {
      // Browser TTS fallback if no file is provided
      if (typeof window === 'undefined' || !('speechSynthesis' in window))
        return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
      try {
        window.speechSynthesis.speak(utterance);
      } catch {}
    },
    [isMuted, volume],
  );

  const playSound = React.useCallback(
    async (sound: SoundItem, sourceIndex = 0) => {
      const selectedSrc = sound.sources?.[sourceIndex] ?? sound.src;

      if (!selectedSrc) {
        if (sound.ttsFallback) speak(sound.label);
        return;
      }

      setLastPlayed(
        sound.sources?.length > 1
          ? `${sound.label} (Version ${sourceIndex + 1})`
          : sound.label,
      );

      // Stop and clean up any prior instance of the same sound
      const prior = playingMap.current.get(sound.id);
      if (prior) {
        try {
          prior.pause();
          prior.currentTime = 0;
        } catch {}
        playingMap.current.delete(sound.id);
      }

      const audio = new Audio(selectedSrc);
      audio.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
      audio.onended = () => {
        playingMap.current.delete(sound.id);
      };
      audio.onerror = () => {
        if (sound.ttsFallback) speak(sound.label);
      };
      playingMap.current.set(sound.id, audio);
      try {
        await audio.play();
      } catch {
        // Some browsers require a user gesture; we already are in a click handler.
      }
    },
    [isMuted, speak, volume],
  );

  const onToggleMute = React.useCallback(() => setIsMuted((v) => !v), []);

  const filteredTopics = React.useMemo(() => {
    if (!topics) return [];
    if (collection === 'favorites') {
      return topics
        .map((topic) => {
          const favSet = favoriteLookup.get(topic.id);
          if (!favSet?.size) return null;
          const favSounds = topic.sounds.filter((sound) =>
            favSet.has(sound.id),
          );
          if (!favSounds.length) return null;
          return { ...topic, sounds: favSounds } as Topic;
        })
        .filter((entry): entry is Topic => Boolean(entry));
    }
    switch (collection) {
      case 'lol':
        return topics;
      default:
        return [];
    }
  }, [collection, favoriteLookup, topics]);

  React.useEffect(() => {
    if (!filteredTopics.length) {
      setActiveTopic('');
      return;
    }
    setActiveTopic((prev) => {
      if (prev && filteredTopics.some((topic) => topic.id === prev))
        return prev;
      return filteredTopics[0].id;
    });
  }, [filteredTopics]);

  const toggleFavorite = React.useCallback(
    (topicId: string, sound: SoundItem) => {
      setFavoriteIds((prev) => {
        const key = makeFavoriteKey(topicId, sound.id);
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [makeFavoriteKey],
  );

  const currentSounds = React.useMemo(() => {
    if (!filteredTopics.length || !activeTopic) return [];
    const t = filteredTopics.find((x) => x.id === activeTopic);
    return t?.sounds ?? [];
  }, [activeTopic, filteredTopics]);

  React.useEffect(() => {
    const targetVolume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
    playingMap.current.forEach((audio) => {
      audio.volume = targetVolume;
    });
  }, [isMuted, volume]);

  const handleSoundPress = React.useCallback(
    (sound: SoundItem) => {
      if (sound.sources?.length > 1) {
        setVariantTarget(sound);
        return;
      }
      void playSound(sound, 0);
    },
    [playSound],
  );

  const displayedSounds = React.useMemo(() => {
    if (!currentSounds.length) return currentSounds;
    if (collection === 'favorites') return currentSounds;
    if (!showFavoritesOnly || !activeTopic) return currentSounds;
    const favSet = favoriteLookup.get(activeTopic);
    if (!favSet?.size) return [];
    return currentSounds.filter((sound) => favSet.has(sound.id));
  }, [
    collection,
    currentSounds,
    showFavoritesOnly,
    favoriteLookup,
    activeTopic,
  ]);

  const deferredSounds = React.useDeferredValue(displayedSounds);
  const soundsPending = deferredSounds !== displayedSounds;
  const soundsToRender = deferredSounds;

  const emptyMessage = React.useMemo(() => {
    if (collection === 'favorites')
      return 'Du hast noch keine Favoriten gespeichert.';
    if (showFavoritesOnly) return 'Keine Favoriten in diesem Thema gefunden.';
    return 'Keine Sounds gefunden.';
  }, [collection, showFavoritesOnly]);

  React.useEffect(() => {
    if (showFavoritesOnly && favoriteIds.size === 0) {
      setShowFavoritesOnly(false);
    }
  }, [favoriteIds, showFavoritesOnly]);

  React.useEffect(() => {
    if (collection === 'favorites' && showFavoritesOnly) {
      setShowFavoritesOnly(false);
    }
  }, [collection, showFavoritesOnly]);

  return (
    <div className="container max-w-7xl px-4 py-6 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Soundboard</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Tippe auf eine Kachel, um einen Sound abzuspielen.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-56">
          <Select value={collection} onValueChange={setCollection}>
            <SelectTrigger aria-label="Sound set">
              <SelectValue placeholder="Sound set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="favorites">Favoriten</SelectItem>
              <SelectItem value="lol">League of Legends</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {topics ? (
          filteredTopics.length ? (
            <Tabs value={activeTopic} onValueChange={setActiveTopic}>
              <TabsList>
                {filteredTopics.map((topic) => (
                  <TabsTrigger key={topic.id} value={topic.id}>
                    {topic.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <div className="text-muted-foreground text-sm">
              Keine Themen verfügbar.
            </div>
          )
        ) : (
          <div className="bg-muted/60 h-8 w-64 animate-pulse rounded-md" />
        )}
      </div>

      {/* Controls */}
      <Card className="mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={onToggleMute}>
            <Volume2 className={cn('mr-2 h-4 w-4', isMuted && 'opacity-40')} />
            {isMuted ? 'Stumm' : 'Lautstärke'}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs">Leise</span>
            <div className="w-40">
              <Slider
                value={[Math.round(volume * 100)]}
                max={100}
                step={1}
                onValueChange={(v) => setVolume((v?.[0] ?? 80) / 100)}
              />
            </div>
            <span className="text-muted-foreground text-xs">Laut</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastPlayed && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Zuletzt: {lastPlayed}
            </Badge>
          )}
          {collection !== 'favorites' && (
            <Button
              variant={showFavoritesOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFavoritesOnly((value) => !value)}
              disabled={!favoriteIds.size}
            >
              {showFavoritesOnly ? 'Alle Sounds' : 'Favoriten'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={stopAll}>
            <Square className="mr-2 h-4 w-4" />
            Stoppen
          </Button>
        </div>
      </Card>

      {/* Grid of sounds */}
      <div
        className={cn(
          'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
          soundsPending && 'opacity-60',
        )}
      >
        {soundsToRender.map((sound) => {
          const isPlaying = playingMap.current.has(sound.id);
          const topicId = activeTopic;
          const isFavorite = topicId
            ? Boolean(favoriteLookup.get(topicId)?.has(sound.id))
            : false;

          return (
            <div key={sound.id} className="relative">
              <button
                type="button"
                aria-label={
                  isFavorite ? 'Favorit entfernen' : 'Als Favorit markieren'
                }
                onClick={(event) => {
                  event.stopPropagation();
                  if (!topicId) return;
                  toggleFavorite(topicId, sound);
                }}
                className="hover:bg-background/60 bg-background/40 absolute top-2 right-2 rounded-full border p-1 shadow-sm transition"
              >
                {isFavorite ? (
                  <Star className="text-primary fill-primary h-4 w-4" />
                ) : (
                  <StarOff className="text-muted-foreground h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleSoundPress(sound)}
                className={cn(
                  'hover:border-primary/40 hover:bg-accent/30 group bg-card flex h-20 w-full items-center justify-center rounded-md border p-3 text-center text-sm font-medium shadow-xs transition-all select-none active:scale-[0.98] sm:h-24',
                  isPlaying && 'border-primary bg-primary/5',
                )}
                aria-pressed={isPlaying}
              >
                <span className="flex items-center gap-2">
                  {isPlaying ? (
                    <Pause className="text-primary h-4 w-4" />
                  ) : (
                    <Play className="text-muted-foreground h-4 w-4" />
                  )}
                  <span className="line-clamp-2 text-left leading-tight">
                    {sound.label}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!variantTarget}
        onOpenChange={(open) => !open && setVariantTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version auswählen</DialogTitle>
            <DialogDescription>
              {variantTarget?.label || 'Wähle eine Version zum Abspielen.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {variantTarget?.sources?.map((source, index) => (
              <Button
                key={source}
                variant="outline"
                onClick={() => {
                  if (!variantTarget) return;
                  void playSound(variantTarget, index);
                  setVariantTarget(null);
                }}
              >
                Version {index + 1}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty/loading state */}
      {topics && soundsToRender.length === 0 && !soundsPending && (
        <div className="text-muted-foreground mt-8 text-sm">{emptyMessage}</div>
      )}
    </div>
  );
}
