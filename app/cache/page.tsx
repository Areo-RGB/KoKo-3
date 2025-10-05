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
  Download,
  HardDrive,
  Loader2,
  Trash2,
  Video,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import video data from different pages
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

// All app pages that should be precached
const APP_PAGES = [
  '/',
  '/cache/',
  '/offline/',
  '/dashboard/',
  '/fifa-11-plus/',
  '/video-player/',
  '/junioren/',
  '/interval-timer/',
  '/muscle-diagram/',
  '/ranking/',
  '/soundboard/',
  '/yo-yo/',
  '/data-combined/',
  '/performance-charts/',
  '/hertha-03-iv/',
];

export default function CachePage() {
  const {
    cacheStatus,
    cacheVideos,
    clearVideoCache,
    getCacheInfo,
    formatBytes,
    isVideoCached,
  } = useVideoCache();

  const [cacheInfo, setCacheInfo] = useState({ size: 0, count: 0 });
  const [isOnline, setIsOnline] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [pages, setPages] = useState<PageCacheInfo[]>([]);
  const [isCachingAll, setIsCachingAll] = useState(false);
  const [isCachingPages, setIsCachingPages] = useState(false);
  const [cachedPagesCount, setCachedPagesCount] = useState(0);
  const [pagesCacheProgress, setPagesCacheProgress] = useState(0);

  // Initialize page data
  useEffect(() => {
    const initializePages = () => {
      // FIFA 11+ Original
      const fifa11Original = PLAYLIST.videos
        .filter((v) => !v.isHeader)
        .map((v) => `${MAIN_VIDEO_URL}#t=${v.startTime || 0}`);

      // FIFA 11+ World Soccer
      const fifa11WS = WS_PLAYLIST.videos
        .filter((v) => !v.isHeader)
        .map((v) => `${WS_VIDEO_URL}#t=${v.startTime || 0}`);

      // Video Player - extract all video URLs
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
      checkCachedVideos(pagesData);
    };

    initializePages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCacheInfo();
    checkCachedPages();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCacheInfo = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
  };

  const checkCachedPages = async () => {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open('pages-cache-v1');
      const keys = await cache.keys();
      const cachedUrls = keys.map((req) => new URL(req.url).pathname);

      let count = 0;
      for (const page of APP_PAGES) {
        const isPageCached = cachedUrls.some((url) => url === page);
        if (isPageCached) count++;
      }

      setCachedPagesCount(count);
      setPagesCacheProgress((count / APP_PAGES.length) * 100);
    } catch (error) {
      console.error('Failed to check cached pages:', error);
    }
  };

  const cacheAllAppPages = async () => {
    setIsCachingPages(true);
    let successCount = 0;

    for (let i = 0; i < APP_PAGES.length; i++) {
      const page = APP_PAGES[i];
      try {
        // Fetch the page to trigger caching
        const response = await fetch(page);
        if (response.ok) {
          // Manually cache it in pages-cache-v1
          const cache = await caches.open('pages-cache-v1');
          await cache.put(page, response);
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to cache page ${page}:`, error);
      }

      setCachedPagesCount(successCount);
      setPagesCacheProgress(((i + 1) / APP_PAGES.length) * 100);

      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsCachingPages(false);
    await checkCachedPages();
  };

  const checkCachedVideos = async (pagesData: PageCacheInfo[]) => {
    const updatedPages = await Promise.all(
      pagesData.map(async (page) => {
        let cachedCount = 0;
        for (const url of page.videoUrls) {
          const isCached = await isVideoCached(url);
          if (isCached) cachedCount++;
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

  const cachePage = async (pageId: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, isCaching: true } : p)),
    );

    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    let processedCount = 0;
    for (const url of page.videoUrls) {
      const isCached = await isVideoCached(url);
      if (!isCached) {
        await cacheVideos([url]);
      }
      processedCount++;

      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId
            ? {
                ...p,
                cachedCount: processedCount,
                progress: (processedCount / p.videoCount) * 100,
              }
            : p,
        ),
      );
    }

    await loadCacheInfo();
    // After caching, get the latest pages state and run a final check to update counts
    setPages((currentPages) => {
      const pagesToUpdate = currentPages.map((p) =>
        p.id === pageId ? { ...p, isCaching: false } : p,
      );
      checkCachedVideos(pagesToUpdate);
      return pagesToUpdate;
    });
  };

  const cacheAllPages = async () => {
    setIsCachingAll(true);

    for (const page of pages) {
      await cachePage(page.id);
    }

    setIsCachingAll(false);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    await clearVideoCache();
    await loadCacheInfo();
    await checkCachedVideos(pages);
    setIsClearing(false);
  };

  const totalVideos = pages.reduce((sum, page) => sum + page.videoCount, 0);
  const totalCached = pages.reduce((sum, page) => sum + page.cachedCount, 0);
  const overallProgress =
    totalVideos > 0 ? (totalCached / totalVideos) * 100 : 0;

  const storageUsagePercent =
    cacheStatus.estimate?.usagePercent?.toFixed(1) || 0;
  const quota = cacheStatus.estimate?.quota || 0;
  const usage = cacheStatus.estimate?.usage || 0;

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Video Cache Manager</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Offline-Videos für schnelleren Zugriff
            </p>
          </div>
          {isOnline ? (
            <Wifi className="size-6 text-green-500" />
          ) : (
            <WifiOff className="size-6 text-orange-500" />
          )}
        </div>
      </div>

      {/* Overall Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gesamtübersicht</CardTitle>
          <CardDescription>Status aller verfügbaren Videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Storage Usage */}
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

          {/* Cache Info */}
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

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Gesamt-Fortschritt</span>
              <span className="font-mono">{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={cacheAllPages}
              disabled={isCachingAll || !isOnline}
              className="flex-1"
              variant="default"
            >
              {isCachingAll ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Caching...
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

      {/* HTML Pages Cache Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="size-5" />
            App-Seiten Cache
          </CardTitle>
          <CardDescription>
            Alle Seiten für Offline-Nutzung vorcachen (ohne jede Seite zu
            besuchen)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pages Cache Info */}
          <div className="bg-muted grid grid-cols-2 gap-4 rounded-lg p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Seiten gesamt</p>
              <p className="text-2xl font-bold">{APP_PAGES.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Gecacht</p>
              <p className="text-2xl font-bold">{cachedPagesCount}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Seiten-Cache Fortschritt</span>
              <span className="font-mono">
                {pagesCacheProgress.toFixed(1)}%
              </span>
            </div>
            <Progress value={pagesCacheProgress} />
          </div>

          {/* Cache All Pages Button */}
          <Button
            onClick={cacheAllAppPages}
            disabled={isCachingPages || !isOnline}
            className="w-full"
            variant={
              cachedPagesCount === APP_PAGES.length ? 'outline' : 'default'
            }
          >
            {isCachingPages ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Caching Seiten... ({cachedPagesCount}/{APP_PAGES.length})
              </>
            ) : cachedPagesCount === APP_PAGES.length ? (
              <>
                <Download className="mr-2 size-4" />
                Alle Seiten gecacht
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Alle {APP_PAGES.length} App-Seiten cachen
              </>
            )}
          </Button>

          {/* Page List */}
          <details className="text-sm">
            <summary className="text-muted-foreground hover:text-foreground cursor-pointer">
              Seiten-Liste anzeigen ({APP_PAGES.length} Seiten)
            </summary>
            <div className="bg-muted mt-2 max-h-48 overflow-y-auto rounded-lg p-3">
              <ul className="space-y-1">
                {APP_PAGES.map((page) => (
                  <li key={page} className="font-mono text-xs">
                    {page}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Individual Pages */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nach Seite herunterladen</h2>

        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {page.name}
                    <Badge variant="secondary">{page.videoCount} Videos</Badge>
                  </CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {page.cachedCount} / {page.videoCount} Videos gecacht
                  </span>
                  <span className="font-mono">{page.progress.toFixed(1)}%</span>
                </div>
                <Progress value={page.progress} />
              </div>

              {/* Action Button */}
              <Button
                onClick={() => cachePage(page.id)}
                disabled={
                  page.isCaching ||
                  !isOnline ||
                  page.cachedCount === page.videoCount
                }
                className="w-full"
                variant={
                  page.cachedCount === page.videoCount ? 'outline' : 'default'
                }
              >
                {page.isCaching ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Caching... ({page.cachedCount}/{page.videoCount})
                  </>
                ) : page.cachedCount === page.videoCount ? (
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
        ))}
      </div>

      {/* Offline Notice */}
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

      {/* Service Worker Warning */}
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
    </div>
  );
}
