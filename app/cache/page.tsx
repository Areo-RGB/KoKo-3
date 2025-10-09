'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  HardDrive,
  PauseCircle,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
import { useVideoCache } from '@/hooks/use-video-cache';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Bereit',
  running: 'Aktiver Download',
  completed: 'Abgeschlossen',
  error: 'Fehler',
  aborted: 'Abgebrochen',
};

const STATUS_BADGE: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  idle: 'outline',
  running: 'default',
  completed: 'secondary',
  error: 'destructive',
  aborted: 'destructive',
};

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
    progress,
    prefetchVideos,
    abortPrefetch,
    clearVideoCache,
    requestSummary,
    formatBytes,
  } = useVideoCache();

  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allVideoUrls = useMemo(() => collectVideoUrls(), []);
  const isRunning = progress.status === 'running';
  const progressPercent = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  const storageQuota = storageSnapshot?.quota ?? 0;
  const storageUsage = storageSnapshot?.usage ?? 0;
  const storagePercent = storageQuota
    ? Math.min((storageUsage / storageQuota) * 100, 100)
    : 0;

  const handleStart = async () => {
    if (!isSupported || !allVideoUrls.length || isRunning) return;
    setErrorMessage(null);
    setIsStarting(true);
    try {
      const taskId = await prefetchVideos(allVideoUrls, 'offline-videos');
      if (!taskId) {
        setErrorMessage('Service Worker nicht verfügbar.');
      }
    } catch (error) {
      setErrorMessage('Download konnte nicht gestartet werden.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleAbort = () => {
    abortPrefetch();
  };

  const handleClear = () => {
    clearVideoCache();
  };

  const statusLabel = STATUS_LABEL[progress.status] ?? 'Unbekannt';
  const statusBadge = STATUS_BADGE[progress.status] ?? 'outline';
  const mediaEntries = mediaCache?.entryCount ?? 0;
  const mediaSize = mediaCache?.totalBytes ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Offline-Speicher</h1>
        <p className="text-muted-foreground">
          Verwalte zwischengespeicherte Trainingsinhalte, überprüfe den
          Speicherverbrauch und lade Videos für den Offline-Gebrauch herunter.
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
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" /> Speicherübersicht
                </CardTitle>
                <CardDescription>
                  Gesamter Browser-Speicher inkl. HTTP-Cache & Service Worker
                  Cache.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Gesamtbelegung</span>
                    <span>
                      {formatBytes(storageUsage)} / {formatBytes(storageQuota)}
                    </span>
                  </div>
                  <Progress value={storagePercent} className="mt-2" />
                  <p className="text-muted-foreground mt-2 text-xs">
                    {storagePercent.toFixed(1)}% belegt
                  </p>
                </div>
                <div className="bg-muted/40 space-y-1 rounded-md border p-3 text-xs">
                  <p className="font-medium">ℹ️ Wichtig</p>
                  <p className="text-muted-foreground">
                    Diese Anzeige umfasst ALLE gespeicherten Daten dieser App,
                    einschließlich Chrome&apos;s HTTP-Cache (Videos beim
                    Abspielen) und Service Worker Cache (manuell
                    heruntergeladene Inhalte).
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => requestSummary()}
                    disabled={isStarting}
                  >
                    <RefreshCw className="h-4 w-4" /> Aktualisieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={openChromeSettings}
                    title="Chrome-Einstellungen für diese Website öffnen"
                  >
                    <ExternalLink className="h-4 w-4" /> Speicher löschen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" /> Video-Downloads
                </CardTitle>
                <CardDescription>
                  Lade alle verfügbaren Trainingsvideos zur Offline-Nutzung
                  herunter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    Im SW-Cache
                  </span>
                  <span className="text-sm font-medium">{mediaEntries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    SW-Cache Größe
                  </span>
                  <span className="text-sm font-medium">
                    {mediaSize != null ? formatBytes(mediaSize) : '–'}
                  </span>
                </div>
                <div className="rounded-md border-l-4 border-blue-500 bg-blue-50 p-2 dark:bg-blue-950/20">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Hinweis:</strong> Videos werden zusätzlich im
                    Browser-HTTP-Cache gespeichert. Die tatsächliche
                    Speichernutzung sehen Sie oben unter
                    &quot;Gesamtbelegung&quot;.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status</span>
                    <Badge variant={statusBadge}>{statusLabel}</Badge>
                  </div>
                  <Progress value={progressPercent} />
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {progress.completed} / {progress.total} Dateien
                    </span>
                    <span>{formatBytes(progress.bytesDownloaded)}</span>
                  </div>
                </div>

                {errorMessage ? (
                  <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
                    <XCircle className="mt-0.5 h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="gap-2"
                    onClick={handleStart}
                    disabled={
                      isRunning || isStarting || allVideoUrls.length === 0
                    }
                  >
                    <Download className="h-4 w-4" />
                    Offline-Speicherung starten
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleAbort}
                    disabled={!isRunning}
                  >
                    <PauseCircle className="h-4 w-4" />
                    Vorgang abbrechen
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive gap-2"
                    onClick={handleClear}
                    disabled={mediaEntries === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    Video-Cache leeren
                  </Button>
                </div>

                {progress.status === 'completed' ? (
                  <div className="border-secondary/40 bg-secondary/10 flex items-start gap-2 rounded-md border p-3 text-sm">
                    <CheckCircle2 className="text-secondary-foreground mt-0.5 h-4 w-4" />
                    <span>
                      Alle ausgewählten Videos sind jetzt offline verfügbar.
                    </span>
                  </div>
                ) : null}

                {progress.status === 'error' ? (
                  <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border p-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                    <span>
                      Einige Dateien konnten nicht geladen werden. Prüfe deine
                      Verbindung oder den verfügbaren Speicher.
                    </span>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 xl:col-span-1">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" /> Cache-Details
                </CardTitle>
                <CardDescription>
                  Überblick über die von der App genutzten Cache-Bereiche.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-muted-foreground text-sm">
                  Die Cache-Namen entsprechen den vom Service Worker verwalteten
                  Bereichen.
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead className="text-right">Einträge</TableHead>
                        <TableHead className="text-right">Größe</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary?.caches.map((cache) => (
                        <TableRow key={cache.cacheName}>
                          <TableCell className="font-medium">
                            {cache.cacheName}
                          </TableCell>
                          <TableCell>{cache.kind}</TableCell>
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
                            colSpan={4}
                            className="text-muted-foreground text-center text-sm"
                          >
                            Keine Cache-Daten verfügbar.
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
                <div className="bg-muted/40 text-muted-foreground space-y-2 rounded-md border p-3 text-xs">
                  <div>
                    <p className="font-medium">💾 Zwei Cache-Systeme</p>
                    <p className="mt-1">
                      <strong>Service Worker Cache:</strong> Manuell
                      heruntergeladene Videos (hier angezeigt)
                    </p>
                    <p className="mt-1">
                      <strong>HTTP-Cache:</strong> Beim Abspielen automatisch
                      gecachte Videos (nicht hier angezeigt)
                    </p>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-medium">🗑️ Speicher freigeben</p>
                    <p className="mt-1">
                      Um den gesamten Speicher zu löschen (inkl. HTTP-Cache),
                      klicke oben auf &quot;Speicher löschen&quot; oder öffne
                      Chrome-Einstellungen manuell.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
