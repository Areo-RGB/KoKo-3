'use client';

import type { TrainingSession } from '@/app/junioren/_lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
import { useCacheManager } from '@/hooks/use-cache-manager';
import { CacheManager, type CacheStatus } from '@/lib/cache-manager';
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  HardDrive,
  Info,
  Loader2,
  Trash2,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface CacheControlProps {
  selectedAgeGroup: string | null;
  allSessions: TrainingSession[];
}

const MemoizedCacheStatsGrid = React.memo(
  ({
    ageGroupSessions,
    availableFiles,
    cachedFiles,
  }: {
    ageGroupSessions: TrainingSession[];
    availableFiles: number;
    cachedFiles: number;
  }) => (
    <div className="bg-card grid grid-cols-3 gap-4 rounded-lg border p-4">
      <div className="p-3 text-center">
        <div className="mb-1 text-2xl font-bold text-blue-600">
          {ageGroupSessions.length}
        </div>
        <div className="text-muted-foreground text-xs">Sessions</div>
      </div>
      <div className="border-x p-3 text-center">
        <div className="mb-1 text-2xl font-bold text-green-600">
          {availableFiles}
        </div>
        <div className="text-muted-foreground text-xs">Verfügbare Dateien</div>
      </div>
      <div className="p-3 text-center">
        <div className="mb-1 text-2xl font-bold text-purple-600">
          {cachedFiles}
        </div>
        <div className="text-muted-foreground text-xs">Zwischengespeichert</div>
      </div>
    </div>
  ),
);
MemoizedCacheStatsGrid.displayName = 'CacheStatsGrid';

const MemoizedCacheDetails = React.memo(
  ({
    cacheStatus,
    ageGroupSessions,
  }: {
    cacheStatus: CacheStatus | null;
    ageGroupSessions: TrainingSession[];
  }) => (
    <div className="bg-muted/20 rounded-lg border-t p-4">
      <div className="text-sm">
        <div className="mb-3 font-medium">Cache-Details:</div>
        <div className="text-muted-foreground grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="font-medium">Cache-Name:</span>
            <br />
            {cacheStatus?.cacheName || 'Nicht geladen'}
          </div>
          <div>
            <span className="font-medium">Sessions:</span>
            <br />
            {ageGroupSessions.length}
          </div>
          <div>
            <span className="font-medium">HTML-Dateien:</span>
            <br />
            {ageGroupSessions.filter((s) => s.htmlPath !== 'null').length}
          </div>
          <div>
            <span className="font-medium">PDF-Dateien:</span>
            <br />
            {ageGroupSessions.filter((s) => s.pdfPath !== 'null').length}
          </div>
        </div>
      </div>
    </div>
  ),
);
MemoizedCacheDetails.displayName = 'CacheDetails';

