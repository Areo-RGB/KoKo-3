/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  // Enable static export mode for deployment to static hosting services
  output: 'export',
  trailingSlash: true,
  // Specify turbopack root directory to prevent lock file detection issues
  turbopack: {
    root: __dirname,
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
};

export default nextConfig;
