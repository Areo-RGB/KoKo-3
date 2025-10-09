'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  HardDrive,
  Loader2,
  RefreshCw,
  Trash2,
  Video,
  XCircle,
} from 'lucide-react';
import { useMemo } from 'react';

import {
  MAIN_VIDEO_URL,
  PLAYLIST,
  WS_PLAYLIST,
  WS_VIDEO_URL,
} from '@/app/fifa-11-plus/_lib/data';
import { hierarchicalVideoData } from '@/app/video-player/_lib/video-data';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useBulkVideoDownload } from '@/hooks/use-bulk-video-download';
import { useVideoCache } from '@/hooks/use-video-cache';

const openChromeSettings = () => {
  if (typeof window !== 'undefined') {
    const siteUrl = encodeURIComponent(window.location.origin);
    window.open(
      `chrome://settings/content/siteDetails?site=${siteUrl}`,
      '_blank',
    );
  }
};

const collectVideoUrls = (): string[] => {
  const urls = new Set<string>();

  PLAYLIST.videos.forEach((video) => {
    if (!video.isHeader) {
      urls.add(MAIN_VIDEO_URL);
    }
  });

  WS_PLAYLIST.videos.forEach((video) => {
    if (!video.isHeader) {
      urls.add(WS_VIDEO_URL);
    }
  });

  hierarchicalVideoData.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.videos.forEach((video) => {
        if (video.videoUrl) {
          urls.add(video.videoUrl);
        }
        video.chapters.forEach((chapter) => {
          if (chapter.videoUrl) {
            urls.add(chapter.videoUrl);
          }
        });
      });
    });
  });

  hierarchicalVideoData.legacyVideos.forEach((video) => {
    if (video.videoUrl) {
      urls.add(video.videoUrl);
    }
    video.chapters.forEach((chapter) => {
      if (chapter.videoUrl) {
        urls.add(chapter.videoUrl);
      }
    });
  });

  return Array.from(urls);
};

