// Modernized Service Worker for QuoVadis Sports Training
// Implements updated caching strategies with Workbox 7 for resilient offline support

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

if (!self.workbox) {
  console.warn('Workbox konnte nicht geladen werden. Offline-Funktionen eingeschränkt.');
}

const {
  core,
  precaching,
  routing,
  strategies,
  expiration,
  cacheableResponse,
  broadcastUpdate,
  recipes,
  rangeRequests,
} = self.workbox || {};

const APP_VERSION = '2025-10-09';
const CACHE_PREFIX = 'quo-vadis';
const MEDIA_CACHE = `${CACHE_PREFIX}-media-${APP_VERSION}`;
const PAGE_CACHE = `${CACHE_PREFIX}-pages-${APP_VERSION}`;
const STATIC_CACHE = `${CACHE_PREFIX}-static-${APP_VERSION}`;
const DATA_CACHE = `${CACHE_PREFIX}-data-${APP_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images-${APP_VERSION}`;
const FALLBACK_CACHE = `${CACHE_PREFIX}-fallback-${APP_VERSION}`;

const RUNTIME_CACHES = new Set([
  MEDIA_CACHE,
  PAGE_CACHE,
  STATIC_CACHE,
  DATA_CACHE,
  IMAGE_CACHE,
  FALLBACK_CACHE,
]);

const FALLBACK_PAGE = '/offline/';
const PREFETCHABLE_ROUTES = ['/', '/offline/', '/cache/'];

let defaultStaticStrategy = null;

if (core) {
  core.setCacheNameDetails({ prefix: CACHE_PREFIX, suffix: APP_VERSION });
  core.skipWaiting();
  core.clientsClaim();
  if (core.LOG_LEVELS) {
    core.setLogLevel(core.LOG_LEVELS.silent);
  }
  if (strategies && expiration) {
    const basePlugins = [
      new expiration.ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ];
    defaultStaticStrategy = new strategies.StaleWhileRevalidate({
      cacheName: STATIC_CACHE,
      plugins: basePlugins,
    });
    if (routing && defaultStaticStrategy) {
      routing.setDefaultHandler(defaultStaticStrategy);
    }
  }
  if (core.navigationPreload) {
    core.navigationPreload.enable();
  }
}

if (precaching) {
  precaching.precacheAndRoute(self.__WB_MANIFEST ?? []);
}

const { registerRoute, setCatchHandler } = routing || {};
const { NetworkFirst, StaleWhileRevalidate, CacheFirst } = strategies || {};
const { ExpirationPlugin } = expiration || {};
const { CacheableResponsePlugin } = cacheableResponse || {};
const { BroadcastUpdatePlugin } = broadcastUpdate || {};
const { RangeRequestsPlugin } = rangeRequests || {};
const { offlineFallback, warmStrategyCache } = recipes || {};

const navigationStrategy = NetworkFirst
  ? new NetworkFirst({
      cacheName: PAGE_CACHE,
      networkTimeoutSeconds: 8,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 80,
          maxAgeSeconds: 24 * 60 * 60,
        }),
      ],
    })
  : null;

if (registerRoute && navigationStrategy) {
  registerRoute(({ request }) => request.mode === 'navigate', navigationStrategy);
}

if (warmStrategyCache && navigationStrategy) {
  warmStrategyCache({ urls: PREFETCHABLE_ROUTES, strategy: navigationStrategy });
}

if (offlineFallback) {
  offlineFallback({ pageFallback: FALLBACK_PAGE });
}

