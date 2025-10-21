'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full' | number;
  allowExpand?: boolean;
  showHandle?: boolean;
  className?: string;
  contentClassName?: string;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  allowExpand = true,
  showHandle = true,
  className,
  contentClassName,
}: MobileBottomSheetProps) {
  const [expandedHeight, setExpandedHeight] = useState<'half' | 'full'>('half');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Calculate height based on prop
  const getHeightValue = () => {
    if (typeof height === 'number') return `${height}px`;
    switch (height) {
      case 'half': return '50vh';
      case 'full': return '90vh';
      case 'auto': return expandedHeight === 'full' ? '85vh' : 'auto';
      default: return 'auto';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showHandle) return;
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sheetRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - startYRef.current;
    currentYRef.current = deltaY;

    if (deltaY > 0) {
      // Dragging down
      const newHeight = Math.max(0, sheetHeight - deltaY);
      sheetRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !sheetRef.current) return;
    setIsDragging(false);

    const threshold = 100; // pixels
    if (currentYRef.current > threshold) {
      // Close the sheet
      onClose();
    } else {
      // Snap back
      sheetRef.current.style.height = getHeightValue();
    }
    currentYRef.current = 0;
  };

  const toggleExpanded = () => {
    setExpandedHeight(prev => prev === 'half' ? 'full' : 'half');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Update sheet height when expanded state changes
  useEffect(() => {
    if (sheetRef.current && height === 'auto') {
      sheetRef.current.style.height = getHeightValue();
    }
  }, [expandedHeight, height]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:hidden"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'relative bg-background border-t border-border shadow-2xl',
          'transition-all duration-300 ease-out transform',
          'rounded-t-3xl max-h-[90vh] overflow-hidden',
          'w-full pb-[max(env(safe-area-inset-bottom),1rem)]',
          className
        )}
        style={{ height: getHeightValue() }}
      >
        {/* Handle */}
        {showHandle && (
          <div
            className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full cursor-grab active:cursor-grabbing" />
          </div>
        )}

        {/* Header */}
        {(title || allowExpand) && (
          <div className="flex items-center justify-between p-4 pt-8 border-b border-border">
            {title && (
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            )}
            <div className="flex items-center gap-2">
              {allowExpand && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleExpanded}
                  className="h-8 w-8"
                >
                  {expandedHeight === 'half' ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={cn(
            'flex-1 overflow-y-auto overscroll-contain',
            'px-4 py-0',
            contentClassName
          )}
          style={{
            maxHeight: 'calc(100% - 80px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}