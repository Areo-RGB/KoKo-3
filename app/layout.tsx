import { FullscreenToggle } from '@/components/layout/fullscreen-toggle';
import MainLayout from '@/components/layout/main-layout';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata, Viewport } from 'next';
// Removed Google Fonts to avoid build-time network fetch
import 'plyr/dist/plyr.css';
import React from 'react';
import './globals.css';

// Using default system fonts; no next/font

export const metadata: Metadata = {
  title: 'Q.V - QuoVadis Sports Training',
  description:
    'Professional sports training platform with offline access to training materials, exercises, and performance tracking',
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

interface RootLayoutProps {
  children: React.ReactNode;
}

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
          href="/icons/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-16x16.png"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>
            <div className="flex min-h-screen w-full overflow-x-hidden">
              <div className="flex-1 min-w-0">
                <header className="flex h-16 items-center justify-between border-b py-3 pr-4 pl-0">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="ml-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <FullscreenToggle />
                    <ThemeToggle />
                  </div>
                </header>
                {children}
              </div>
            </div>
          </MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
