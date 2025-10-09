'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useVideoCache } from '@/hooks/use-video-cache';
import {
  AlertTriangle,
  Bug,
  Download,
  HardDrive,
  Loader2,
  StopCircle,
  Trash2,
  Video,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  MAIN_VIDEO_URL,
  PLAYLIST,
  WS_PLAYLIST,
  WS_VIDEO_URL,
} from '@/app/fifa-11-plus/_lib/data';
import { hierarchicalVideoData } from '@/app/video-player/_lib/video-data';

interface PageCacheInfo {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  videoUrls: string[];
  isCaching: boolean;
  cachedCount: number;
  progress: number;
}

const STATUS_LABEL: Record<string, string> = {
  idle: 'Bereit',
  running: 'Aktiver Download',
  completed: 'Abgeschlossen',
  error: 'Fehlgeschlagen',
  aborted: 'Abgebrochen',
};

const STATUS_BADGE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  idle: 'outline',
  running: 'default',
  completed: 'secondary',
  error: 'destructive',
  aborted: 'destructive',
};

export default function CachePage() {
  const {
    cacheStatus,
    cacheVideos,
    clearVideoCache,
    getCacheInfo,
    formatBytes,
    isVideoCached,
    checkQuotaBeforeCaching,
    cacheProgress,
    cancelActiveTask,
    swEvents,
  } = useVideoCache();

  const [cacheInfo, setCacheInfo] = useState({ size: 0, count: 0 });
  const [isOnline, setIsOnline] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [pages, setPages] = useState<PageCacheInfo[]>([]);
  const [isCachingAll, setIsCachingAll] = useState(false);
  const [fifaPreloadUrls, setFifaPreloadUrls] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const pagesRef = useRef<PageCacheInfo[]>([]);

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    const initializePages = () => {
      const fifa11Original = PLAYLIST.videos
        .filter((v) => !v.isHeader)
        .map((v) => `${MAIN_VIDEO_URL}#t=${v.startTime || 0}`);

      const fifa11WS = WS_PLAYLIST.videos
        .filter((v) => !v.isHeader)
        .map((v) => `${WS_VIDEO_URL}#t=${v.startTime || 0}`);

      const videoPlayerUrls = hierarchicalVideoData.categories.flatMap((cat) =>
        cat.subcategories.flatMap((sub) =>
          sub.videos.flatMap((vid) =>
            [vid.videoUrl, ...vid.chapters.map((c) => c.videoUrl)].filter(
              (url): url is string => !!url,
            ),
          ),
        ),
      );

      const pagesData: PageCacheInfo[] = [
        {
          id: 'fifa-11-plus-original',
          name: 'FIFA 11+ Original',
          description: 'Das komplette FIFA 11+ Verletzungspräventionsprogramm',
          videoCount: fifa11Original.length,
          videoUrls: fifa11Original,
          isCaching: false,
          cachedCount: 0,
          progress: 0,
        },
        {
          id: 'fifa-11-plus-ws',
          name: 'FIFA 11+ World Soccer',
          description: 'FIFA 11+ World Soccer Variante',
          videoCount: fifa11WS.length,
          videoUrls: fifa11WS,
          isCaching: false,
          cachedCount: 0,
          progress: 0,
        },
        {
          id: 'video-player',
          name: 'Trainingsvideos',
          description: 'Alle Fußball-Trainingsvideos',
          videoCount: videoPlayerUrls.length,
          videoUrls: videoPlayerUrls,
          isCaching: false,
          cachedCount: 0,
          progress: 0,
        },
      ];

      setPages(pagesData);
      setFifaPreloadUrls(Array.from(new Set([...fifa11Original, ...fifa11WS])));
      checkCachedVideos(pagesData);
    };

    initializePages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCacheInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (
      cacheProgress.status === 'completed' ||
      cacheProgress.status === 'error' ||
      cacheProgress.status === 'aborted'
    ) {
      loadCacheInfo();
      checkCachedVideos(pagesRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheProgress.status]);

  const loadCacheInfo = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
  };

  const checkCachedVideos = async (pagesData: PageCacheInfo[]) => {
    const updatedPages = await Promise.all(
      pagesData.map(async (page) => {
        let cachedCount = 0;
        for (const url of page.videoUrls) {
          const cached = await isVideoCached(url);
          if (cached) cachedCount++;
        }

        return {
          ...page,
          cachedCount,
          progress:
            page.videoCount > 0 ? (cachedCount / page.videoCount) * 100 : 0,
        };
      }),
    );
    setPages(updatedPages);
  };

  const confirmQuotaIfNeeded = async (urls: string[]) => {
    const quotaCheck = await checkQuotaBeforeCaching(urls);

    if (quotaCheck.hasSpace) {
      return true;
    }

    const requiredMB = quotaCheck.required
      ? (quotaCheck.required / 1024 / 1024).toFixed(0)
      : '?';
    const availableMB = quotaCheck.available
      ? (quotaCheck.available / 1024 / 1024).toFixed(0)
      : '?';

    let message =
      `⚠️ Warnung: Möglicherweise nicht genug Speicherplatz!\n\n` +
      `Benötigt: ~${requiredMB} MB\n` +
      `Verfügbar: ${availableMB} MB\n` +
      `Quota-Auslastung: ${quotaCheck.quotaPercent.toFixed(1)}%`;

    if (quotaCheck.unknownUrls.length > 0) {
      message += `\n\nFür ${quotaCheck.unknownUrls.length} Videos konnte die Größe nicht ermittelt werden.`;
    }

    message += `\n\nTrotzdem fortfahren? Cache könnte unvollständig sein.`;

    return window.confirm(message);
  };

  const cachePage = async (pageId: string) => {
    const target = pages.find((p) => p.id === pageId);
    if (!target) return;

    const proceed = await confirmQuotaIfNeeded(target.videoUrls);
    if (!proceed) {
      return;
    }

    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, isCaching: true } : p)),
    );

    try {
      await cacheVideos(target.videoUrls, { label: target.name });
    } finally {
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, isCaching: false } : p)),
      );
      await loadCacheInfo();
      await checkCachedVideos(pagesRef.current);
    }
  };

  const cacheAllPages = async () => {
    const snapshot = pagesRef.current;
    const allUrls = snapshot.flatMap((p) => p.videoUrls);

    const proceed = await confirmQuotaIfNeeded(allUrls);
    if (!proceed) return;

    setIsCachingAll(true);

    for (const page of snapshot) {
      await cachePage(page.id);
    }

    setIsCachingAll(false);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    await clearVideoCache();
    await loadCacheInfo();
    await checkCachedVideos(pagesRef.current);
    setIsClearing(false);
  };

  const handlePreloadFifa = async () => {
    if (!fifaPreloadUrls.length) return;
    const proceed = await confirmQuotaIfNeeded(fifaPreloadUrls);
    if (!proceed) return;
    await cacheVideos(fifaPreloadUrls, { label: 'FIFA 11+ Vorladen' });
    await loadCacheInfo();
    await checkCachedVideos(pagesRef.current);
  };

  const totalVideos = useMemo(
    () => pages.reduce((sum, page) => sum + page.videoCount, 0),
    [pages],
  );
  const totalCached = useMemo(
    () => pages.reduce((sum, page) => sum + page.cachedCount, 0),
    [pages],
  );

  const overallProgress =
    totalVideos > 0 ? (totalCached / totalVideos) * 100 : 0;

  const storageUsagePercent =
    cacheStatus.estimate?.usagePercent?.toFixed(1) || 0;
  const quota = cacheStatus.estimate?.quota || 0;
  const usage = cacheStatus.estimate?.usage || 0;

  const isTaskRunning = cacheProgress.status === 'running';
  const activeTaskPercent =
    cacheProgress.total > 0
      ? Math.min(100, (cacheProgress.completed / cacheProgress.total) * 100)
      : 0;

  if (!cacheStatus.isSupported) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="size-5" />
              Video Cache
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Ihr Browser unterstützt kein Offline-Caching. Bitte verwenden Sie
              einen modernen Browser.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Video Cache Manager</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Offline-Videos für schnelleren Zugriff
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDebug((prev) => !prev)}
            title="Service-Worker-Debug anzeigen"
          >
            <Bug className="size-5" />
          </Button>
          {isOnline ? (
            <Wifi className="size-6 text-green-500" />
          ) : (
            <WifiOff className="size-6 text-orange-500" />
          )}
        </div>
      </div>

      {cacheProgress.status !== 'idle' && (
        <Card className="border-primary/40 bg-primary/5 mb-6">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                {cacheProgress.label || 'Aktiver Download'}
                <Badge variant={STATUS_BADGE_VARIANT[cacheProgress.status]}>
                  {STATUS_LABEL[cacheProgress.status]}
                </Badge>
              </CardTitle>
              <CardDescription>
                {cacheProgress.status === 'running'
                  ? `${cacheProgress.completed}/${cacheProgress.total} Videos`
                  : cacheProgress.status === 'completed'
                    ? 'Alle angeforderten Videos sind verfügbar.'
                    : cacheProgress.status === 'aborted'
                      ? 'Download wurde abgebrochen.'
                      : cacheProgress.message || 'Es trat ein Fehler auf.'}
              </CardDescription>
            </div>
            {cacheProgress.status === 'running' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => cancelActiveTask()}
              >
                <StopCircle className="mr-2 size-4" />
                Abbrechen
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={activeTaskPercent} />
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
              <span>
                Insgesamt: {cacheProgress.total} · Erfolgreich:{' '}
                {cacheProgress.completed} · Fehler: {cacheProgress.failed}
              </span>
              {cacheProgress.currentUrl && (
                <span className="max-w-[60%] truncate">
                  {cacheProgress.currentUrl}
                </span>
              )}
            </div>
            {cacheProgress.error && (
              <div className="text-destructive flex items-center gap-2 text-sm">
                <AlertTriangle className="size-4" />
                {cacheProgress.error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gesamtübersicht</CardTitle>
          <CardDescription>Status aller verfügbaren Videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="size-4" />
                Speichernutzung
              </span>
              <span className="text-muted-foreground font-mono">
                {formatBytes(usage)} / {formatBytes(quota)} (
                {storageUsagePercent}%)
              </span>
            </div>
            <Progress value={Number(storageUsagePercent)} />
          </div>

          <div className="bg-muted grid grid-cols-3 gap-4 rounded-lg p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Verfügbar</p>
              <p className="text-2xl font-bold">{totalVideos}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Gecacht</p>
              <p className="text-2xl font-bold">{totalCached}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Größe</p>
              <p className="text-2xl font-bold">
                {formatBytes(cacheInfo.size)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Gesamt-Fortschritt</span>
              <span className="font-mono">{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handlePreloadFifa}
              disabled={
                !isOnline ||
                !fifaPreloadUrls.length ||
                isTaskRunning ||
                cacheProgress.status === 'running'
              }
              variant="secondary"
              className="flex-1"
            >
              <Download className="mr-2 size-4" />
              FIFA 11+ vorladen
            </Button>
            <Button
              onClick={cacheAllPages}
              disabled={
                isCachingAll ||
                !isOnline ||
                isTaskRunning ||
                cacheProgress.status === 'running'
              }
              className="flex-1"
              variant="default"
            >
              {isCachingAll ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Lädt...
                </>
              ) : (
                <>
                  <Download className="mr-2 size-4" />
                  Alle Videos herunterladen
                </>
              )}
            </Button>
            <Button
              onClick={handleClearCache}
              disabled={isClearing || cacheInfo.count === 0}
              variant="outline"
              className="flex-1"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Löschen...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Cache leeren
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nach Seite herunterladen</h2>

        {pages.map((page) => {
          const isActiveTask =
            isTaskRunning && cacheProgress.label === page.name;
          const displayedProgress = isActiveTask
            ? activeTaskPercent
            : page.progress;
          const displayedCount = isActiveTask
            ? Math.min(cacheProgress.completed, page.videoCount)
            : page.cachedCount;
          const disableButton =
            !isOnline ||
            isTaskRunning ||
            page.isCaching ||
            displayedCount === page.videoCount;

          return (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {page.name}
                      <Badge variant="secondary">
                        {page.videoCount} Videos
                      </Badge>
                    </CardTitle>
                    <CardDescription>{page.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {displayedCount} / {page.videoCount} Videos gecacht
                    </span>
                    <span className="font-mono">
                      {displayedProgress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={displayedProgress} />
                </div>

                <Button
                  onClick={() => cachePage(page.id)}
                  disabled={disableButton}
                  className="w-full"
                  variant={
                    displayedCount === page.videoCount ? 'outline' : 'default'
                  }
                >
                  {page.isCaching || isActiveTask ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Lädt... ({displayedCount}/{page.videoCount})
                    </>
                  ) : displayedCount === page.videoCount ? (
                    <>
                      <Download className="mr-2 size-4" />
                      Vollständig gecacht
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 size-4" />
                      Videos herunterladen
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isOnline && (
        <Card className="mt-6 border-orange-500/50 bg-orange-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <WifiOff className="size-4" />
              Sie sind offline. Videos können nur im Online-Modus
              heruntergeladen werden.
            </div>
          </CardContent>
        </Card>
      )}

      {!cacheStatus.isRegistered && (
        <Card className="mt-6 border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Service Worker nicht registriert. Video-Caching funktioniert
              möglicherweise nicht ordnungsgemäß.
            </div>
          </CardContent>
        </Card>
      )}

      {showDebug && (
        <div className="fixed right-4 bottom-4 z-40 w-[360px] max-w-[calc(100%-2rem)]">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">
                Service Worker Debug
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebug(false)}
              >
                Schließen
              </Button>
            </CardHeader>
            <CardContent className="max-h-64 space-y-3 overflow-y-auto text-xs">
              {swEvents.length === 0 && (
                <p className="text-muted-foreground">
                  Noch keine Ereignisse empfangen.
                </p>
              )}
              {swEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-border/60 bg-muted/40 rounded border px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{event.eventName}</span>
                    <span className="text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.detail && (
                    <pre className="text-muted-foreground mt-2 font-mono text-[11px] break-words whitespace-pre-wrap">
                      {JSON.stringify(event.detail, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
