// Custom Service Worker for Video Caching & Offline Support
// Extends next-pwa's generated worker with QuoVadis-specific behaviour

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js',
);

const { registerRoute, setCatchHandler } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { RangeRequestsPlugin } = workbox.rangeRequests;
const { CacheableResponsePlugin } = workbox.cacheableResponse;

const CACHE_VERSION = 'v2';
const VIDEO_CACHE_NAME = 'video-cache-v1';
const IMAGES_CACHE_NAME = 'images-cache-v2';
const IMAGE_AVATAR_CACHE_NAME = 'image-avatars-cache-v1';
const AUDIO_CACHE_NAME = 'audio-cache-v1';
const STATIC_ASSETS_CACHE_NAME = 'static-assets-cache-v1';
const GOOGLE_FONTS_CSS_CACHE = 'google-fonts-css-v1';
const GOOGLE_FONTS_FILES_CACHE = 'google-fonts-files-v1';
const API_CACHE_NAME = 'api-cache-v1';
const PAGES_CACHE_VERSION = 'v2';
const PAGES_CACHE_NAME = `pages-cache-${PAGES_CACHE_VERSION}`;
const OFFLINE_CACHE_NAME = 'offline-v1';
const OFFLINE_URL = '/offline/';
const APP_SHELL_URL = '/';

const TELEMETRY_ENDPOINT = '/api/telemetry/sw-events';
const ENABLE_TELEMETRY =
  typeof self !== 'undefined' &&
  self.location &&
  !self.location.hostname.includes('localhost');
const TELEMETRY_SAMPLE_RATE = 0.2;
const MAX_RECENT_SW_EVENTS = 50;

const recentSwEvents = [];
const activeCacheTasks = new Map();

const normalizeVideoUrl = (input) => {
  if (!input) return input;

  try {
    const url = new URL(input);
    url.hash = '';
    return url.toString();
  } catch (error) {
    const [withoutHash] = input.split('#');
    return withoutHash;
  }
};

const broadcastMessage = async (message) => {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  for (const client of clients) {
    client.postMessage(message);
  }
};

const recordEvent = async (eventName, detail = {}) => {
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    eventName,
    detail,
    timestamp: Date.now(),
  };

  recentSwEvents.unshift(event);
  if (recentSwEvents.length > MAX_RECENT_SW_EVENTS) {
    recentSwEvents.pop();
  }

  await broadcastMessage({
    type: 'SW_EVENT',
    payload: event,
  });

  if (ENABLE_TELEMETRY && Math.random() <= TELEMETRY_SAMPLE_RATE) {
    try {
      await fetch(TELEMETRY_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      });
    } catch (error) {
      // Ignore telemetry transport issues to avoid breaking offline flows
    }
  }
};

const sendTaskUpdate = async (payload) => {
  await broadcastMessage({
    type: 'CACHE_TASK_UPDATE',
    payload,
  });
};

const cacheVideoBatch = async ({ taskId, urls, label }) => {
  const uniqueUrls = Array.from(
    new Set(
      (urls || [])
        .map((url) => normalizeVideoUrl(url))
        .filter((url) => Boolean(url)),
    ),
  );

  if (!uniqueUrls.length) {
    const summary = {
      taskId,
      label,
      status: 'completed',
      total: 0,
      completed: 0,
      failed: 0,
    };
    await sendTaskUpdate(summary);
    await recordEvent('cache-task-empty', { taskId, label });
    return summary;
  }

  const task = {
    id: taskId,
    label,
    total: uniqueUrls.length,
    completed: 0,
    failed: 0,
    aborted: false,
    controller: new AbortController(),
  };

  activeCacheTasks.set(taskId, task);

  await recordEvent('cache-task-start', {
    taskId,
    label,
    total: task.total,
  });

  await sendTaskUpdate({
    taskId,
    label,
    status: 'running',
    total: task.total,
    completed: task.completed,
    failed: task.failed,
  });

  const cache = await caches.open(VIDEO_CACHE_NAME);

  for (const url of uniqueUrls) {
    if (task.aborted) break;

    try {
      const existing = await cache.match(url);
      if (existing) {
        task.completed += 1;
        await sendTaskUpdate({
          taskId,
          label,
          status: 'running',
          total: task.total,
          completed: task.completed,
          failed: task.failed,
          currentUrl: url,
          note: 'already-cached',
        });
        continue;
      }

      await sendTaskUpdate({
        taskId,
        label,
        status: 'running',
        total: task.total,
        completed: task.completed,
        failed: task.failed,
        currentUrl: url,
      });

      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        signal: task.controller.signal,
      });

      if (!(response.ok || response.status === 206)) {
        throw new Error(`Unexpected response ${response.status} for ${url}`);
      }

      const blob = await response.blob();

      await cache.put(
        url,
        new Response(blob, {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type':
              response.headers.get('Content-Type') || 'video/mp4',
            'Content-Length': blob.size.toString(),
            'Cache-Control': 'public, max-age=31536000',
          },
        }),
      );

      task.completed += 1;

      await recordEvent('video-cached', {
        taskId,
        label,
        url,
        sizeBytes: blob.size,
      });

      await sendTaskUpdate({
        taskId,
        label,
        status: 'running',
        total: task.total,
        completed: task.completed,
        failed: task.failed,
        currentUrl: url,
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        task.aborted = true;
        break;
      }

      task.failed += 1;

      const isQuotaError =
        error.name === 'QuotaExceededError' ||
        (typeof error.message === 'string' &&
          error.message.toLowerCase().includes('quota'));

      await recordEvent(
        isQuotaError ? 'cache-task-quota-error' : 'cache-task-error',
        {
          taskId,
          label,
          url,
          message: error.message,
        },
      );

      await sendTaskUpdate({
        taskId,
        label,
        status: 'running',
        total: task.total,
        completed: task.completed,
        failed: task.failed,
        currentUrl: url,
        error: error.message,
      });

      if (isQuotaError) {
        task.aborted = true;
        break;
      }
    }
  }

  const status = task.aborted
    ? 'aborted'
    : task.failed > 0
      ? 'error'
      : 'completed';

  const summary = {
    taskId,
    label,
    status,
    total: task.total,
    completed: task.completed,
    failed: task.failed,
  };

  await sendTaskUpdate(summary);
  await recordEvent('cache-task-complete', summary);

  activeCacheTasks.delete(taskId);
  return summary;
};

