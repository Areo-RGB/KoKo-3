// Custom Service Worker for Video Caching
// This extends the default next-pwa service worker with advanced video caching strategies

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js',
);

const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { RangeRequestsPlugin } = workbox.rangeRequests;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

// Skip waiting and claim clients immediately
self.skipWaiting();
workbox.core.clientsClaim();

// Precache static assets (handled by next-pwa)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// ============================================
// VIDEO CACHING STRATEGY
// ============================================
// Cache videos with range request support for seeking
// This is critical for large video files from DigitalOcean Spaces and R2
registerRoute(
  ({ request, url }) => {
    return (
      request.destination === 'video' ||
      url.pathname.endsWith('.mp4') ||
      url.hostname.includes('digitaloceanspaces.com') ||
      url.hostname.includes('r2.dev')
    );
  },
  new CacheFirst({
    cacheName: 'video-cache-v1',
    plugins: [
      // CRITICAL: Enable range request support for video seeking
      new RangeRequestsPlugin(),
      // Cache successful responses only
      new CacheableResponsePlugin({
        statuses: [0, 200, 206], // 206 = Partial Content (range requests)
      }),
      // Limit cache size and age
      new ExpirationPlugin({
        maxEntries: 50, // Store up to 50 videos
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true, // Auto-cleanup on storage quota issues
      }),
    ],
  }),
);

// ============================================
// IMAGES CACHING
// ============================================
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache-v1',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// ============================================
// AUDIO CACHING (for soundboard)
// ============================================
registerRoute(
  ({ request, url }) =>
    request.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.ogg'),
  new CacheFirst({
    cacheName: 'audio-cache-v1',
    plugins: [
      new RangeRequestsPlugin(),
      new CacheableResponsePlugin({
        statuses: [0, 200, 206],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

// ============================================
// FONTS CACHING
// ============================================
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-cache-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  }),
);

// ============================================
// API RESPONSES (JSON data)
// ============================================
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.includes('/data/'),
  new NetworkFirst({
    cacheName: 'api-cache-v1',
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes for fresh data
      }),
    ],
  }),
);

// ============================================
// STATIC ASSETS (CSS, JS)
// ============================================
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-assets-cache-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  }),
);

// ============================================
// NAVIGATION (HTML pages)
// ============================================
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// ============================================
// OFFLINE FALLBACK
// ============================================
// Offline page handling
const OFFLINE_URL = '/offline/';
const CACHE_NAME = 'offline-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pre-cache offline page if it exists
      return cache.add(OFFLINE_URL).catch(() => {
        console.log('No offline page found, skipping offline cache');
      });
    }),
  );
});

// ============================================
// BACKGROUND SYNC (optional enhancement)
// ============================================
// Useful for offline form submissions or analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-analytics') {
    event.waitUntil(
      // Sync queued analytics or other data
      console.log('Background sync triggered'),
    );
  }
});

// ============================================
// MESSAGE HANDLING
// ============================================
// Listen for messages from the app (e.g., manual cache updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_VIDEO') {
    const videoUrl = event.data.url;
    event.waitUntil(
      caches.open('video-cache-v1').then((cache) => {
        return cache.add(videoUrl).catch((error) => {
          console.error('Failed to cache video:', error);
        });
      }),
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const cacheName = event.data.cacheName || 'video-cache-v1';
    event.waitUntil(
      caches.delete(cacheName).then(() => {
        console.log(`Cache ${cacheName} cleared`);
      }),
    );
  }
});

// ============================================
// CACHE SIZE MONITORING
// ============================================
// Log cache sizes for debugging
if (self.registration && self.registration.navigationPreload) {
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.registration.navigationPreload.enable());
  });
}

console.log('🎥 Custom Service Worker with Video Caching loaded successfully');
