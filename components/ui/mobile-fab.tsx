'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Plus, X, ChevronUp } from 'lucide-react';

interface MobileFabAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'destructive';
}

interface MobileFabProps {
  icon?: React.ReactNode;
  actions: MobileFabAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function MobileFab({
  icon = <Plus className="h-5 w-5" />,
  actions,
  position = 'bottom-right',
  size = 'md',
  className,
  label,
}: MobileFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleFabClick = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: MobileFabAction) => {
    action.onClick();
    setIsOpen(false);
  };

  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-fab-container]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Auto-close after inactivity
  useEffect(() => {
    if (isOpen) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  const getPositionClasses = () => {
    const base = 'fixed z-50 md:hidden';
    const positions = {
      'bottom-right': 'bottom-20 right-4',
      'bottom-left': 'bottom-20 left-4',
      'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2',
    };
    return `${base} ${positions[position]} pb-[max(env(safe-area-inset-bottom),1rem)]`;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'h-12 w-12',
      md: 'h-14 w-14',
      lg: 'h-16 w-16',
    };
    return sizes[size];
  };

  const getActionSizeClasses = () => {
    const sizes = {
      sm: 'h-10 w-10',
      md: 'h-12 w-12',
      lg: 'h-14 w-14',
    };
    return sizes[size];
  };

  const getActionColors = (color?: MobileFabAction['color']) => {
    const colors = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };
    return colors[color || 'primary'];
  };

  return (
    <div data-fab-container className={cn(getPositionClasses(), className)}>
      {/* Action Labels */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 flex flex-col gap-2 items-end">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: '200ms',
                animationFillMode: 'both',
              }}
            >
              <span className="bg-popover text-popover-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-lg border">
                {action.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 flex flex-col gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.id}
              size="icon"
              onClick={() => handleActionClick(action)}
              className={cn(
                'shadow-lg border-2 border-background',
                getActionSizeClasses(),
                getActionColors(action.color),
                'animate-in slide-in-from-bottom-2 fade-in'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                animationDuration: '200ms',
                animationFillMode: 'both',
              }}
            >
              {action.icon}
            </Button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <Button
        size="icon"
        onClick={handleFabClick}
        className={cn(
          'shadow-lg border-2 border-background',
          getSizeClasses(),
          'transition-all duration-300 ease-out',
          isOpen && 'rotate-45',
          'bg-primary text-primary-foreground hover:bg-primary/90'
        )}
        aria-label={label || 'Open actions'}
      >
        {isOpen ? <X className="h-5 w-5" /> : icon}
      </Button>

      {/* Mini indicator when closed */}
      {!isOpen && actions.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold animate-pulse">
          {actions.length}
        </div>
      )}
    </div>
  );
}