"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Trophy, Users, PlayCircle, GraduationCap } from 'lucide-react';
import React from 'react';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
  { href: '/spieler', label: 'Players', icon: Users },
  { href: '/video-player', label: 'Videos', icon: PlayCircle },
  { href: '/junioren', label: 'Junioren', icon: GraduationCap },
];

export function MobileFooterNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'pb-[max(env(safe-area-inset-bottom),0px)]',
        className
      )}
    >
      <div className="mx-4 mb-4">
        <nav
          className={cn(
            'bg-background/95 backdrop-blur-lg border border-border',
            'rounded-2xl shadow-lg',
            'px-2 py-2'
          )}
          aria-label="Primary mobile navigation"
        >
          <ul className="flex items-center justify-around">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center',
                      'px-3 py-2 rounded-xl transition-all duration-200',
                      'min-w-[60px] gap-1',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        isActive && 'scale-110'
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium transition-all duration-200',
                        isActive ? 'opacity-100' : 'opacity-70'
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
