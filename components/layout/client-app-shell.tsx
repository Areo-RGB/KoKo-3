'use client';

import { FullscreenToggle } from '@/components/layout/fullscreen-toggle';
import MainLayout from '@/components/layout/main-layout';
import { MobileFooterNav } from '@/components/layout/mobile-footer-nav';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { TimerOverlay, TimerToggle } from '@/components/timer';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import React, { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ClientAppShell({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const existingRegistration =
          await navigator.serviceWorker.getRegistration();

        if (existingRegistration) {
          return existingRegistration;
        }

        return await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return undefined;
      }
    };

    registerServiceWorker()
      .then((registration) => {
        if (registration) {
          console.log('Service worker registered:', registration.scope);
        }
      })
      .catch((error) => {
        console.error('Service worker registration error:', error);
      });
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
          <div className="min-w-0 flex-1">
            <header className="flex h-16 items-center justify-between border-b py-3 pr-4 pl-0">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="ml-2" />
              </div>
              <div className="flex items-center gap-2">
                <TimerToggle onClick={() => setIsTimerOpen(true)} />
                <FullscreenToggle />
                <ThemeToggle />
              </div>
            </header>
            {children}
          </div>
        </div>
      </MainLayout>
      <Toaster />
      {/* Mobile footer navigation */}
      <MobileFooterNav />
      {/* Timer overlay */}
      <TimerOverlay
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />
    </ThemeProvider>
  );
}
