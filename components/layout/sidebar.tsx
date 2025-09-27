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
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '../ui/sidebar';
import { FullscreenToggle } from './fullscreen-toggle';
import { sidebarSections, type SidebarSection } from './sidebar-links';
import { ChevronDown, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export default function AppSidebar({ ...props }: AppSidebarProps) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  // Search/filter state
  const [query, setQuery] = React.useState('');

  // Persisted collapsed state per section
  const [collapsed, setCollapsed] = React.useState<Record<SidebarSection['id'], boolean>>({
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
          localStorage.setItem('sidebar_collapsed_sections', JSON.stringify(next));
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
        <span className="text-sidebar-foreground whitespace-pre font-medium">
          Hertha 03
        </span>
      )}
    </Link>
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5">
          <Logo />
        </div>
        {/* Quick search */}
        <div className="px-2 pb-1">
          <div className="relative">
            <SidebarInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={state === 'expanded' ? 'Suchen… /' : 'Suchen…'}
              aria-label="Navigation filtern"
              className="pl-8"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections
          .map((section) => ({
            ...section,
            links: query
              ? section.links.filter((l) =>
                  l.title.toLowerCase().includes(query.toLowerCase()),
                )
              : section.links,
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
                      className="text-sidebar-foreground/70 text-xs font-medium uppercase tracking-wider flex w-full items-center justify-between"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className="truncate text-left">{section.label}</span>
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
                              <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
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
