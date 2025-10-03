'use client';

import { CacheControl } from '@/app/junioren/_components/cache-control';
import {
  getWarmupsFromMap,
  type WarmupItem,
  type WarmupMap,
} from '@/app/junioren/_lib/aufwaermen-data';
import { AGE_GROUPS, CATEGORIES } from '@/app/junioren/_lib/constants';
import type { TrainingSession } from '@/app/junioren/_lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Activity,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  Home,
  MapPin,
  Search,
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

// Icon mapping for categories
const ICON_MAP = {
  BookOpen,
  Target,
  Users,
  Zap,
  Shield,
  Activity,
  Trophy,
  Home,
  MapPin,
  Heart,
} as const;

function JuniorenTrainingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedWarmupGroups, setExpandedWarmupGroups] = useState<Set<string>>(
    new Set(),
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [warmupMap, setWarmupMap] = useState<WarmupMap | null>(null);
  const [warmupsLoading, setWarmupsLoading] = useState(false);
  const [warmupsError, setWarmupsError] = useState<string | null>(null);
  const isWarmupSelected = selectedCategory === 'AufwÃ¤rmen';
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Initialize age group from URL (?age=A-Junior)
  useEffect(() => {
    const age = searchParams.get('age');
    if (age && AGE_GROUPS.includes(age as TrainingSession['ageGroup'])) {
      setSelectedAgeGroup(age);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist age group to URL for easy linking/back
  useEffect(() => {
    const current = searchParams.get('age') ?? '';
    const next = selectedAgeGroup ?? '';
    if (current === next) return;
    const params = new URLSearchParams(searchParams.toString());
    if (selectedAgeGroup) params.set('age', selectedAgeGroup);
    else params.delete('age');
    router.replace(`/junioren?${params.toString()}`);
  }, [selectedAgeGroup, router, searchParams]);

  // Load training sessions from static JSON (public/junioren/training-sessions.json)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await fetch('/junioren/training-sessions.json', {
          cache: 'no-cache',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as TrainingSession[];
        if (!cancelled) setSessions(data);
      } catch (e: any) {
        if (!cancelled)
          setLoadError(e?.message || 'Konnte Trainingsdaten nicht laden');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load favorites (migrate from old keys if present)
  useEffect(() => {
    try {
      const merged = new Set<string>();
      const keys = [
        'junior-favorites',
        'a-junior-favorites',
        'b-junior-favorites',
        'c-junior-favorites',
        'd-junior-favorites',
        'e-junior-favorites',
      ];
      keys.forEach((k) => {
        const raw =
          typeof window !== 'undefined' ? localStorage.getItem(k) : null;
        if (raw) {
          try {
            const arr = JSON.parse(raw) as string[];
            arr.forEach((id) => merged.add(id));
          } catch {}
        }
      });
      setFavorites(merged);
      // Save unified key
      localStorage.setItem(
        'junior-favorites',
        JSON.stringify(Array.from(merged)),
      );
    } catch {
      // ignore
    }
  }, []);

  // Lazy-load warm-up links JSON only when AufwÃ¤rmen is selected
  useEffect(() => {
    if (!isWarmupSelected || warmupMap) return;
    let cancelled = false;
    const load = async () => {
      try {
        setWarmupsLoading(true);
        setWarmupsError(null);
        const res = await fetch('/junioren/aufwaermen-links.json', {
          cache: 'force-cache',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const map = (await res.json()) as WarmupMap;
        if (!cancelled) setWarmupMap(map);
      } catch (e: any) {
        if (!cancelled)
          setWarmupsError(e?.message || 'Konnte AufwÃ¤rmen-Links nicht laden');
      } finally {
        if (!cancelled) setWarmupsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isWarmupSelected, warmupMap]);

  // Save favorites when changed (unified key)
  useEffect(() => {
    try {
      localStorage.setItem(
        'junior-favorites',
        JSON.stringify(Array.from(favorites)),
      );
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (sessionId: string) => {
    const next = new Set(favorites);
    if (next.has(sessionId)) next.delete(sessionId);
    else next.add(sessionId);
    setFavorites(next);
  };

  // Build derived filters
  const allCategories = useMemo(() => Object.keys(CATEGORIES), []);

  const filteredAndGrouped = useMemo(() => {
    let list = sessions as TrainingSession[];

    if (selectedAgeGroup) {
      list = list.filter((s) => s.ageGroup === selectedAgeGroup);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.ageGroup.toLowerCase().includes(q),
      );
    }

    if (selectedCategory === 'Favoriten') {
      list = list.filter((s) => favorites.has(s.id));
    } else if (selectedCategory) {
      list = list.filter((s) => s.category === selectedCategory);
    }

    // De-duplicate per category by session id to avoid React key collisions
    const seen = new Set<string>();
    const deduped = list.filter((s) => {
      const key = `${s.category}::${s.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const grouped = deduped.reduce(
      (acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
      },
      {} as Record<string, TrainingSession[]>,
    );

    // Add dynamic favorites group if no specific category selected
    if (favorites.size > 0 && !selectedCategory) {
      const favs = (sessions as TrainingSession[])
        .filter((s) => !selectedAgeGroup || s.ageGroup === selectedAgeGroup)
        .filter((s) => favorites.has(s.id));
      if (favs.length > 0) grouped['Favoriten'] = favs;
    }

    return grouped;
  }, [favorites, searchTerm, selectedAgeGroup, selectedCategory, sessions]);

  const warmups: WarmupItem[] = useMemo(() => {
    if (!warmupMap) return [];
    const age =
      selectedAgeGroup &&
      AGE_GROUPS.includes(selectedAgeGroup as TrainingSession['ageGroup'])
        ? (selectedAgeGroup as TrainingSession['ageGroup'])
        : null;
    return getWarmupsFromMap(warmupMap, age, searchTerm);
  }, [warmupMap, selectedAgeGroup, searchTerm]);

  const extractBaseAndVariant = (
    title: string,
  ): { base: string; variant: string | null } => {
    // Matches optional dash/space + optional "Teil" + Roman OR number at end
    const m = title.match(/\s*[-â€“â€”]?\s*(?:Teil\s*)?([IVXLCDM]+|\d+)$/i);
    if (!m || m.index === undefined) {
      return { base: title.trim(), variant: null };
    }
    const base = title.slice(0, m.index).trim();
    const variant = m[1];
    return { base, variant };
  };

  const romanToInt = (roman: string): number => {
    const map: Record<string, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };
    let total = 0;
    let prev = 0;
    const letters = roman.toUpperCase().replace(/[^IVXLCDM]/g, '');
    for (let i = letters.length - 1; i >= 0; i--) {
      const val = map[letters[i]] ?? 0;
      if (val < prev) total -= val;
      else total += val;
      prev = val;
    }
    return total || Number.MAX_SAFE_INTEGER;
  };

  const numberToRoman = (num: number): string => {
    if (!Number.isFinite(num) || num <= 0) return String(num);
    const table: Array<[number, string]> = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    let n = Math.floor(num);
    let out = '';
    for (const [v, sym] of table) {
      while (n >= v) {
        out += sym;
        n -= v;
      }
      if (n === 0) break;
    }
    return out || String(num);
  };

  const variantOrder = (title: string): number => {
    const m = title.match(/(\b[IVXLCDM]+)$/i);
    if (m && m[1]) return romanToInt(m[1]);
    const n = title.match(/(\b\d+)$/); // unlikely, but fallback if numeric suffix
    if (n && n[1]) return parseInt(n[1], 10);
    return Number.MAX_SAFE_INTEGER - 1;
  };

  const warmupGroups = useMemo((): Record<string, WarmupItem[]> => {
    const grouped: Record<string, WarmupItem[]> = {};
    for (const w of warmups) {
      const { base } = extractBaseAndVariant(w.title);
      const key = base || w.title;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(w);
    }
    // sort items within each group by variant (roman or number)
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => variantOrder(a.title) - variantOrder(b.title)),
    );
    return grouped;
  }, [warmups]);

  const toggleWarmupGroup = (key: string): void => {
    const next = new Set(expandedWarmupGroups);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setExpandedWarmupGroups(next);
  };

  const toggleCategory = (category: string) => {
    const next = new Set(expandedCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    setExpandedCategories(next);
  };

  const openHtmlFile = (htmlPath: string) => {
    if (htmlPath && htmlPath !== 'null') {
      window.open(htmlPath, '_blank');
    } else {
      console.warn('HTML file not available for this training session');
    }
  };

  const openPdfFile = (pdfPath: string) => {
    if (pdfPath && pdfPath !== 'null') {
      window.open(pdfPath, '_blank');
    } else {
      console.warn('PDF file not available for this training session');
    }
  };

  const totalCount = useMemo(
    () =>
      Object.values(filteredAndGrouped).reduce((n, arr) => n + arr.length, 0),
    [filteredAndGrouped],
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Junioren Training
        </h1>
        <p className="text-muted-foreground text-lg">
          Trainingssammlung fÃ¼r Aâ€“E Junioren
          {!isWarmupSelected && totalCount > 0
            ? ` â€” ${totalCount} Einheiten`
            : ''}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Suche und Filter
          </CardTitle>
          <CardDescription>
            Nach Altersklasse, Kategorie und Titel filtern
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Trainingseinheiten durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Age group filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground self-center text-sm font-medium">
              Altersklasse:
            </span>
            <Button
              variant={selectedAgeGroup === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAgeGroup(null)}
            >
              Alle
            </Button>
            {AGE_GROUPS.map((age) => (
              <Button
                key={age}
                variant={selectedAgeGroup === age ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAgeGroup(age)}
              >
                {age}
              </Button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground self-center text-sm font-medium">
              Kategorie:
            </span>
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Alle
            </Button>
            {favorites.size > 0 && (
              <Button
                variant={
                  selectedCategory === 'Favoriten' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => setSelectedCategory('Favoriten')}
                className="flex items-center gap-1"
              >
                <Heart className="h-3 w-3" />
                Favoriten ({favorites.size})
              </Button>
            )}
            {allCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cache Control Component */}
      <div className="mb-6">
        <CacheControl
          selectedAgeGroup={selectedAgeGroup}
          allSessions={sessions}
        />
      </div>

      {/* Content area: AufwÃ¤rmen special list or grouped sessions */}
      {isWarmupSelected ? (
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">AufwÃ¤rmen</CardTitle>
                <CardDescription>
                  {warmups.length} AufwÃ¤rm-Link
                  {warmups.length !== 1 ? 's' : ''}
                  {selectedAgeGroup ? ` â€” ${selectedAgeGroup}` : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {warmupsLoading && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  Lade AufwÃ¤rmen-Linksâ€¦
                </div>
              )}
              {warmupsError && !warmupsLoading && (
                <div className="py-6 text-center text-sm text-red-600">
                  {warmupsError}
                </div>
              )}
              {Object.entries(warmupGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([groupTitle, items]) => {
                  const isGroup = items.length > 1;
                  if (!isGroup) {
                    const item = items[0]!;
                    return (
                      <div
                        key={item.url}
                        className="bg-card hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground text-xs">
                            {item.group}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => window.open(item.url, '_blank')}
                          title="Ã–ffnen"
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Ã–ffnen
                        </Button>
                      </div>
                    );
                  }
                  const open = expandedWarmupGroups.has(groupTitle);
                  return (
                    <Collapsible
                      key={groupTitle}
                      open={open}
                      onOpenChange={() => toggleWarmupGroup(groupTitle)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="bg-card hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{groupTitle}</span>
                          </div>
                          {open ? (
                            <ChevronDown className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <ChevronRight className="text-muted-foreground h-4 w-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 space-y-2 pl-4">
                          {items.map((item) => {
                            const m = item.title.match(
                              /\s*[-â€“â€”]?\s*(?:Teil\s*)?([IVXLCDM]+|\d+)$/i,
                            );
                            let suffix = m && m[1] ? m[1] : '';
                            if (suffix && /^\d+$/.test(suffix)) {
                              suffix = numberToRoman(parseInt(suffix, 10));
                            }
                            const label = suffix
                              ? `${groupTitle} ${suffix}`
                              : item.title;
                            return (
                              <div
                                key={item.url}
                                className="bg-card hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{label}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {item.group}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() =>
                                    window.open(item.url, '_blank')
                                  }
                                  title="Ã–ffnen"
                                >
                                  <ExternalLink className="mr-1 h-3 w-3" />
                                  Ã–ffnen
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              {warmups.length === 0 && !warmupsLoading && !warmupsError && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  Keine AufwÃ¤rmen-Links gefunden.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredAndGrouped).map(([category, sessions]) => {
            const categoryInfo =
              category === 'Favoriten'
                ? {
                    icon: 'Heart',
                    color:
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                  }
                : CATEGORIES[category as keyof typeof CATEGORIES] ||
                  CATEGORIES.Allgemein;

            const Icon =
              category === 'Favoriten'
                ? Heart
                : ICON_MAP[categoryInfo.icon as keyof typeof ICON_MAP] ||
                  BookOpen;
            const isExpanded = expandedCategories.has(category);

            return (
              <Card key={category} className="overflow-hidden">
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="text-muted-foreground h-5 w-5" />
                          <div>
                            <CardTitle className="text-lg">
                              {category}
                            </CardTitle>
                            <CardDescription>
                              {sessions.length} Trainingseinheit
                              {sessions.length !== 1 ? 'en' : ''}
                            </CardDescription>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <ChevronRight className="text-muted-foreground h-4 w-4" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {sessions.map((session) => (
                          <div
                            key={`${session.id}:${session.pdfPath}`}
                            className="bg-card hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center gap-1">
                                <FileText className="text-muted-foreground h-4 w-4" />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleFavorite(session.id)}
                                  className={cn(
                                    'h-6 w-6 p-0',
                                    favorites.has(session.id)
                                      ? 'text-red-500 hover:text-red-600'
                                      : 'text-muted-foreground hover:text-red-500',
                                  )}
                                  title={
                                    favorites.has(session.id)
                                      ? 'Aus Favoriten entfernen'
                                      : 'Zu Favoriten hinzufÃ¼gen'
                                  }
                                >
                                  <Heart
                                    className={cn(
                                      'h-3 w-3',
                                      favorites.has(session.id) &&
                                        'fill-current',
                                    )}
                                  />
                                </Button>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {session.title}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {session.ageGroup}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openHtmlFile(session.htmlPath)}
                                className="h-8"
                                title="Open HTML training session"
                              >
                                <ExternalLink className="mr-1 h-3 w-3" />
                                HTML
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openPdfFile(session.pdfPath)}
                                className="h-8"
                                title="Download PDF training session"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      {(isLoading ||
        loadError ||
        Object.keys(filteredAndGrouped).length === 0) && (
        <Card>
          <CardContent className="py-8 text-center">
            {isLoading ? (
              <>
                <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12 animate-pulse" />
                <h3 className="mb-2 text-lg font-semibold">
                  Lade Trainingsdatenâ€¦
                </h3>
              </>
            ) : loadError ? (
              <>
                <Search className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold">
                  Fehler beim Laden
                </h3>
                <p className="text-muted-foreground">{loadError}</p>
              </>
            ) : (
              <>
                <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  Keine Trainingseinheiten gefunden
                </h3>
                <p className="text-muted-foreground">
                  Versuchen Sie andere Suchbegriffe oder entfernen Sie die
                  Filter.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function JuniorenTrainingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Trainingseinheiten
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Lade Inhalte...
            </p>
          </div>
        </div>
      }
    >
      <JuniorenTrainingPageContent />
    </Suspense>
  );
}
