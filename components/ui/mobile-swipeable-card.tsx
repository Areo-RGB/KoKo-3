'use client';

import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileSwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  disabled?: boolean;
  threshold?: number;
  resistance?: number;
}

export function MobileSwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
  disabled = false,
  threshold = 50,
  resistance = 0.6,
}: MobileSwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const lastXRef = useRef(0);
  const timestampRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    startXRef.current = touch.clientX - translateX;
    currentXRef.current = touch.clientX;
    lastXRef.current = touch.clientX;
    timestampRef.current = Date.now();
    setIsDragging(true);
    setVelocity(0);

    // Cancel any ongoing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [disabled, translateX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const deltaX = currentX - startXRef.current;

    // Apply resistance for natural feel
    const resistanceFactor = Math.abs(deltaX) > 100 ? resistance : 1;
    const newTranslateX = deltaX * resistanceFactor;

    // Limit the drag distance
    const maxTranslate = 150;
    const clampedTranslate = Math.max(-maxTranslate, Math.min(maxTranslate, newTranslateX));

    setTranslateX(clampedTranslate);
    currentXRef.current = currentX;

    // Calculate velocity for momentum
    const now = Date.now();
    const deltaTime = now - timestampRef.current;
    const deltaPosition = currentX - lastXRef.current;

    if (deltaTime > 0) {
      setVelocity(deltaPosition / deltaTime);
    }

    lastXRef.current = currentX;
    timestampRef.current = now;
  }, [isDragging, disabled, resistance]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return;

    setIsDragging(false);

    // Determine swipe action based on velocity and position
    const absVelocity = Math.abs(velocity);
    const absTranslate = Math.abs(translateX);
    const shouldSwipe = absVelocity > 0.5 || absTranslate > threshold;

    if (shouldSwipe) {
      if (translateX > 0 && onSwipeRight) {
        onSwipeRight();
        animateReset(1);
      } else if (translateX < 0 && onSwipeLeft) {
        onSwipeLeft();
        animateReset(-1);
      } else {
        animateReset(0);
      }
    } else {
      animateReset(0);
    }
  }, [isDragging, disabled, velocity, translateX, threshold, onSwipeLeft, onSwipeRight]);

  const animateReset = useCallback((direction: number) => {
    const startTranslate = translateX;
    const startTime = performance.now();
    const duration = 300;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for natural bounce back
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const bounceDirection = direction === 0 ? 0 : direction * 20 * Math.sin(progress * Math.PI);

      const newTranslate = startTranslate * (1 - easeOut) + bounceDirection;
      setTranslateX(newTranslate);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setTranslateX(0);
        setVelocity(0);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [translateX]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        'relative touch-pan-y',
        isDragging && 'cursor-grabbing',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual swipe indicators */}
      {isDragging && (
        <div className="absolute inset-y-0 flex items-center pointer-events-none">
          {translateX > 30 && (
            <ChevronLeft className="absolute left-4 h-8 w-8 text-primary animate-pulse" />
          )}
          {translateX < -30 && (
            <ChevronRight className="absolute right-4 h-8 w-8 text-primary animate-pulse" />
          )}
        </div>
      )}

      {children}
    </div>
  );
}