// Skip waiting and claim clients immediately
self.skipWaiting();
workbox.core.clientsClaim();

// Precache static assets (handled by next-pwa)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// ============================================
// VIDEO CACHING STRATEGY
// ============================================
const videoCacheStrategy = new CacheFirst({
  cacheName: VIDEO_CACHE_NAME,
  plugins: [
    new RangeRequestsPlugin(),
    new CacheableResponsePlugin({
      statuses: [0, 200, 206],
    }),
    new ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
  ],
});

registerRoute(
  ({ request, url }) =>
    request.destination === 'video' ||
    url.pathname.endsWith('.mp4') ||
    url.hostname.includes('digitaloceanspaces.com') ||
    url.hostname.includes('r2.dev'),
  videoCacheStrategy,
);

// ============================================
// IMAGES CACHING (separate avatar cache)
// ============================================
registerRoute(
  ({ request, url }) =>
    request.destination === 'image' &&
    url.pathname.includes('/assets/images/spieler-avatars/'),
  new CacheFirst({
    cacheName: IMAGE_AVATAR_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
      }),
    ],
  }),
);

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: IMAGES_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 300,
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
    cacheName: AUDIO_CACHE_NAME,
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
// GOOGLE FONTS CACHING
// ============================================
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: GOOGLE_FONTS_CSS_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60, // refresh CSS weekly
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: GOOGLE_FONTS_FILES_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year for static font binaries
      }),
    ],
  }),
);

// ============================================
// API RESPONSES (JSON data)
// ============================================
const apiFallbackNotifier = {
  async fetchDidFail({ request }) {
    await recordEvent('api-network-fallback', { url: request.url });
    await broadcastMessage({
      type: 'SW_TOAST',
      payload: {
        kind: 'warning',
        message: 'Zwischengespeicherte Daten werden angezeigt.',
        description: 'Verbindung zur API aktuell nicht verfügbar.',
        url: request.url,
      },
    });
  },
};

registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.includes('/data/'),
  new NetworkFirst({
    cacheName: API_CACHE_NAME,
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60,
      }),
      apiFallbackNotifier,
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
    cacheName: STATIC_ASSETS_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

// ============================================
// NAVIGATION (HTML pages)
// ============================================
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: PAGES_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 75,
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  }),
);

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await recordEvent('sw-install-start', { version: CACHE_VERSION });

      try {
        const pagesCache = await caches.open(PAGES_CACHE_NAME);
        const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
        const assetsCache = await caches.open(STATIC_ASSETS_CACHE_NAME);

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
          '/fortschritt/',
        ];

        const staticAssets = [
          '/manifest.json',
          '/assets/icons/android/icon-144.png',
          '/assets/icons/favicon.ico',
          '/assets/icons/favicon-32x32.png',
          '/assets/icons/favicon-16x16.png',
          '/assets/svg/FIFA_Logo.svg',
        ];

        for (const page of criticalPages) {
          try {
            await pagesCache.add(page);
          } catch (error) {
            await recordEvent('install-cache-miss', { page, message: error.message });
          }
        }

        try {
          await offlineCache.addAll([OFFLINE_URL, '/manifest.json']);
        } catch (error) {
          await recordEvent('install-offline-cache-miss', { message: error.message });
        }

        for (const asset of staticAssets) {
          try {
            await assetsCache.add(asset);
          } catch (error) {
            await recordEvent('install-asset-cache-miss', {
              asset,
              message: error.message,
            });
          }
        }

        await recordEvent('sw-install-success', {
          version: CACHE_VERSION,
          cachedPages: criticalPages.length,
          cachedAssets: staticAssets.length,
        });
      } catch (error) {
        await recordEvent('sw-install-failed', {
          version: CACHE_VERSION,
          message: error.message,
        });
        throw error;
      }
    })(),
  );

  self.skipWaiting();
});

