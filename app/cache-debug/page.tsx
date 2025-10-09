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
import { Database, HardDrive, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CacheDebugPage() {
  const [cacheNames, setCacheNames] = useState<string[]>([]);
  const [cacheDetails, setCacheDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [storageEstimate, setStorageEstimate] = useState<{
    usage?: number;
    quota?: number;
  } | null>(null);

  const scanAllCaches = async () => {
    setLoading(true);
    try {
      const names = await caches.keys();
      setCacheNames(names);

      const details: Record<string, any> = {};
      for (const name of names) {
        const cache = await caches.open(name);
        const keys = await cache.keys();

        const entries = await Promise.all(
          keys.slice(0, 10).map(async (request) => {
            const response = await cache.match(request);
            let size = 0;
            if (response) {
              const contentLength = response.headers.get('content-length');
              if (contentLength) {
                size = parseInt(contentLength, 10);
              } else {
                try {
                  const blob = await response.clone().blob();
                  size = blob.size;
                } catch {
                  size = -1;
                }
              }
            }
            return {
              url: request.url,
              size,
              headers: response
                ? Object.fromEntries(response.headers.entries())
                : {},
            };
          }),
        );

        details[name] = {
          totalEntries: keys.length,
          sampleEntries: entries,
        };
      }
      setCacheDetails(details);
    } catch (error) {
      console.error('Cache scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStorage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      console.log('Storage Estimate:', estimate);
      setStorageEstimate(estimate);
    }
  };

  const clearAllCaches = async () => {
    if (
      !confirm(
        'Alle Caches löschen? Dies kann nicht rückgängig gemacht werden.',
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await scanAllCaches();
      await checkStorage();
    } catch (error) {
      console.error('Error clearing caches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  useEffect(() => {
    scanAllCaches();
    checkStorage();
  }, []);

  const totalEntries = Object.values(cacheDetails).reduce(
    (sum, cache) => sum + (cache?.totalEntries || 0),
    0,
  );

  const storagePercent = storageEstimate?.quota
    ? Math.min(
        ((storageEstimate.usage || 0) / storageEstimate.quota) * 100,
        100,
      )
    : 0;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Database className="h-8 w-8" />
          Cache Diagnostic Tool
        </h1>
        <p className="text-muted-foreground">
          Detaillierte Analyse aller Service Worker Caches
        </p>
      </div>

      {storageEstimate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Speicher-Statistik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-medium">
                <span>Belegung</span>
                <span>
                  {formatBytes(storageEstimate.usage || 0)} /{' '}
                  {formatBytes(storageEstimate.quota || 0)}
                </span>
              </div>
              <Progress value={storagePercent} />
              <p className="text-muted-foreground mt-1 text-xs">
                {storagePercent.toFixed(1)}% verwendet
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Gefundene Caches</p>
                <p className="text-2xl font-bold">{cacheNames.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gesamte Einträge</p>
                <p className="text-2xl font-bold">{totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={scanAllCaches} disabled={loading} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {loading ? 'Scanne...' : 'Cache neu scannen'}
        </Button>
        <Button
          onClick={checkStorage}
          variant="outline"
          disabled={loading}
          className="gap-2"
        >
          <HardDrive className="h-4 w-4" />
          Speicher aktualisieren
        </Button>
        <Button
          onClick={clearAllCaches}
          variant="destructive"
          disabled={loading || cacheNames.length === 0}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Alle Caches löschen
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cache-Details</h2>
          <Badge variant="secondary">{cacheNames.length} Cache(s)</Badge>
        </div>
        {cacheNames.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-center">
              Keine Caches gefunden. Service Worker möglicherweise nicht aktiv.
            </CardContent>
          </Card>
        ) : null}
        {cacheNames.map((name) => {
          const isMediaCache = name.includes('media');
          const isVideoCache = name.includes('video');
          return (
            <Card
              key={name}
              className={isMediaCache || isVideoCache ? 'border-blue-500' : ''}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {name}
                  {(isMediaCache || isVideoCache) && (
                    <Badge variant="default">Video-Cache</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {cacheDetails[name]?.totalEntries || 0} Einträge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <details
                  className="text-xs"
                  open={isMediaCache || isVideoCache}
                >
                  <summary className="hover:text-primary cursor-pointer font-medium">
                    📋 Beispiel-Einträge (erste 10)
                  </summary>
                  <div className="mt-2 space-y-2 pl-4">
                    {cacheDetails[name]?.sampleEntries?.map(
                      (entry: any, idx: number) => (
                        <div key={idx} className="border-l-2 py-1 pl-2">
                          <div className="font-mono break-all">{entry.url}</div>
                          <div className="text-muted-foreground">
                            Size:{' '}
                            {entry.size >= 0
                              ? formatBytes(entry.size)
                              : 'Unknown'}
                          </div>
                          <details>
                            <summary className="cursor-pointer">
                              Headers
                            </summary>
                            <pre className="overflow-auto text-xs">
                              {JSON.stringify(entry.headers, null, 2)}
                            </pre>
                          </details>
                        </div>
                      ),
                    )}
                  </div>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ℹ️ Wichtige Hinweise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="font-medium">🔍 Was wird hier angezeigt?</p>
            <p className="text-muted-foreground">
              Nur Inhalte im <strong>Service Worker Cache API</strong>.
              Chrome&apos;s HTTP-Cache wird hier NICHT angezeigt.
            </p>
          </div>
          <div>
            <p className="font-medium">🎥 Wo sind meine Videos?</p>
            <p className="text-muted-foreground">
              Beim Abspielen gecachte Videos sind oft im HTTP-Cache, nicht hier.
              Öffne{' '}
              <code className="bg-muted rounded px-1">chrome://cache/</code> um
              alle Caches zu sehen.
            </p>
          </div>
          <div>
            <p className="font-medium">🛠️ Debugging-Schritte</p>
            <ol className="text-muted-foreground ml-2 list-inside list-decimal space-y-1">
              <li>DevTools → Application → Cache Storage öffnen</li>
              <li>Vergleiche mit dieser Seite</li>
              <li>
                Prüfe{' '}
                <code className="bg-muted rounded px-1">chrome://cache/</code>{' '}
                für HTTP-Cache
              </li>
              <li>
                Nutze &quot;Speicher aktualisieren&quot; für aktuelle Werte
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
