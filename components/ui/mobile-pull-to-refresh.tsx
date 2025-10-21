'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, ChevronDown } from 'lucide-react';

interface MobilePullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

export function MobilePullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className,
}: MobilePullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollableRef = useRef(true);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;

    const touch = e.touches[0];
    startYRef.current = touch.clientY;

    // Check if container is at the top
    const container = containerRef.current;
    if (container) {
      isScrollableRef.current = container.scrollTop > 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || !containerRef.current) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - startYRef.current;

    // Only allow pull to refresh when at the top
    if (isScrollableRef.current || deltaY <= 0) return;

    e.preventDefault();

    const resistance = 0.4; // Add resistance for natural feel
    const newPullDistance = Math.min(deltaY * resistance, threshold * 1.5);

    setPullDistance(newPullDistance);
    setIsPulling(true);
    setCanRefresh(newPullDistance >= threshold);

    currentYRef.current = currentY;
  };

  const handleTouchEnd = async () => {
    if (!isPulling || disabled || isRefreshing) return;

    setIsPulling(false);

    if (canRefresh && pullDistance >= threshold) {
      // Trigger refresh
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRefresh(false);
      }
    } else {
      // Snap back
      setPullDistance(0);
      setCanRefresh(false);
    }
  };

  // Reset state when refresh completes
  useEffect(() => {
    if (!isRefreshing && pullDistance > 0) {
      const timer = setTimeout(() => {
        setPullDistance(0);
        setCanRefresh(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isRefreshing, pullDistance]);

  const getIndicatorHeight = () => {
    if (isRefreshing) return threshold;
    return Math.min(pullDistance, threshold);
  };

  const getRotateDeg = () => {
    if (!isPulling) return 0;
    const progress = Math.min(pullDistance / threshold, 1);
    return progress * 180;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full overflow-y-auto overscroll-contain',
        disabled && 'overscroll-auto',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="relative flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          height: `${getIndicatorHeight()}px`,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        <div
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 backdrop-blur-sm border',
            'transition-all duration-200',
            canRefresh && 'bg-primary/10 border-primary/20'
          )}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Aktualisieren...
              </span>
            </>
          ) : (
            <>
              <ChevronDown
                className="h-4 w-4 transition-transform duration-200"
                style={{
                  transform: `rotate(${getRotateDeg()}deg)`,
                }}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {canRefresh ? 'Loslassen zum Aktualisieren' : 'Zum Aktualisieren ziehen'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}