if (registerRoute && StaleWhileRevalidate) {
  const staticRuntimePlugins = [];
  if (BroadcastUpdatePlugin) {
    staticRuntimePlugins.push(new BroadcastUpdatePlugin());
  }
  if (ExpirationPlugin) {
    staticRuntimePlugins.push(
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    );
  }

  registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'worker',
    new StaleWhileRevalidate({
      cacheName: STATIC_CACHE,
      plugins: staticRuntimePlugins,
    }),
  );

  registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({
      cacheName: IMAGE_CACHE,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 240,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );

  registerRoute(
    ({ url }) =>
      url.pathname.startsWith('/api/') ||
      url.pathname.endsWith('.json') ||
      url.pathname.includes('/data/'),
    new NetworkFirst({
      cacheName: DATA_CACHE,
      networkTimeoutSeconds: 6,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 5 * 60,
        }),
      ],
    }),
  );

  registerRoute(
    ({ request, url }) => {
      const destination = request.destination;
      if (destination === 'video' || destination === 'audio') return true;
      return /\.(mp4|webm|m3u8|mp3|wav|ogg)(\?.*)?$/i.test(url.pathname);
    },
    new CacheFirst({
      cacheName: MEDIA_CACHE,
      plugins: [
        new RangeRequestsPlugin(),
        new CacheableResponsePlugin({ statuses: [0, 200, 206] }),
        new ExpirationPlugin({
          maxEntries: 90,
          maxAgeSeconds: 45 * 24 * 60 * 60,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );
}

if (setCatchHandler) {
  setCatchHandler(async ({ request }) => {
    if (request.destination === 'document') {
      const cached = await caches.match(FALLBACK_PAGE, {
        cacheName: FALLBACK_CACHE,
      });
      if (cached) return cached;
      return caches.match(FALLBACK_PAGE) ?? Response.error();
    }

    if (request.destination === 'image') {
      return Response.error();
    }

    return Response.error();
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const fallbackCache = await caches.open(FALLBACK_CACHE);
      await fallbackCache.addAll(PREFETCHABLE_ROUTES);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const precacheName = core ? core.cacheNames.precache : null;
      const runtimeAllowlist = new Set([...RUNTIME_CACHES]);
      if (precacheName) {
        runtimeAllowlist.add(precacheName);
      }

      await Promise.all(
        keys.map(async (key) => {
          if (!key.startsWith(CACHE_PREFIX)) return;
          if (!runtimeAllowlist.has(key)) {
            await caches.delete(key);
          }
        }),
      );

      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: 'CACHE_VERSION', payload: { version: APP_VERSION } });
      }
    })(),
  );
});

const prefetchTasks = new Map();

const uniqueUrls = (urls = []) => {
  const seen = new Set();
  const cleaned = [];
  for (const raw of urls) {
    if (typeof raw !== 'string') continue;
    try {
      const normalized = new URL(raw, self.registration.scope).toString();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        cleaned.push(normalized);
      }
    } catch (error) {
      // ignore invalid URLs
    }
  }
  return cleaned;
};

const notifyClients = async (message) => {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  for (const client of clients) {
    client.postMessage(message);
  }
};

const responseSize = async (response) => {
  const header = response.headers.get('content-length');
  if (header) {
    const parsed = Number(header);
    if (!Number.isNaN(parsed)) return parsed;
  }
  try {
    const blob = await response.clone().blob();
    return blob.size;
  } catch (error) {
    return 0;
  }
};

const estimateMediaCacheUsage = async (cache, keys) => {
  let totalBytes = 0;
  for (const request of keys) {
    const response = await cache.match(request);
    if (!response) continue;
    totalBytes += await responseSize(response);
  }
  return { entryCount: keys.length, totalBytes };
};

const sendCacheSummary = async () => {
  const summary = [];
  for (const cacheName of RUNTIME_CACHES) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    let totalBytes = null;
    if (cacheName === MEDIA_CACHE) {
      const mediaUsage = await estimateMediaCacheUsage(cache, keys);
      totalBytes = mediaUsage.totalBytes;
      summary.push({
        cacheName,
        entryCount: mediaUsage.entryCount,
        totalBytes,
        kind: 'media',
        sampleUrls: keys.slice(0, 5).map((request) => request.url),
      });
      continue;
    }

    summary.push({
      cacheName,
      entryCount: keys.length,
      totalBytes,
      kind: cacheName.includes('pages')
        ? 'pages'
        : cacheName.includes('static')
          ? 'static'
          : cacheName.includes('data')
            ? 'data'
            : cacheName.includes('image')
              ? 'images'
              : 'fallback',
      sampleUrls: keys.slice(0, 5).map((request) => request.url),
    });
  }

  await notifyClients({
    type: 'CACHE_SUMMARY',
    payload: {
      generatedAt: Date.now(),
      caches: summary,
    },
  });
};

