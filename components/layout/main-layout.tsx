'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import AppSidebar from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // The 'mounted' check is no longer necessary with modern next-themes and React 19.
  // The ThemeProvider handles preventing hydration mismatches internally.

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-x-hidden">
        <AppSidebar />
        {/* No extra spacing between sidebar and content */}
        <SidebarInset className="min-w-0">
          {/* Use theme tokens for background to match timeline design */}
          <div className="bg-background flex w-full min-w-0 flex-1 flex-col gap-2 p-0">
            <div className="w-full flex-1 overflow-auto">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
