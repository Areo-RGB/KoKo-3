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

import { TwentyFirstToolbar } from '@21st-extension/toolbar-next';
import { ReactPlugin } from '@21st-extension/react';

import { MobileFooterNav } from '@/components/layout/mobile-footer-nav';

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
      <body className="body-surface">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>
            <div className="flex min-h-screen w-full overflow-x-hidden">
              <div className="app-content">
                <header className="app-header relative flex h-20 items-center justify-between rounded-bl-3xl rounded-tl-none border-b px-6 py-4">
                  <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-primary-foreground/80">
                    <SidebarTrigger className="sidebar-button bg-transparent text-primary-foreground/60" />
                    <span className="hidden text-xs font-semibold md:inline-flex">
                      QuoVadis Performance Hub
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FullscreenToggle className="sidebar-button bg-primary/10 px-3 py-2 text-primary-foreground transition-transform hover:-translate-y-0.5" />
                    <ThemeToggle className="sidebar-button bg-secondary/10 px-3 py-2 text-primary-foreground transition-transform hover:-translate-y-0.5" />
                  </div>
                </header>
                <div className="app-main-surface flex-1">
                  {children}
                </div>
              </div>
            </div>
          </MainLayout>
          <Toaster />
          <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />
        </ThemeProvider>
        {/* Mobile footer navigation */}
        <MobileFooterNav />
      </body>
    </html>
  );
}