export function CacheControl({
  selectedAgeGroup,
  allSessions,
}: CacheControlProps) {
  const {
    isInitialized,
    isOnline,
    isCaching,
    cacheProgress,
    cacheTrainingMaterials,
    getCacheStatus,
    clearCache,
    storageEstimate,
    error,
  } = useCacheManager();
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateCacheStatus = async (ageGroup: string) => {
    try {
      const status = await getCacheStatus(ageGroup);
      setCacheStatus(status);
    } catch (err) {
      console.error('Failed to get cache status:', err);
    }
  };

  useEffect(() => {
    if (selectedAgeGroup && isInitialized) {
      updateCacheStatus(selectedAgeGroup);
    }
  }, [selectedAgeGroup, isInitialized, getCacheStatus]);

  const ageGroupSessions = useMemo(() => {
    if (!selectedAgeGroup) return [] as TrainingSession[];
    return allSessions.filter(
      (session) => session.ageGroup === selectedAgeGroup,
    );
  }, [allSessions, selectedAgeGroup]);

  const availableFiles = useMemo(() => {
    return ageGroupSessions.reduce((count, session) => {
      return (
        count +
        (session.htmlPath !== 'null' ? 1 : 0) +
        (session.pdfPath !== 'null' ? 1 : 0)
      );
    }, 0);
  }, [ageGroupSessions]);

  const handleCacheAgeGroup = async () => {
    if (!selectedAgeGroup) return;
    try {
      await cacheTrainingMaterials(selectedAgeGroup, ageGroupSessions);
      await updateCacheStatus(selectedAgeGroup);
    } catch (err) {
      console.error('Caching failed:', err);
    }
  };

  const handleClearCache = async () => {
    if (!selectedAgeGroup) return;
    try {
      const success = await clearCache(selectedAgeGroup);
      if (success) {
        await updateCacheStatus(selectedAgeGroup);
      }
    } catch (err) {
      console.error('Cache clearing failed:', err);
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Offline-Modus wird initialisiert...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!selectedAgeGroup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Offline-Zugriff
          </CardTitle>
          <CardDescription>
            Wählen Sie eine Altersgruppe aus, um Trainingsmaterialien für den
            Offline-Zugriff herunterzuladen.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const cachedFiles = cacheStatus?.fileCount || 0;
  const isCached = cachedFiles > 0;

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer transition-colors hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Offline-Zugriff für {selectedAgeGroup}
                    <Badge
                      variant={isOnline ? 'secondary' : 'destructive'}
                      className="h-5 px-2"
                    >
                      {isOnline ? (
                        <Wifi className="h-3 w-3" />
                      ) : (
                        <WifiOff className="h-3 w-3" />
                      )}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Trainingsmaterialien für den Offline-Zugriff verwalten.
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right text-xs text-muted-foreground">
                  <div>
                    {cachedFiles}/{availableFiles} Dateien
                  </div>
                  {storageEstimate?.usage && (
                    <div>{CacheManager.formatBytes(storageEstimate.usage)}</div>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 px-6 pt-0 pb-6">
            <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
              <Badge
                variant="secondary"
                className={
                  isOnline
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                }
              >
                {isOnline ? (
                  <Wifi className="mr-1 h-3 w-3" />
                ) : (
                  <WifiOff className="mr-1 h-3 w-3" />
                )}
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
              {storageEstimate && (
                <Badge variant="outline" className="text-xs">
                  <HardDrive className="mr-1 h-3 w-3" />
                  {CacheManager.formatBytes(storageEstimate.usage || 0)}{' '}
                  verwendet
                </Badge>
              )}
            </div>

            <MemoizedCacheStatsGrid
              ageGroupSessions={ageGroupSessions}
              availableFiles={availableFiles}
              cachedFiles={cachedFiles}
            />

            {isCaching && cacheProgress && (
              <div className="space-y-3 rounded-lg bg-muted/30 p-4">
                <Progress value={cacheProgress.progress} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {cacheProgress.progress}% - {cacheProgress.cachedFiles} von{' '}
                  {availableFiles} Dateien geladen
                  {cacheProgress.failedFiles > 0 && (
                    <span className="ml-2 text-orange-600">
                      ({cacheProgress.failedFiles} Fehler)
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 rounded-lg bg-muted/20 p-4">
              <Button
                onClick={handleCacheAgeGroup}
                disabled={!isOnline || isCaching || availableFiles === 0}
                className="flex-1"
                size="sm"
              >
                {isCaching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird
                    geladen...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />{' '}
                    {isCached ? 'Aktualisieren' : 'Herunterladen'}
                  </>
                )}
              </Button>
              {isCached && (
                <Button
                  onClick={handleClearCache}
                  variant="outline"
                  size="sm"
                  disabled={isCaching}
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Löschen
                </Button>
              )}
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {showDetails && (
              <MemoizedCacheDetails
                cacheStatus={cacheStatus}
                ageGroupSessions={ageGroupSessions}
              />
            )}

            {error && (
              <Alert variant="destructive" className="mx-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isCached && !isCaching && (
              <Alert className="mx-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Offline verfügbar</AlertTitle>
                <AlertDescription>
                  {cachedFiles} Dateien sind für den Offline-Zugriff verfügbar.
                </AlertDescription>
              </Alert>
            )}

            {!isOnline && (
              <Alert variant="warning" className="mx-4">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Offline-Modus</AlertTitle>
                <AlertDescription>
                  Sie können nur auf bereits zwischengespeicherte Inhalte
                  zugreifen.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
