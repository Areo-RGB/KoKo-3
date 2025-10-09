'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import AppSidebar from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
  header: ReactNode;
}

export default function MainLayout({ children, header }: MainLayoutProps) {
  // The 'mounted' check is no longer necessary with modern next-themes.
  // The ThemeProvider handles preventing hydration mismatches internally.

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[100svh] w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-col">
          {header}
          <main className="bg-background w-full flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