// ============================================
// OFFLINE FALLBACK FOR NAVIGATION
// ============================================
setCatchHandler(async ({ event }) => {
  if (event.request.mode === 'navigate') {
    const pagesCache = await caches.open(PAGES_CACHE_NAME);
    const appShell = await pagesCache.match(APP_SHELL_URL);
    if (appShell) {
      await recordEvent('navigation-app-shell-fallback', {
        url: event.request.url,
      });
      return appShell;
    }

    const offlineCache = await caches.open(OFFLINE_CACHE_NAME);
    const offlineResponse = await offlineCache.match(OFFLINE_URL);
    if (offlineResponse) {
      await recordEvent('navigation-offline-fallback', {
        url: event.request.url,
      });
      return offlineResponse;
    }

    await recordEvent('navigation-generic-fallback', {
      url: event.request.url,
    });

    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>Offline</h1><p>Keine Verbindung verfügbar.</p></body></html>',
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      },
    );
  }

  const cachedResponse = await caches.match(event.request);
  if (cachedResponse) {
    await recordEvent('asset-fallback', { url: event.request.url });
    return cachedResponse;
  }

  await recordEvent('asset-miss', { url: event.request.url });
  return new Response('Network request failed and no cache available', {
    status: 503,
    statusText: 'Service Unavailable',
  });
});

// ============================================
// ACTIVATION EVENT
// ============================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const purged = [];

      try {
        if (self.registration.navigationPreload) {
          await self.registration.navigationPreload.enable();
          await recordEvent('navigation-preload-enabled');
        }

        const cacheWhitelist = [
          VIDEO_CACHE_NAME,
          IMAGES_CACHE_NAME,
          IMAGE_AVATAR_CACHE_NAME,
          AUDIO_CACHE_NAME,
          GOOGLE_FONTS_CSS_CACHE,
          GOOGLE_FONTS_FILES_CACHE,
          API_CACHE_NAME,
          STATIC_ASSETS_CACHE_NAME,
          PAGES_CACHE_NAME,
          OFFLINE_CACHE_NAME,
        ];

        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              await caches.delete(cacheName);
              purged.push(cacheName);
              await recordEvent('cache-purged', { cacheName });
            }
          }),
        );

        await self.clients.claim();
        await recordEvent('sw-activate-success', {
          version: CACHE_VERSION,
          purged,
        });
      } catch (error) {
        await recordEvent('sw-activate-failed', {
          version: CACHE_VERSION,
          message: error.message,
        });
      }
    })(),
  );
});

// ============================================
// MESSAGE HANDLING
// ============================================
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (data.type === 'CACHE_VIDEO_URLS') {
    const taskId =
      data.taskId || `cache-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    event.waitUntil(
      (async () => {
        const summary = await cacheVideoBatch({
          taskId,
          urls: data.urls,
          label: data.label,
        });

        if (event.source && 'postMessage' in event.source) {
          event.source.postMessage({
            type: 'CACHE_TASK_RESULT',
            payload: summary,
          });
        }
      })(),
    );
    return;
  }

  if (data.type === 'CACHE_VIDEO') {
    const url = normalizeVideoUrl(data.url);
    if (!url) return;

    const taskId =
      data.taskId ||
      `cache-single-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

    event.waitUntil(
      (async () => {
        const summary = await cacheVideoBatch({
          taskId,
          urls: [url],
          label: data.label || 'single-video',
        });

        if (event.source && 'postMessage' in event.source) {
          event.source.postMessage({
            type: 'CACHE_TASK_RESULT',
            payload: summary,
          });
        }
      })(),
    );
    return;
  }

  if (data.type === 'CANCEL_CACHE_TASK') {
    const taskId = data.taskId;
    if (!taskId) return;

    event.waitUntil(
      (async () => {
        const task = activeCacheTasks.get(taskId);
        if (task) {
          task.aborted = true;
          task.controller.abort();
          activeCacheTasks.delete(taskId);
          await recordEvent('cache-task-cancelled', {
            taskId,
            label: task.label,
          });
          await sendTaskUpdate({
            taskId,
            label: task.label,
            status: 'aborted',
            total: task.total,
            completed: task.completed,
            failed: task.failed,
          });
        }
      })(),
    );
    return;
  }

  if (data.type === 'CLEAR_CACHE') {
    const cacheName = data.cacheName || VIDEO_CACHE_NAME;
    event.waitUntil(
      (async () => {
        const deleted = await caches.delete(cacheName);
        await recordEvent('cache-cleared', { cacheName, deleted });
        await broadcastMessage({
          type: 'CACHE_CLEARED',
          payload: { cacheName, deleted },
        });
      })(),
    );
    return;
  }

  if (data.type === 'REQUEST_EVENT_LOG') {
    if (event.source && 'postMessage' in event.source) {
      event.source.postMessage({
        type: 'SW_EVENT_LOG',
        payload: recentSwEvents.slice(0, MAX_RECENT_SW_EVENTS),
      });
    }
  }
});

console.log(
  `🎥 Custom Service Worker loaded (cache version ${CACHE_VERSION})`,
);
