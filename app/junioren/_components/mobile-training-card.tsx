'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileSwipeableCard } from '@/components/ui/mobile-swipeable-card';
import { MobileQuickActions } from '@/components/ui/mobile-quick-actions';
import {
  Heart,
  ExternalLink,
  Download,
  Play,
  ChevronRight,
  Clock,
  Users,
  Target,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TrainingSession } from '@/app/junioren/_lib/types';

interface MobileTrainingCardProps {
  session: TrainingSession;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStart?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
}

export function MobileTrainingCard({
  session,
  isFavorite,
  onToggleFavorite,
  onStart,
  onDownload,
  onShare,
  className,
}: MobileTrainingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const touchStartRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = Date.now();
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartRef.current;

    // Long press to expand
    if (touchDuration > 500) {
      setIsExpanded(!isExpanded);
    }

    setIsPressed(false);
  };

  const handleCardClick = () => {
    // Short press to start
    if (onStart) {
      onStart();
    }
  };

  const quickActions = [
    {
      id: 'favorite',
      icon: <Heart className={cn('h-4 w-4', isFavorite && 'fill-current text-red-500')} />,
      label: isFavorite ? 'Entfernen' : 'Speichern',
      onClick: onToggleFavorite,
      active: isFavorite,
    },
    {
      id: 'download',
      icon: <Download className="h-4 w-4" />,
      label: 'Download',
      onClick: onDownload || (() => {}),
    },
    {
      id: 'share',
      icon: <ExternalLink className="h-4 w-4" />,
      label: 'Teilen',
      onClick: onShare || (() => {}),
    },
  ];

  return (
    <MobileSwipeableCard
      onSwipeLeft={onShare}
      onSwipeRight={onToggleFavorite}
      className={cn('w-full', className)}
    >
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300',
          'border-2 hover:border-primary/30',
          'active:scale-[0.98] touch-manipulation',
          isPressed && 'scale-[0.98]',
          isFavorite && 'border-red-200 dark:border-red-800'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {/* Status Bar */}
        <div className="h-1 bg-gradient-to-r from-primary to-primary/60" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-2 line-clamp-2">
                {session.title}
              </CardTitle>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {session.ageGroup}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  {session.category}
                </Badge>
                              </div>
            </div>

            {/* Favorite Indicator */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="h-8 w-8 flex-shrink-0"
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFavorite && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {session.description}
          </p>

          {/* Expandable Content */}
          {isExpanded && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in">
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">Training Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Altersgruppe:</span>
                    <span>{session.ageGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kategorie:</span>
                    <span>{session.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="grid grid-cols-2 gap-2">
                {session.htmlPath && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-10"
                  >
                    <a
                      href={session.htmlPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Training
                    </a>
                  </Button>
                )}

                {session.pdfPath && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-10"
                  >
                    <a
                      href={session.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t">
            <MobileQuickActions
              actions={[
                ...quickActions,
                {
                  id: 'start',
                  icon: <Play className="h-4 w-4" />,
                  label: 'Starten',
                  onClick: onStart || (() => {}),
                  variant: 'default',
                },
              ]}
              layout="horizontal"
              size="sm"
              showLabels={true}
            />
          </div>

          {/* Expand Hint */}
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              {isExpanded ? 'Kurz drücken zum Starten' : 'Lange drücken für Details'}
            </p>
          </div>

          {/* Swipe Hints */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className="flex items-center">
              <ChevronRight className="h-3 w-3 mr-1 rotate-180" />
              Speichern
            </span>
            <span className="flex items-center">
              Teilen
              <ChevronRight className="h-3 w-3 ml-1" />
            </span>
          </div>
        </CardContent>
      </Card>
    </MobileSwipeableCard>
  );
}

// Enhanced Training List Component
interface MobileTrainingListProps {
  sessions: TrainingSession[];
  favorites: Set<string>;
  onToggleFavorite: (sessionId: string) => void;
  onStartTraining: (session: TrainingSession) => void;
  className?: string;
}

export function MobileTrainingList({
  sessions,
  favorites,
  onToggleFavorite,
  onStartTraining,
  className,
}: MobileTrainingListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className={cn('space-y-4', className)}>
      {/* View Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {sessions.length} Trainingseinheiten
        </h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            Liste
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Raster
          </Button>
        </div>
      </div>

      {/* Training Cards */}
      <div className={cn(
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'
      )}>
        {sessions.map((session) => (
          <MobileTrainingCard
            key={session.id}
            session={session}
            isFavorite={favorites.has(session.id)}
            onToggleFavorite={() => onToggleFavorite(session.id)}
            onStart={() => onStartTraining(session)}
          />
        ))}
      </div>

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Keine Trainingseinheiten gefunden</p>
        </div>
      )}
    </div>
  );
}