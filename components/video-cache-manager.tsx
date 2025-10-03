'use client';

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

interface VideoCacheManagerProps {
  videoUrls?: string[];
  autoUpdate?: boolean;
}

export const VideoCacheManager: React.FC<VideoCacheManagerProps> = ({
  videoUrls = [],
  autoUpdate = true,
}) => {
  const {
    cacheStatus,
    cachedVideos,
    cacheVideos,
    clearVideoCache,
    updateCachedVideosList,
    getCacheInfo,
    formatBytes,
  } = useVideoCache();

  const [cacheInfo, setCacheInfo] = useState({ size: 0, count: 0 });
  const [isCaching, setIsCaching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (autoUpdate) {
      updateCachedVideosList();
      loadCacheInfo();
    }

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoUpdate]);

  const loadCacheInfo = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
  };

  const handleCacheAll = async () => {
    if (videoUrls.length === 0) return;

    setIsCaching(true);
    try {
      const result = await cacheVideos(videoUrls);
      console.log(`Cached ${result.success} videos, ${result.failed} failed`);
      await loadCacheInfo();
    } catch (error) {
      console.error('Failed to cache videos:', error);
    } finally {
      setIsCaching(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await clearVideoCache();
      await loadCacheInfo();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  if (!cacheStatus.isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="size-5" />
            Video Caching
          </CardTitle>
          <CardDescription>Cache videos for offline playback</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Your browser does not support offline caching. Please use a modern
            browser to enable this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  const storageUsagePercent =
    cacheStatus.estimate?.usagePercent?.toFixed(1) || 0;
  const quota = cacheStatus.estimate?.quota || 0;
  const usage = cacheStatus.estimate?.usage || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="size-5" />
          Video Cache Manager
          {isOnline ? (
            <Wifi className="ml-auto size-4 text-green-500" />
          ) : (
            <WifiOff className="ml-auto size-4 text-orange-500" />
          )}
        </CardTitle>
        <CardDescription>
          Cache videos for offline playback and faster loading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <HardDrive className="size-4" />
              Storage Usage
            </span>
            <span className="text-muted-foreground font-mono">
              {formatBytes(usage)} / {formatBytes(quota)} ({storageUsagePercent}
              %)
            </span>
          </div>
          <Progress value={Number(storageUsagePercent)} />
        </div>

        {/* Cache Info */}
        <div className="bg-muted grid grid-cols-2 gap-4 rounded-lg p-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Cached Videos</p>
            <p className="text-2xl font-bold">{cacheInfo.count}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Cache Size</p>
            <p className="text-2xl font-bold">{formatBytes(cacheInfo.size)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {videoUrls.length > 0 && (
            <Button
              onClick={handleCacheAll}
              disabled={isCaching || !isOnline}
              className="flex-1"
              variant="default"
            >
              {isCaching ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Caching...
                </>
              ) : (
                <>
                  <Download className="mr-2 size-4" />
                  Cache All Videos ({videoUrls.length})
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleClearCache}
            disabled={isClearing || cacheInfo.count === 0}
            variant="outline"
            className="flex-1"
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Clear Cache
              </>
            )}
          </Button>
        </div>

        {/* Status Message */}
        {!isOnline && (
          <div className="rounded-lg bg-orange-500/10 p-3 text-sm text-orange-500">
            <WifiOff className="mr-2 inline size-4" />
            You are offline. Using cached videos.
          </div>
        )}

        {!cacheStatus.isRegistered && (
          <div className="rounded-lg bg-yellow-500/10 p-3 text-sm text-yellow-600">
            Service worker not registered. Video caching may not work properly.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
