'use client';

import MainLayout from '@/components/layout/main-layout';
import { MobileFooterNav } from '@/components/layout/mobile-footer-nav';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FullscreenToggle } from '@/components/layout/fullscreen-toggle';
import { TwentyFirstToolbar } from '@21st-extension/toolbar-next';
import { ReactPlugin } from '@21st-extension/react';
import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ClientAppShell({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  if (!mounted) return null;

  return (
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
      <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />

      {/* Mobile footer navigation */}
      <MobileFooterNav />
    </ThemeProvider>
  );
}
