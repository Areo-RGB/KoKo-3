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

const normalizeVideoUrl = (input) => {
  if (!input) {
    return input;
  }

  try {
    const url = new URL(input);
    url.hash = '';
    return url.toString();
  } catch (error) {
    const [withoutHash] = input.split('#');
    return withoutHash;
  }
};

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
// Use Network First with a longer timeout for better offline experience
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache-v1',
    networkTimeoutSeconds: 5, // Increased timeout for better UX
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  }),
);

// ============================================
// OFFLINE FALLBACK
// ============================================
// Offline page handling
const OFFLINE_URL = '/offline/';
const OFFLINE_CACHE_NAME = 'offline-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      console.log(
        '🚀 Service Worker installing - Pre-caching ALL resources...',
      );

      // Open all caches
      const pagesCache = await caches.open('pages-cache-v1');
      const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
      const videoCache = await caches.open('video-cache-v1');
      const imagesCache = await caches.open('images-cache-v1');
      const assetsCache = await caches.open('static-assets-cache-v1');

      // Critical pages for navigation
      const criticalPages = [
        '/',
        '/cache/',
        '/offline/',
        '/dashboard/',
        '/fifa-11-plus/',
        '/video-player/',
        '/junioren/',
        '/interval-timer/',
        '/muscle-diagram/',
        '/ranking/',
        '/soundboard/',
        '/yo-yo/',
        '/data-combined/',
        '/performance-charts/',
        '/hertha-03-iv/',
        '/fortschritt/',
      ];

      // FIFA 11+ Videos (base URLs without timestamps)
      const fifa11Videos = [
        'https://data-h03.fra1.cdn.digitaloceanspaces.com/FIFA',
        'https://data-h03.fra1.cdn.digitaloceanspaces.com/ws.mp4',
      ];

      // Common static assets
      const staticAssets = [
        '/manifest.json',
        '/assets/icons/android/icon-144.png',
        '/assets/icons/favicon.ico',
        '/assets/icons/favicon-32x32.png',
        '/assets/icons/favicon-16x16.png',
        '/assets/svg/FIFA_Logo.svg',
      ];

      // Cache pages
      console.log('� Caching pages...');
      for (const page of criticalPages) {
        try {
          await pagesCache.add(page);
          console.log(`✅ Page: ${page}`);
        } catch (err) {
          console.warn(`❌ Page failed: ${page}`, err);
        }
      }

      // Cache offline essentials
      console.log('🔌 Caching offline resources...');
      try {
        await offlineCache.addAll([OFFLINE_URL, '/manifest.json']);
        console.log('✅ Offline page cached');
      } catch (err) {
        console.warn('⚠️ Offline page failed:', err);
      }

      // Cache static assets
      console.log('🎨 Caching static assets...');
      for (const asset of staticAssets) {
        try {
          await assetsCache.add(asset);
          console.log(`✅ Asset: ${asset}`);
        } catch (err) {
          console.warn(`❌ Asset failed: ${asset}`, err);
        }
      }

      // Cache FIFA 11+ videos (main files)
      console.log('🎥 Pre-caching FIFA 11+ videos...');
      for (const videoUrl of fifa11Videos) {
        try {
          console.log(`📥 Fetching: ${videoUrl}`);
          const response = await fetch(videoUrl, {
            mode: 'cors',
            credentials: 'omit',
          });

          if (response.ok) {
            const blob = await response.blob();
            const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
            console.log(`📥 Downloaded: ${videoUrl} (${sizeMB} MB)`);

            const fullResponse = new Response(blob, {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type':
                  response.headers.get('Content-Type') || 'video/mp4',
                'Content-Length': blob.size.toString(),
                'Cache-Control': 'public, max-age=31536000',
              },
            });

            await videoCache.put(videoUrl, fullResponse);
            console.log(`✅ Video cached: ${sizeMB} MB`);
          }
        } catch (err) {
          console.warn(`❌ Video failed: ${videoUrl}`, err);
        }
      }

      console.log('✅ Service Worker installation complete!');
    })(),
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// ============================================
// OFFLINE FALLBACK FOR NAVIGATION
// ============================================
// Set a catch handler for navigation requests (after all routes are registered)
// This is called AFTER workbox routes have been checked
workbox.routing.setCatchHandler(async ({ event }) => {
  // Only handle navigation requests (page loads)
  if (event.request.mode === 'navigate') {
    // Try to get from pages cache
    const cachedPage = await caches.match(event.request);
    if (cachedPage) {
      return cachedPage;
    }

    // Return offline page
    const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
    const offlineResponse = await offlineCache.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }

    // Ultimate fallback
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>Offline</h1><p>No internet connection available.</p></body></html>',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }

  // For non-navigation requests, try cache
  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return error response
  return new Response('Network request failed and no cache available', {
    status: 503,
    statusText: 'Service Unavailable',
  });
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
    const videoUrl = normalizeVideoUrl(event.data.url);
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open('video-cache-v1');

          // Check if already cached
          const cached = await cache.match(videoUrl);
          if (cached) {
            console.log(`✅ Video already cached: ${videoUrl}`);
            return;
          }

          // Fetch the full video file
          const response = await fetch(videoUrl, {
            mode: 'cors',
            credentials: 'omit',
          });

          if (!response.ok && response.status !== 206) {
            console.error(
              `❌ Failed to fetch video: ${response.status} ${response.statusText}`,
            );
            return;
          }

          // Read the blob to ensure full download
          const blob = await response.blob();
          console.log(
            `📥 Service Worker cached video: ${(blob.size / 1024 / 1024).toFixed(2)} MB - ${videoUrl}`,
          );

          // Create new response with the blob
          const fullResponse = new Response(blob, {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type':
                response.headers.get('Content-Type') || 'video/mp4',
              'Content-Length': blob.size.toString(),
              'Cache-Control': 'public, max-age=31536000',
            },
          });

          await cache.put(videoUrl, fullResponse);
          console.log(`✅ Video cached successfully: ${videoUrl}`);
        } catch (error) {
          console.error('❌ Failed to cache video:', videoUrl, error);
        }
      })(),
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
// Activate event - claim clients and enable navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if available
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      // Clean up old caches
      const cacheWhitelist = [
        'video-cache-v1',
        'images-cache-v1',
        'audio-cache-v1',
        'google-fonts-cache-v1',
        'api-cache-v1',
        'static-assets-cache-v1',
        'pages-cache-v1',
        'offline-v1',
      ];

      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );

      // Take control of all clients immediately
      await self.clients.claim();
      console.log('✅ Service Worker activated and clients claimed');
    })(),
  );
});

console.log('🎥 Custom Service Worker with Video Caching loaded successfully');
