import type { Metadata, Viewport } from 'next';
// Removed Google Fonts to avoid build-time network fetch
import 'plyr/dist/plyr.css';
import React from 'react';
import Script from 'next/script';
import './globals.css';

// Using default system fonts; no next/font

export const metadata: Metadata = {
  title: 'Q.V - QuoVadis Sports Training',
  description:
    'Professional sports training platform with offline access to training materials, exercises, and performance tracking',
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
  },
  applicationName: 'QuoVadis Sports Training',
  keywords: [
    'sports',
    'training',
    'soccer',
    'football',
    'youth',
    'fitness',
    'offline',
  ],
  authors: [{ name: 'QuoVadis Sports' }],
  creator: 'QuoVadis Sports',
  publisher: 'QuoVadis Sports',
  category: 'sports',
  icons: {
    icon: [
      {
        rel: 'icon',
        url: '/assets/icons/favicon-32x32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        url: '/assets/icons/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
      { rel: 'icon', url: '/favicon.ico' },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        url: '/assets/icons/ios/apple-touch-icon-180x180.png',
        sizes: '180x180',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QuoVadis Sports Training',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

import ClientAppShell from '@/components/layout/client-app-shell';

interface RootLayoutProps {
  children: React.ReactNode;
}

// Client-only shell is imported directly; it renders nothing on server

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/icons/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/icons/ios/apple-touch-icon-180x180.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* React Grab - Development only */}
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
            data-enabled="true"
          />
        )}
      </head>
      <body>
        <ClientAppShell>{children}</ClientAppShell>
      </body>
    </html>
  );
}
