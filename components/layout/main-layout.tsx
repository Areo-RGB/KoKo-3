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
      <div className="app-shell">
        <div aria-hidden className="app-shell__backdrop" />
        <AppSidebar className="sidebar-surface" />
        <SidebarInset className="relative z-10 min-w-0">
          <div className="flex w-full min-h-screen min-w-0 flex-1 flex-col">
            <main className="w-full flex-1 overflow-auto">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
