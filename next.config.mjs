import createNextPWA from 'next-pwa';

const withPWA = createNextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
  buildExcludes: [/middleware-manifest\.json$/],
  // Use custom service worker with advanced video caching
  // Note: When using swSrc, runtimeCaching should NOT be defined here
  // All caching strategies are configured in the custom sw-custom.js file
  swSrc: 'public/sw-custom.js',
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
