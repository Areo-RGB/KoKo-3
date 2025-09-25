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

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ ...props }: AppSidebarProps) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections.map((section, index) =>
          section.links.length > 0 ? (
            <React.Fragment key={section.id}>
              <SidebarGroup>
                <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider">
                  {section.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.links.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
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
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-1">
            {state === 'expanded' && (
              <span className="text-sidebar-foreground/60 ml-2 whitespace-pre text-xs">
                Hertha 03 Training
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <FullscreenToggle
              className="p-1.5 hover:bg-sidebar-accent"
              iconClassName="h-4 w-4"
            />
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
