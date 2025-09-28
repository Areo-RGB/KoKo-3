'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCacheManager } from '@/hooks/use-cache-manager';
import { CacheManager } from '@/lib/cache-manager';
import { Download, HardDrive, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Playlist } from '../_lib/types';

interface VideoCacheButtonProps {
  playlist: Playlist;
  videoUrl: string;
}

export function VideoCacheButton({ playlist, videoUrl }: VideoCacheButtonProps) {
  const {
    isInitialized,
    isOnline,
    isCaching,
    cacheProgress,
    cacheTrainingMaterials,
    getCacheStatus,
  } = useCacheManager();
  const [cachedFiles, setCachedFiles] = useState<number>(0);
  
  // Get all video segments for the playlist
  const videoSegments = playlist.videos.filter(video => !video.isHeader);

  // Calculate available videos to cache
  const availableVideos = videoSegments.length;
  
  // Determine if caching is active for this playlist
  const isCachingPlaylist = isCaching && cacheProgress?.ageGroup === playlist.id;

  useEffect(() => {
    // Get cache status for this specific playlist
    const fetchCacheStatus = async () => {
      if (isInitialized && playlist.id) {
        try {
          const status = await getCacheStatus(playlist.id);
          setCachedFiles(status?.fileCount || 0);
        } catch (err) {
          console.error('Failed to get cache status:', err);
        }
      }
    };

    fetchCacheStatus();
  }, [isInitialized, playlist.id, getCacheStatus]);

  const handleCachePlaylist = async () => {
    if (!playlist.id || !isOnline) return;

    try {
      // Create a session-like object for each video segment
      const videoSessions = videoSegments.map(video => ({
        ageGroup: playlist.id,
        id: video.id,
        htmlPath: `${videoUrl}#t=${video.startTime || 0}`, // Include timestamp in URL
        title: video.title,
        description: video.description,
        timestamp: video.timestamp,
        startTime: video.startTime,
      }));

      await cacheTrainingMaterials(playlist.id, videoSessions);
      
      // Update cache status after caching is complete
      const status = await getCacheStatus(playlist.id);
      setCachedFiles(status?.fileCount || 0);
    } catch (err) {
      console.error('Video caching failed:', err);
    }
  };

  if (!isInitialized) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Initialisieren...
      </Button>
    );
  }

  const isCached = cachedFiles > 0;
  const progressPercentage = isCachingPlaylist 
    ? cacheProgress?.progress || 0 
    : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge
            variant="secondary"
            className={`h-6 px-2 ${isOnline 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'}`}
          >
            {isOnline ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-muted-foreground" />
            <span>{cachedFiles}/{availableVideos} Videos</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleCachePlaylist}
          disabled={!isOnline || isCaching || availableVideos === 0}
          className="flex-1"
          size="sm"
        >
          {isCachingPlaylist ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Wird geladen...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {isCached ? 'Aktualisieren' : 'Videos zwischenspeichern'}
            </>
          )}
        </Button>
        
        {isCachingPlaylist && (
          <div className="flex-1">
            <div className="h-8 flex items-center justify-center text-sm text-muted-foreground">
              {progressPercentage}% - {cacheProgress?.cachedFiles || 0} von {availableVideos} Videos
            </div>
          </div>
        )}
      </div>

      {isCached && !isCaching && (
        <div className="mt-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-md text-sm text-green-700 dark:text-green-300">
          {cachedFiles} Videos sind für den Offline-Zugriff verfügbar.
        </div>
      )}
    </div>
  );
}