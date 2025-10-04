'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useVideoCache } from '@/hooks/use-video-cache';
import { Download, HardDrive, Trash2, Wifi, WifiOff } from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

export const CacheStatusIndicator: FC = () => {
  const { cacheStatus, getCacheInfo, clearVideoCache, formatBytes } =
    useVideoCache();

  const [cacheInfo, setCacheInfo] = useState({ size: 0, count: 0 });
  const [isOnline, setIsOnline] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadCacheInfo();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCacheInfo = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
  };

  const handleClear = async () => {
    setIsClearing(true);
    await clearVideoCache();
    await loadCacheInfo();
    setIsClearing(false);
  };

  if (!cacheStatus.isSupported) {
    return null;
  }

  const storagePercent = cacheStatus.estimate?.usagePercent?.toFixed(0) || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isOnline ? (
            <Wifi className="size-5" />
          ) : (
            <WifiOff className="size-5 text-orange-500" />
          )}
          {cacheInfo.count > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
              {cacheInfo.count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Cache Status</span>
          {isOnline ? (
            <Wifi className="size-4 text-green-500" />
          ) : (
            <WifiOff className="size-4 text-orange-500" />
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-muted-foreground mb-3 text-sm">
            {isOnline ? 'Online' : 'Offline - Using cached content'}
          </p>

          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Download className="size-4" />
                Cached Videos
              </span>
              <span className="font-mono font-semibold">{cacheInfo.count}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <HardDrive className="size-4" />
                Cache Size
              </span>
              <span className="font-mono text-xs">
                {formatBytes(cacheInfo.size)}
              </span>
            </div>
          </div>

          {cacheStatus.estimate && (
            <div className="mb-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage Used</span>
                <span className="font-mono text-xs">
                  {formatBytes(cacheStatus.estimate.usage || 0)} /{' '}
                  {formatBytes(cacheStatus.estimate.quota || 0)}
                </span>
              </div>
              <Progress value={Number(storagePercent)} />
              <p className="text-muted-foreground text-xs">
                {storagePercent}% of available storage
              </p>
            </div>
          )}
        </div>

        {cacheInfo.count > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleClear}
              disabled={isClearing}
              className="cursor-pointer"
            >
              <Trash2 className="mr-2 size-4" />
              {isClearing ? 'Clearing...' : 'Clear All Cache'}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
