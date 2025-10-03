import createNextPWA from 'next-pwa';

const withPWA = createNextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  buildExcludes: [/middleware-manifest\.json$/],
  // Use custom service worker with advanced video caching
  swSrc: 'public/sw-custom.js',
  // Advanced Workbox configuration for video caching
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(mp4|webm|ogg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'video-cache-v1',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        rangeRequests: true, // Critical for video seeking
        cacheableResponse: {
          statuses: [0, 200, 206], // 206 = Partial Content
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.digitaloceanspaces\.com\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'digitalocean-video-cache-v1',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        rangeRequests: true,
        cacheableResponse: {
          statuses: [0, 200, 206],
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.r2\.dev\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'r2-video-cache-v1',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        rangeRequests: true,
        cacheableResponse: {
          statuses: [0, 200, 206],
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export mode for deployment to static hosting services
  output: 'export',
  trailingSlash: true,
  eslint: {
    // Allow builds to complete even when ESLint reports issues.
    // Consider re-enabling strict linting for CI or PR checks.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Disable filesystem cache temporarily to avoid webpack build issues
    config.cache = false;

    // Prevent bundling Node.js core modules into client builds
    // This avoids common webpack errors when some libs reference server-only APIs.
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        os: false,
        stream: false,
        buffer: false,
        util: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
        child_process: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  experimental: {
    turbo: {
      // Turbopack configuration to match webpack behavior
      // Note: Turbopack handles caching differently and more efficiently
      // The webpack cache=false workaround is not needed for Turbopack
    },
  },
};

export default withPWA(nextConfig);