export default function CachePage() {
  const {
    isSupported,
    summary,
    mediaCache,
    storageSnapshot,
    clearVideoCache,
    requestSummary,
    formatBytes,
  } = useVideoCache();

  const {
    progress: downloadProgress,
    startBulkDownload,
    cancelDownload,
  } = useBulkVideoDownload();

  const allVideoUrls = useMemo(() => collectVideoUrls(), []);

  const storageQuota = storageSnapshot?.quota ?? 0;
  const storageUsage = storageSnapshot?.usage ?? 0;
  const storagePercent = storageQuota
    ? Math.min((storageUsage / storageQuota) * 100, 100)
    : 0;

  const mediaEntries = mediaCache?.entryCount ?? 0;
  const mediaSize = mediaCache?.totalBytes ?? null;
  const cachePercent =
    allVideoUrls.length > 0
      ? Math.round((mediaEntries / allVideoUrls.length) * 100)
      : 0;

  const handleClear = () => {
    if (
      confirm(
        'Alle gecachten Videos löschen? Sie müssen erneut abgespielt werden, um offline verfügbar zu sein.',
      )
    ) {
      clearVideoCache();
    }
  };

  const handleBulkDownload = async () => {
    if (
      confirm(
        `${allVideoUrls.length} Videos für Offline-Nutzung herunterladen? Dies kann einige Zeit dauern und benötigt Speicherplatz.`,
      )
    ) {
      await startBulkDownload(allVideoUrls);
      // Refresh cache summary after download completes
      setTimeout(() => requestSummary(), 1000);
    }
  };

  const progressPercent =
    downloadProgress.total > 0
      ? Math.round((downloadProgress.completed / downloadProgress.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Offline-Speicher</h1>
        <p className="text-muted-foreground">
          Videos werden automatisch beim Abspielen gecacht und sind dann offline
          verfügbar.
        </p>
      </div>

      {!isSupported ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="text-destructive h-6 w-6" />
            <div>
              <CardTitle>Offline-Funktion nicht verfügbar</CardTitle>
              <CardDescription>
                Dieser Browser unterstützt keine Service Worker oder Cache
                Storage. Offline-Modus steht daher nicht zur Verfügung.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Storage Overview */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" /> Speicherübersicht
                </CardTitle>
                <CardDescription>
                  Gesamter Browser-Speicher für diese App.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Belegung</span>
                    <span>
                      {formatBytes(storageUsage)} / {formatBytes(storageQuota)}
                    </span>
                  </div>
                  <Progress value={storagePercent} className="mt-2" />
                  <p className="text-muted-foreground mt-2 text-xs">
                    {storagePercent.toFixed(1)}% verwendet
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => requestSummary()}
                  >
                    <RefreshCw className="h-4 w-4" /> Aktualisieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={openChromeSettings}
                    title="Chrome-Einstellungen öffnen"
                  >
                    <ExternalLink className="h-4 w-4" /> Einstellungen
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Cache */}
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" /> Video-Cache
                </CardTitle>
                <CardDescription>
                  Automatisch gecachte Videos beim Abspielen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Verfügbare Videos
                    </span>
                    <span className="text-sm font-medium">
                      {allVideoUrls.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Gecacht
                    </span>
                    <span className="text-sm font-medium">{mediaEntries}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Cache-Größe
                    </span>
                    <span className="text-sm font-medium">
                      {mediaSize != null ? formatBytes(mediaSize) : '–'}
                    </span>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                      <span>Fortschritt</span>
                      <span>{cachePercent}%</span>
                    </div>
                    <Progress value={cachePercent} />
                  </div>
                </div>

                {downloadProgress.isDownloading && (
                  <div className="bg-muted/50 space-y-2 rounded-md border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Download läuft...</span>
                      <span className="text-muted-foreground">
                        {downloadProgress.completed} / {downloadProgress.total}
                      </span>
                    </div>
                    {downloadProgress.currentUrl && (
                      <p className="text-muted-foreground truncate text-xs">
                        {downloadProgress.currentUrl.split('/').pop()}
                      </p>
                    )}
                    <Progress value={progressPercent} />
                    {downloadProgress.bytesDownloaded > 0 && (
                      <p className="text-muted-foreground text-xs">
                        {formatBytes(downloadProgress.bytesDownloaded)}{' '}
                        heruntergeladen
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1 gap-2"
                    onClick={handleBulkDownload}
                    disabled={
                      downloadProgress.isDownloading ||
                      allVideoUrls.length === 0
                    }
                  >
                    {downloadProgress.isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Lädt... ({downloadProgress.completed}/
                        {downloadProgress.total})
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Alle herunterladen ({allVideoUrls.length})
                      </>
                    )}
                  </Button>
                  {downloadProgress.isDownloading && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={cancelDownload}
                      title="Download abbrechen"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleClear}
                  disabled={
                    mediaEntries === 0 || downloadProgress.isDownloading
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Cache leeren ({mediaEntries})
                </Button>

                {downloadProgress.errors.length > 0 && (
                  <div className="border-destructive/40 bg-destructive/10 rounded-md border p-3">
                    <p className="text-destructive mb-1 text-xs font-medium">
                      ⚠️ {downloadProgress.errors.length} Fehler
                    </p>
                    <p className="text-destructive/90 text-xs">
                      Einige Videos konnten nicht heruntergeladen werden.
                    </p>
                  </div>
                )}

                {!downloadProgress.isDownloading && (
                  <>
                    {mediaEntries > 0 ? (
                      <div className="flex items-start gap-2 rounded-md border border-green-500/40 bg-green-50 p-3 text-sm dark:bg-green-950/20">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                        <span className="text-green-900 dark:text-green-100">
                          {mediaEntries} von {allVideoUrls.length} Videos
                          offline verfügbar
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 rounded-md border border-yellow-500/40 bg-yellow-50 p-3 text-sm dark:bg-yellow-950/20">
                        <Download className="mt-0.5 h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-900 dark:text-yellow-100">
                          Keine Videos im Cache. Nutzen Sie "Alle herunterladen"
                          für vollständige Offline-Fähigkeit.
                        </span>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Cache Details */}
            <Card className="md:col-span-2 xl:col-span-1">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> Cache-Bereiche
                </CardTitle>
                <CardDescription>
                  Service Worker Cache-Übersicht
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Typ</TableHead>
                        <TableHead className="text-right">Einträge</TableHead>
                        <TableHead className="text-right">Größe</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary?.caches.map((cache) => (
                        <TableRow key={cache.cacheName}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  cache.kind === 'media' ? 'default' : 'outline'
                                }
                                className="text-xs"
                              >
                                {cache.kind}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {cache.entryCount}
                          </TableCell>
                          <TableCell className="text-right">
                            {cache.totalBytes != null
                              ? formatBytes(cache.totalBytes)
                              : '–'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {!summary?.caches.length ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-muted-foreground text-center text-sm"
                          >
                            Keine Cache-Daten verfügbar
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