const runPrefetchTask = async ({ taskId, urls, label }) => {
  const list = uniqueUrls(urls);
  if (!list.length) {
    await notifyClients({
      type: 'PREFETCH_VIDEOS_UPDATE',
      payload: {
        taskId,
        label,
        status: 'idle',
        total: 0,
        completed: 0,
        failed: 0,
      },
    });
    return;
  }

  const controller = new AbortController();
  const cache = await caches.open(MEDIA_CACHE);

  const state = {
    taskId,
    label,
    status: 'running',
    total: list.length,
    completed: 0,
    failed: 0,
    bytesDownloaded: 0,
    startedAt: Date.now(),
    controller,
  };

  prefetchTasks.set(taskId, state);

  await notifyClients({ type: 'PREFETCH_VIDEOS_UPDATE', payload: state });

  for (const url of list) {
    if (state.controller.signal.aborted) break;

    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
      });

      if (!response.ok && response.status !== 206) {
        throw new Error(`Unerwarteter Status ${response.status}`);
      }

      const cachedResponse = response.clone();
      await cache.put(url, cachedResponse);
      const size = await responseSize(response);
      state.bytesDownloaded += size;
      state.completed += 1;

      await notifyClients({
        type: 'PREFETCH_VIDEOS_UPDATE',
        payload: {
          ...state,
          currentUrl: url,
        },
      });
    } catch (error) {
      if (controller.signal.aborted) {
        break;
      }

      state.failed += 1;
      await notifyClients({
        type: 'PREFETCH_VIDEOS_UPDATE',
        payload: {
          ...state,
          error: error?.message ?? 'Unbekannter Fehler',
          currentUrl: url,
        },
      });
    }
  }

  if (controller.signal.aborted) {
    state.status = 'aborted';
  } else if (state.failed > 0) {
    state.status = 'error';
  } else {
    state.status = 'completed';
  }

  state.finishedAt = Date.now();
  prefetchTasks.delete(taskId);

  await notifyClients({ type: 'PREFETCH_VIDEOS_UPDATE', payload: state });
  await sendCacheSummary();
};

const abortPrefetchTask = async (taskId) => {
  const task = prefetchTasks.get(taskId);
  if (!task) return;
  task.controller.abort();
  prefetchTasks.delete(taskId);
  await notifyClients({
    type: 'PREFETCH_VIDEOS_UPDATE',
    payload: {
      taskId,
      label: task.label,
      status: 'aborted',
      total: task.total,
      completed: task.completed,
      failed: task.failed,
      bytesDownloaded: task.bytesDownloaded,
      finishedAt: Date.now(),
    },
  });
};

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  switch (data.type) {
    case 'REQUEST_CACHE_SUMMARY': {
      event.waitUntil(sendCacheSummary());
      break;
    }
    case 'PREFETCH_VIDEOS': {
      const taskId =
        data.taskId || `prefetch-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      const payload = {
        taskId,
        urls: Array.isArray(data.urls) ? data.urls : [],
        label: data.label ?? 'videos',
      };
      event.waitUntil(runPrefetchTask(payload));
      break;
    }
    case 'ABORT_PREFETCH': {
      if (data.taskId) {
        event.waitUntil(abortPrefetchTask(data.taskId));
      }
      break;
    }
    case 'CLEAR_MEDIA_CACHE': {
      event.waitUntil(
        (async () => {
          await caches.delete(MEDIA_CACHE);
          await sendCacheSummary();
          await notifyClients({
            type: 'CACHE_CLEARED',
            payload: { cacheName: MEDIA_CACHE, clearedAt: Date.now() },
          });
        })(),
      );
      break;
    }
    default: {
      break;
    }
  }
});

console.log(`⚽️ QuoVadis Service Worker aktiv – Version ${APP_VERSION}`);
