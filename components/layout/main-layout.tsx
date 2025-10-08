'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import AppSidebar from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // The 'mounted' check is no longer necessary with modern next-themes.
  // The ThemeProvider handles preventing hydration mismatches internally.

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[100svh] w-full overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <div className="bg-background flex w-full min-w-0 flex-1 flex-col">
            <main className="w-full flex-1 overflow-auto pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
