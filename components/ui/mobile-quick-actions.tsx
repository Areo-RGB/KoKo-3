'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';
import {
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Bookmark,
  Download,
  MoreVertical
} from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'ghost';
  active?: boolean;
  disabled?: boolean;
}

interface MobileQuickActionsProps {
  actions: QuickAction[];
  layout?: 'horizontal' | 'grid' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function MobileQuickActions({
  actions,
  layout = 'horizontal',
  size = 'md',
  showLabels = true,
  className,
}: MobileQuickActionsProps) {
  const [pressedAction, setPressedAction] = useState<string | null>(null);

  const handleActionPress = (actionId: string, action: QuickAction) => {
    setPressedAction(actionId);

    // Add haptic feedback simulation (visual)
    const button = document.getElementById(`action-${actionId}`);
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        setPressedAction(null);
      }, 150);
    }

    action.onClick();
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'h-10 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-14 px-6 text-lg',
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };
    return sizes[size];
  };

  const getLayoutClasses = () => {
    const layouts = {
      horizontal: 'flex gap-2',
      grid: 'grid grid-cols-2 gap-2',
      stacked: 'flex flex-col gap-2',
    };
    return layouts[layout];
  };

  const getButtonVariant = (action: QuickAction) => {
    if (action.disabled) return 'ghost';
    if (action.active) return 'default';
    return action.variant || 'ghost';
  };

  return (
    <Card className={cn('p-3 border-0 shadow-sm', className)}>
      <div className={cn(getLayoutClasses())}>
        {actions.map((action) => (
          <Button
            key={action.id}
            id={`action-${action.id}`}
            variant={getButtonVariant(action)}
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
            onClick={() => handleActionPress(action.id, action)}
            disabled={action.disabled}
            className={cn(
              'relative overflow-hidden transition-all duration-200',
              'min-w-[44px] min-h-[44px]', // iOS touch target minimum
              'active:scale-95', // Touch feedback
              'touch-manipulation', // Optimize for touch
              action.active && 'bg-primary text-primary-foreground',
              pressedAction === action.id && 'scale-95'
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn('transition-transform duration-200', getIconSize())}>
                {action.icon}
              </div>
              {showLabels && layout !== 'stacked' && (
                <span className="font-medium truncate">
                  {action.label}
                </span>
              )}
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 -z-10">
              <div
                className={cn(
                  'absolute inset-0 bg-white/20 rounded-full',
                  'transform scale-0 animate-ping',
                  pressedAction === action.id && 'scale-100'
                )}
              />
            </div>
          </Button>
        ))}
      </div>

      {/* Stacked layout with labels */}
      {layout === 'stacked' && showLabels && (
        <div className="mt-2 space-y-1">
          {actions.map((action) => (
            <div
              key={`${action.id}-label`}
              className="text-xs text-muted-foreground text-center"
            >
              {action.label}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Predefined action sets for common use cases
export const VideoPlayerActions = ({
  isPlaying,
  isMuted,
  isFavorite,
  isBookmarked,
  onPlayPause,
  onMute,
  onSkip,
  onToggleFavorite,
  onToggleBookmark,
  onShare,
}: {
  isPlaying: boolean;
  isMuted: boolean;
  isFavorite: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onMute: () => void;
  onSkip: () => void;
  onToggleFavorite: () => void;
  onToggleBookmark: () => void;
  onShare: () => void;
}) => {
  const actions: QuickAction[] = [
    {
      id: 'play-pause',
      icon: isPlaying ? <Pause /> : <Play />,
      label: isPlaying ? 'Pause' : 'Play',
      onClick: onPlayPause,
      active: isPlaying,
    },
    {
      id: 'skip',
      icon: <SkipForward />,
      label: 'Skip',
      onClick: onSkip,
    },
    {
      id: 'mute',
      icon: isMuted ? <VolumeX /> : <Volume2 />,
      label: isMuted ? 'Unmute' : 'Mute',
      onClick: onMute,
      active: isMuted,
    },
    {
      id: 'favorite',
      icon: <Heart className={isFavorite ? 'fill-current' : ''} />,
      label: isFavorite ? 'Unfavorite' : 'Favorite',
      onClick: onToggleFavorite,
      active: isFavorite,
    },
    {
      id: 'bookmark',
      icon: <Bookmark className={isBookmarked ? 'fill-current' : ''} />,
      label: isBookmarked ? 'Unbookmark' : 'Bookmark',
      onClick: onToggleBookmark,
      active: isBookmarked,
    },
    {
      id: 'share',
      icon: <Share2 />,
      label: 'Share',
      onClick: onShare,
    },
  ];

  return (
    <MobileQuickActions
      actions={actions}
      layout="horizontal"
      size="md"
      showLabels={false}
      className="w-full"
    />
  );
};

export const TrainingActions = ({
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onMute,
  onVolumeChange,
  onDownload,
  onMore,
}: {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onPlayPause: () => void;
  onMute: () => void;
  onVolumeChange: (volume: number) => void;
  onDownload: () => void;
  onMore: () => void;
}) => {
  const actions: QuickAction[] = [
    {
      id: 'play-pause',
      icon: isPlaying ? <Pause /> : <Play />,
      label: isPlaying ? 'Pause' : 'Start',
      onClick: onPlayPause,
      variant: 'default',
      active: isPlaying,
    },
    {
      id: 'mute',
      icon: isMuted ? <VolumeX /> : <Volume2 />,
      label: isMuted ? 'Unmute' : 'Mute',
      onClick: onMute,
      active: isMuted,
    },
    {
      id: 'download',
      icon: <Download />,
      label: 'Download',
      onClick: onDownload,
    },
    {
      id: 'more',
      icon: <MoreVertical />,
      label: 'More',
      onClick: onMore,
    },
  ];

  return (
    <MobileQuickActions
      actions={actions}
      layout="grid"
      size="md"
      showLabels={true}
    />
  );
};