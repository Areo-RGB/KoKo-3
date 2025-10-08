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
import {
  AlertCircle,
  Cloud,
  HardDrive,
  Home,
  RefreshCw,
  Video,
  WifiOff,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({
    videoCount: 0,
    totalSize: 0,
  });
  const [cachedPages, setCachedPages] = useState<string[]>([]);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    // Load cache information
    const loadCacheInfo = async () => {
      try {
        if ('caches' in window) {
          const videoCache = await caches.open('video-cache-v1');
          const videoKeys = await videoCache.keys();

          let totalSize = 0;
          for (const request of videoKeys) {
            const response = await videoCache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }

          setCacheInfo({
            videoCount: videoKeys.length,
            totalSize,
          });

          // Check for cached pages
          const pagesCache = await caches.open('pages-cache-v1');
          const pageKeys = await pagesCache.keys();
          setCachedPages(pageKeys.map((key) => new URL(key.url).pathname));
        }
      } catch (error) {
        console.error('Failed to load cache info:', error);
      }
    };

    loadCacheInfo();
  }, []);

  useEffect(() => {
    // Automatically retry connection when online
    if (isOnline) {
      const timer = setTimeout(() => {
        router.refresh();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, router]);

  const handleRetry = () => {
    setRetryAttempt((prev) => prev + 1);
    window.location.reload();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  };

  // Calculate estimated storage usage
  const estimatedQuota = 1024 * 1024 * 1024; // Assume 1GB for display
  const storagePercent = (cacheInfo.totalSize / estimatedQuota) * 100;

  return (
    <div className="container mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-4 py-16">
      {/* Main Offline Card */}
      <Card className="w-full border-2 border-orange-500/50 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-orange-500/20">
            <WifiOff className="size-8 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Sie sind offline</CardTitle>
          <CardDescription>
            {isOnline
              ? 'Verbindung wird wiederhergestellt...'
              : 'Keine Internetverbindung verfügbar'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Message */}
          <div className="bg-muted rounded-lg p-4 text-center">
            {isOnline ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <RefreshCw className="size-4 animate-spin" />
                <span>Verbindung erkannt. Seite wird neu geladen...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <AlertCircle className="size-4" />
                <span>
                  Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie
                  es erneut.
                </span>
              </div>
            )}
          </div>

          {/* Cached Content Info */}
          {cacheInfo.videoCount > 0 && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <HardDrive className="size-5" />
                Verfügbare Offline-Inhalte
              </h3>

              <div className="bg-muted grid grid-cols-2 gap-4 rounded-lg p-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Gecachte Videos
                  </p>
                  <p className="flex items-center gap-2 text-2xl font-bold">
                    <Video className="size-5" />
                    {cacheInfo.videoCount}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Speichergröße</p>
                  <p className="text-2xl font-bold">
                    {formatBytes(cacheInfo.totalSize)}
                  </p>
                </div>
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Offline-Speicher
                  </span>
                  <span className="font-mono text-sm">
                    {storagePercent.toFixed(1)}%
                  </span>
                </div>
                <Progress value={Math.min(storagePercent, 100)} />
              </div>
            </div>
          )}

          {/* Cached Pages */}
          {cachedPages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Verfügbare Offline-Seiten ({cachedPages.length})
              </h4>
              <div className="bg-muted max-h-32 overflow-y-auto rounded-lg p-2">
                <div className="space-y-1">
                  {cachedPages.slice(0, 10).map((page) => (
                    <Link
                      key={page}
                      href={page}
                      className="hover:bg-background block rounded px-2 py-1 text-sm transition-colors"
                    >
                      <Badge variant="outline" className="font-mono text-xs">
                        {page}
                      </Badge>
                    </Link>
                  ))}
                  {cachedPages.length > 10 && (
                    <p className="text-muted-foreground px-2 text-xs">
                      + {cachedPages.length - 10} weitere Seiten
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Cache Warning */}
          {cacheInfo.videoCount === 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
              <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-yellow-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-600">
                  Keine Offline-Inhalte verfügbar
                </p>
                <p className="text-muted-foreground text-sm">
                  Sie haben noch keine Videos für die Offline-Nutzung gecacht.
                  Besuchen Sie die Cache-Verwaltung, wenn Sie wieder online
                  sind.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={handleRetry}
              disabled={isOnline}
              className="flex-1"
              variant="default"
            >
              <RefreshCw
                className={`mr-2 size-4 ${isOnline ? 'animate-spin' : ''}`}
              />
              Erneut versuchen
              {retryAttempt > 0 && ` (${retryAttempt})`}
            </Button>
            <Button asChild className="flex-1" variant="outline">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Zur Startseite
              </Link>
            </Button>
          </div>

          {/* Cache Management Link */}
          <div className="text-center">
            <Button asChild variant="link" size="sm">
              <Link href="/cache" className="text-muted-foreground">
                <Cloud className="mr-2 size-4" />
                Cache-Verwaltung öffnen
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <div className="mt-8 w-full space-y-4">
        <h3 className="text-center text-lg font-semibold">
          Tipps für die Offline-Nutzung
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Videos vorab cachen</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Besuchen Sie die Cache-Verwaltung, um Videos für die
              Offline-Nutzung herunterzuladen.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Automatische Synchronisierung
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Wenn Sie wieder online sind, werden alle Daten automatisch
              synchronisiert.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
