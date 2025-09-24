'use client';
import { Maximize } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import PWAUpdateButton from '../pwa-update-button';
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
import {
  datenLinks,
  juniorLinks,
  navigationLinks,
  toolsLinks,
  trainingToolsLinks,
} from './sidebar-links';

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();


  // Handle navigation click - close sidebar on mobile
  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Logo component for expanded state
  const Logo = () => {
    return (
      <Link
        href="/"
        className="text-sidebar-foreground relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
      >
        <Image
          src="/assets/images/logos/h03-logo.png"
          alt="H03"
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 dark:brightness-0 dark:invert dark:filter"
          style={{ height: 'auto' }}
        />
        {state === 'expanded' && (
          <span className="text-sidebar-foreground font-medium whitespace-pre">
            Hertha 03
          </span>
        )}
      </Link>
    );
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium tracking-wider uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((item) => (
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

        <SidebarSeparator />

        {/* Daten Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium tracking-wider uppercase">
            Daten
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {datenLinks.map((item) => (
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

        <SidebarSeparator />

        {/* Training Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium tracking-wider uppercase">
            Training
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {juniorLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>Trainingsvorlagen DFB</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Tools & Features Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium tracking-wider uppercase">
            Werkzeuge & Funktionen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {trainingToolsLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {toolsLinks.map((item) => (
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

        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-1">
            <PWAUpdateButton />
            {state === 'expanded' && (
              <span className="text-sidebar-foreground/60 text-xs whitespace-pre ml-2">
                Hertha 03 Training
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (document.fullscreenElement == null) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              aria-label="Vollbild umschalten"
              className="hover:bg-sidebar-accent rounded-full p-1.5 transition-colors"
            >
              <Maximize className="h-4 w-4" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
