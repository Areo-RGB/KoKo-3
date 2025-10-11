'use client';

import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { sidebarSections, type SidebarSection } from './sidebar-links';

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  // Persisted collapsed state per section
  const [collapsed, setCollapsed] = React.useState<
    Record<SidebarSection['id'], boolean>
  >({
    navigation: false,
    daten: false,
    training: false,
    tools: false,
  });

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar_collapsed_sections');
      if (saved) setCollapsed((prev) => ({ ...prev, ...JSON.parse(saved) }));
    } catch {}
  }, []);

  const setSectionCollapsed = React.useCallback(
    (id: SidebarSection['id'], value: boolean) => {
      setCollapsed((prev) => {
        const next = { ...prev, [id]: value };
        try {
          localStorage.setItem(
            'sidebar_collapsed_sections',
            JSON.stringify(next),
          );
        } catch {}
        return next;
      });
    },
    [],
  );

  const toggleSection = React.useCallback(
    (id: SidebarSection['id']) => setSectionCollapsed(id, !collapsed[id]),
    [collapsed, setSectionCollapsed],
  );

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
        <span className="text-sidebar-foreground font-medium whitespace-pre">
          Hertha 03
        </span>
      )}
    </Link>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="[&_div[data-slot=sidebar-inner]]:bg-gradient-to-b [&_div[data-slot=sidebar-inner]]:from-[#0b2a55] [&_div[data-slot=sidebar-inner]]:via-[#052040]/95 [&_div[data-slot=sidebar-inner]]:to-[#010915] [&_div[data-slot=sidebar-inner]]:text-sky-100 [&_div[data-slot=sidebar-inner]]:border-r-transparent"
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections
          .map((section) => ({
            ...section,
            links: section.links,
          }))
          .filter((section) => section.links.length > 0)
          .map((section, index, arr) => {
            const isCollapsed = collapsed[section.id];
            return (
              <React.Fragment key={section.id}>
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <button
                      type="button"
                      className="text-sidebar-foreground/70 flex w-full items-center justify-between text-xs font-medium tracking-wider uppercase"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className="truncate text-left">
                        {section.label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                        aria-hidden
                      />
                    </button>
                  </SidebarGroupLabel>
                  {!isCollapsed && (
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {section.links.map((item) => {
                          const isActive = pathname === item.url;
                          return (
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={item.title}
                              >
                                <Link
                                  href={item.url}
                                  onClick={handleNavClick}
                                  aria-current={isActive ? 'page' : undefined}
                                >
                                  <item.icon className="h-5 w-5" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>
                {index < arr.length - 1 && <SidebarSeparator />}
              </React.Fragment>
            );
          })}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-1">
            {state === 'expanded' && (
              <span className="text-sidebar-foreground/60 ml-2 text-xs whitespace-pre">
                Hertha 03 Training
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <FullscreenToggle
              className="hover:bg-sidebar-accent p-1.5"
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
