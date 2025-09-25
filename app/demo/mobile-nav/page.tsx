"use client";

import React, { useState } from 'react';
import { Home, Search, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface MobileBottomNavigationProps {
  activeItem?: string;
  onItemClick?: (href: string) => void;
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/categories', icon: Grid3X3, label: 'Categories' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/account', icon: User, label: 'Account' },
];

const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeItem = '/',
  onItemClick = () => {},
  className,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'pb-safe-area-inset-bottom',
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
        >
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.href;

              return (
                <button
                  key={item.href}
                  onClick={() => onItemClick(item.href)}
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
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

const MobileBottomNavigationExample: React.FC = () => {
  const [activeItem, setActiveItem] = useState('/');

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    console.log(`Navigating to: ${href}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mobile Bottom Navigation Demo</h1>
        <p className="text-muted-foreground mb-4">
          Current active item: <span className="font-medium text-foreground">{activeItem}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          The navigation is only visible on mobile screens (hidden on md+ breakpoints). Try clicking the navigation items at the bottom.
        </p>
      </div>

      <MobileBottomNavigation activeItem={activeItem} onItemClick={handleItemClick} />
    </div>
  );
};

export default MobileBottomNavigationExample;
