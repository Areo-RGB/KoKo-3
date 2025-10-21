'use client';

import { sidebarSections } from '@/components/layout/sidebar-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Home, LayoutDashboard, PlayCircle, Timer, Trophy, Dumbbell, Target, GraduationCap } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  color?: string;
}

const MOBILE_NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/video-player',
    label: 'Videos',
    icon: PlayCircle,
    badge: 'NEW',
  },
  {
    href: '/interval-timer',
    label: 'Timer',
    icon: Timer,
  },
  {
    href: '/junioren',
    label: 'Junioren',
    icon: GraduationCap,
  },
];

interface MobileFooterNavEnhancedProps {
  className?: string;
  showActiveIndicator?: boolean;
  allowSwipe?: boolean;
}

export function MobileFooterNavEnhanced({
  className,
  showActiveIndicator = true,
  allowSwipe = true
}: MobileFooterNavEnhancedProps) {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Find current active index
  useEffect(() => {
    const currentIndex = MOBILE_NAV_ITEMS.findIndex(item => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    });

    if (currentIndex !== -1 && currentIndex !== activeIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(currentIndex);
        setIsTransitioning(false);
      }, 150);
    }
  }, [pathname, activeIndex]);

  const handleSwipeStart = (e: React.TouchEvent) => {
    if (!allowSwipe) return;
    startXRef.current = e.touches[0].clientX;
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    if (!allowSwipe) return;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleSwipeEnd = () => {
    if (!allowSwipe) return;

    const deltaX = currentXRef.current - startXRef.current;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      let newIndex = activeIndex;

      if (deltaX > 0 && activeIndex > 0) {
        // Swipe right - go to previous
        newIndex = activeIndex - 1;
      } else if (deltaX < 0 && activeIndex < MOBILE_NAV_ITEMS.length - 1) {
        // Swipe left - go to next
        newIndex = activeIndex + 1;
      }

      if (newIndex !== activeIndex) {
        setIsTransitioning(true);
        setTimeout(() => {
          window.location.href = MOBILE_NAV_ITEMS[newIndex].href;
        }, 150);
      }
    }
  };

  const handleNavClick = (href: string, index: number) => {
    if (index === activeIndex) return;

    setIsTransitioning(true);
    // Navigation will happen via Next.js Link
  };

  return (
    <>
      {/* Navigation Container */}
      <nav
        ref={containerRef}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 md:hidden',
          'bg-background/95 backdrop-blur-lg border-t border-border/50',
          'min-h-[calc(3.5rem+env(safe-area-inset-bottom,0px))]',
          'pb-[env(safe-area-inset-bottom,0px)]',
          'transition-all duration-300',
          className
        )}
        onTouchStart={handleSwipeStart}
        onTouchMove={handleSwipeMove}
        onTouchEnd={handleSwipeEnd}
      >
        {/* Active Indicator */}
        {showActiveIndicator && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div
              className="absolute top-0 h-full bg-primary transition-all duration-300 ease-out"
              style={{
                width: `${100 / MOBILE_NAV_ITEMS.length}%`,
                left: `${(activeIndex * 100) / MOBILE_NAV_ITEMS.length}%`,
                transform: isTransitioning ? 'scaleX(0.8)' : 'scaleX(1)',
              }}
            />
          </div>
        )}

        {/* Navigation Items */}
        <ul className="flex h-full items-stretch justify-around relative">
          {MOBILE_NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="flex-1 relative">
                <Link
                  href={item.href}
                  onClick={() => handleNavClick(item.href, index)}
                  className={cn(
                    'flex h-full w-full flex-col items-center justify-center',
                    'relative transition-all duration-200 ease-out',
                    'py-2 px-1 min-h-[44px]', // iOS touch target
                    'group touch-manipulation',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                    isTransitioning && index === activeIndex && 'scale-95'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Icon Container */}
                  <div className="relative mb-1">
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-all duration-200',
                        isActive && 'scale-110',
                        !isActive && 'group-hover:scale-105'
                      )}
                    />

                    {/* Badge */}
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {/* Active Ripple */}
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs font-medium transition-all duration-200',
                      isActive && 'font-semibold',
                      !isActive && 'group-hover:font-medium'
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Touch Feedback Layer */}
                  <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-active:opacity-100 transition-opacity" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Swipe Hint Animation */}
        {allowSwipe && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 animate-bounce">
            <div className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
              ← Swipe to navigate →
            </div>
          </div>
        )}
      </nav>

      {/* Add safe area padding for content */}
      <div className="h-16 md:h-0" />
    </>
  );
}