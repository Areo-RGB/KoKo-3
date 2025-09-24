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
  webpack: (config) => {
    // Disable filesystem cache temporarily to avoid webpack build issues
    config.cache = false;
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

export default nextConfig;
