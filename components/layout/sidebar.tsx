'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ThemeToggle } from '../theme/theme-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '../ui/sidebar';
import { FullscreenToggle } from './fullscreen-toggle';
import { sidebarSections } from './sidebar-links';
import { cn } from '@/lib/utils';

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ className, ...props }: AppSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();

  // Closes the sidebar on mobile after a navigation link is clicked.
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Renders the logo, which adapts to the sidebar's expanded/collapsed state.
  const Logo = () => (
    <Link
      href="/"
      className="text-sidebar-foreground relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <Image
        src="/assets/images/logo.png"
        alt="H03"
        width={24}
        height={24}
        className="h-6 w-6 shrink-0 dark:brightness-0 dark:invert dark:filter"
        style={{ height: 'auto' }}
      />
      {state === 'expanded' && (
        <span className="text-sidebar-foreground whitespace-pre font-medium">
          Hertha 03
        </span>
      )}
    </Link>
  );

  return (
    <Sidebar
      collapsible="icon"
      className={cn('sidebar-surface', className)}
      {...props}
    >
      <div className="sidebar-inner flex h-full flex-col">
        <SidebarHeader className="relative z-10">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="relative z-10 gap-4 pb-6 pt-2">
          {sidebarSections.map((section, index) =>
            section.links.length > 0 ? (
              <React.Fragment key={section.id}>
                <SidebarGroup className="space-y-3">
                  <SidebarGroupLabel className="sidebar-section-title">
                    {section.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-1">
                      {section.links.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            className="sidebar-button bg-black/5 text-sidebar-foreground/80 transition-colors hover:bg-black/10 hover:text-sidebar-foreground dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            <Link href={item.url} onClick={handleNavClick}>
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                {index < sidebarSections.length - 1 && <SidebarSeparator />}
              </React.Fragment>
            ) : null,
          )}
        </SidebarContent>
        <SidebarFooter className="sidebar-footer-surface relative z-10 mt-auto">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-2">
              {state === 'expanded' && (
                <div className="flex items-baseline gap-2 text-xs uppercase tracking-[0.3em] text-sidebar-foreground/70">
                  <span>Training</span>
                  <span className="sidebar-badge">IR-1</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <FullscreenToggle
                className="sidebar-button bg-black/5 p-2 text-sidebar-foreground transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                iconClassName="h-4 w-4"
              />
              <ThemeToggle className="sidebar-button bg-black/5 p-2 text-sidebar-foreground transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10" />
            </div>
          </div>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
