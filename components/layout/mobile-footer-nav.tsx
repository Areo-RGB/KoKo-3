'use client';

import { sidebarSections } from '@/components/layout/sidebar-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The navigation items are now dynamically generated from a single source of truth.
const NAV_ITEMS = sidebarSections
  .flatMap((section) => section.links)
  .filter((link) => link.showOnMobile)
  .map((link) => ({
    href: link.url,
    label: link.mobileLabel ?? link.title,
    icon: link.icon,
  }));

export function MobileFooterNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* Spacer to prevent content from appearing underneath the fixed footer */}
      <div
        className="md:hidden"
        aria-hidden="true"
        style={{ height: 'calc(56px + env(safe-area-inset-bottom))' }}
      />

      <nav
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 md:hidden',
          'bg-background border-border border-t',
          // Account for iOS home indicator area without adding visual margins
          'pb-[max(env(safe-area-inset-bottom),0px)]',
          'h-14',
          className,
        )}
        aria-label="Primary mobile navigation"
      >
        <ul className={cn('flex h-full items-stretch justify-around')}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-full w-full flex-col items-center justify-center',
                    'transition-colors duration-200',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
