import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Awesome App',
    short_name: 'AwesomeApp',
    description: 'An awesome app built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/assets/icons/android/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/assets/icons/android/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/assets/icons/android/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/assets/icons/android/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}