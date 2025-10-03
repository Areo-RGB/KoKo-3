# Video Caching for PWA

This document explains the video caching implementation for offline playback in the PWA.

## Overview

The PWA now supports advanced video caching with the following features:

- **Offline Video Playback**: Videos are cached for offline access
- **Range Request Support**: Enables video seeking/scrubbing even for cached videos
- **Smart Storage Management**: Automatic cache expiration and quota management
- **Multi-Source Support**: Works with DigitalOcean Spaces, Cloudflare R2, and other CDNs

## Architecture

### Service Worker (`public/sw-custom.js`)

The custom service worker extends the default next-pwa functionality with Workbox strategies:

1. **CacheFirst** strategy for videos with **RangeRequestsPlugin**
   - Critical for video seeking functionality
   - Supports HTTP 206 Partial Content responses
   - Enables smooth playback of cached videos

2. **Cache Configuration**:
   - Video Cache: Up to 50 videos, 30-day expiration
   - Audio Cache: Up to 30 files, 30-day expiration
   - Images: StaleWhileRevalidate, 100 entries
   - API Data: NetworkFirst, 5-minute cache

### React Hook (`hooks/use-video-cache.ts`)

Provides a clean API for video cache management:

```typescript
const {
  cacheStatus,      // Cache support and storage info
  cacheVideo,       // Cache a single video
  cacheVideos,      // Cache multiple videos
  isVideoCached,    // Check if video is cached
  uncacheVideo,     // Remove from cache
  clearVideoCache,  // Clear all videos
  getCacheInfo,     // Get cache size/count
} = useVideoCache();
```

### UI Component (`components/video-cache-manager.tsx`)

User-facing cache management interface:

- Storage usage visualization
- Cache all videos button
- Clear cache functionality
- Online/offline status indicator

## Usage

### 1. In a Page Component

```tsx
import { VideoCacheManager } from '@/components/video-cache-manager';
import { videoDatabase } from '@/lib/video-data';

export default function VideoPage() {
  // Get all video URLs from your data
  const videoUrls = videoDatabase
    .flatMap(v => v.chapters.map(c => c.videoUrl))
    .filter(Boolean);

  return (
    <div>
      <VideoCacheManager videoUrls={videoUrls} autoUpdate />
    </div>
  );
}
```

### 2. Manual Cache Control

```tsx
'use client';

import { useVideoCache } from '@/hooks/use-video-cache';

export function MyComponent() {
  const { cacheVideo, isVideoCached } = useVideoCache();

  const handleDownload = async (url: string) => {
    const success = await cacheVideo(url);
    if (success) {
      console.log('Video cached successfully');
    }
  };

  return <button onClick={() => handleDownload(videoUrl)}>Cache Video</button>;
}
```

### 3. Check Cache Status

```tsx
const { cacheStatus, getCacheInfo } = useVideoCache();

useEffect(() => {
  const checkStatus = async () => {
    const info = await getCacheInfo();
    console.log(`${info.count} videos cached, ${formatBytes(info.size)}`);
  };
  checkStatus();
}, []);
```

## How It Works

### Video Caching Flow

1. **First Request**: 
   - Browser requests video from server
   - Service worker intercepts the request
   - Video is fetched from network
   - Response is cached with CacheFirst strategy
   - Video is served to browser

2. **Subsequent Requests**:
   - Service worker serves from cache immediately
   - Network request skipped (offline-capable)
   - Range requests handled by RangeRequestsPlugin

3. **Video Seeking**:
   - Browser sends Range header (e.g., `Range: bytes=1000-5000`)
   - RangeRequestsPlugin slices the cached response
   - Returns HTTP 206 Partial Content
   - Seeking works smoothly even offline

### Storage Management

- **Quota Management**: Automatic cleanup on storage quota errors
- **LRU Eviction**: Least recently used videos removed when limit reached
- **Expiration**: Videos expire after 30 days (configurable)

## Configuration

### Adjust Cache Limits

Edit `next.config.mjs`:

```javascript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/.*\.(mp4|webm|ogg)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'video-cache-v1',
      expiration: {
        maxEntries: 100,        // Increase to cache more videos
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
      },
      rangeRequests: true,
      cacheableResponse: {
        statuses: [0, 200, 206],
      },
    },
  },
]
```

### Custom Cache Names

To version your cache (force re-download on update):

```javascript
cacheName: 'video-cache-v2', // Increment version
```

## Browser Compatibility

### Service Worker Support
- ✅ Chrome/Edge 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Opera 27+

### Cache API Support
- ✅ Chrome 40+
- ✅ Firefox 41+
- ✅ Safari 11.1+
- ✅ Edge 16+

### Range Requests
- ✅ All modern browsers support HTTP 206 Partial Content

## Testing

### Test Offline Functionality

1. Open DevTools → Application → Service Workers
2. Check "Offline" checkbox
3. Reload page - videos should still play
4. Seek in video - should work smoothly

### Inspect Cache

1. Open DevTools → Application → Cache Storage
2. Find `video-cache-v1`
3. View cached video URLs and sizes

### Clear Cache

```javascript
// Programmatically
const { clearVideoCache } = useVideoCache();
await clearVideoCache();

// Or in DevTools
// Application → Cache Storage → Right-click → Delete
```

## Troubleshooting

### Videos Not Caching

1. Check service worker registration:
   ```javascript
   navigator.serviceWorker.getRegistration().then(reg => {
     console.log('SW registered:', reg !== undefined);
   });
   ```

2. Check cache API support:
   ```javascript
   console.log('Cache API:', 'caches' in window);
   ```

3. Check network tab for CORS issues
   - Videos must have proper CORS headers
   - `Access-Control-Allow-Origin: *` or specific domain

### Video Seeking Not Working

- Ensure RangeRequestsPlugin is enabled
- Check server supports Range requests
- Verify HTTP 206 responses in Network tab

### Storage Quota Exceeded

- Clear old caches manually
- Reduce `maxEntries` in config
- Check storage usage: `navigator.storage.estimate()`

## Performance Tips

1. **Preload Critical Videos**: Cache important videos on app load
2. **Background Caching**: Use `requestIdleCallback` for non-critical caching
3. **Progressive Enhancement**: App works without caching
4. **User Control**: Let users choose which videos to cache

## Security Considerations

- Videos are cached in origin-scoped storage
- HTTPS required for service workers
- Cache API respects same-origin policy
- No sensitive data should be cached without encryption

## Future Enhancements

- [ ] Progressive video downloading
- [ ] Cache priority system
- [ ] Automatic cache on WiFi only
- [ ] Cache analytics/telemetry
- [ ] Selective quality caching (low-res for offline)

## Resources

- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache Storage API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)
- [Range Requests Plugin](https://developer.chrome.com/docs/workbox/modules/workbox-range-requests/)
