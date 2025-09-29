'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Clock,
  Layers3,
  Play,
  Shuffle,
} from 'lucide-react';

import type { Exercise } from '../_lib/types';
import type { ExerciseMedia } from '../_lib/exercise-media';

interface ExerciseCardProps {
  exercise: Exercise;
  media?: ExerciseMedia | null;
  onExpandChange?: (isExpanded: boolean) => void;
  onPlayVideo?: (exercise: Exercise, media: ExerciseMedia) => void;
}

const TYPE_LABELS: Record<Exercise['type'], string> = {
  work: 'Work',
  hold: 'Hold',
  reps: 'Reps',
};

const TYPE_BADGE_CLASSES: Record<Exercise['type'], string> = {
  work: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  hold: 'bg-amber-100 text-amber-900 border-amber-200',
  reps: 'bg-blue-100 text-blue-900 border-blue-200',
};

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '—';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (minutes === 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}

export function ExerciseCard({
  exercise,
  media,
  onExpandChange,
  onPlayVideo,
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const instructionsId = useId();
  const hasInstructions = Boolean(exercise.instructions?.trim());
  const hasImage = Boolean(media?.imageSrc);
  const hasVideo = Boolean(media?.videoSrc);

  const handleToggleInstructions = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      onExpandChange?.(next);
      return next;
    });
  };

  const handlePlayVideo = () => {
    if (hasVideo && media) {
      onPlayVideo?.(exercise, media);
    }
  };

  return (
    <Card
      className="group relative flex h-full flex-col overflow-hidden border-border/60 transition-transform duration-200 focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background hover:-translate-y-1 hover:shadow-lg"
      tabIndex={-1}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {hasImage ? (
          <Image
            src={media!.imageSrc!}
            alt={
              media?.imageAlt ??
              `${exercise.name} demonstration`
            }
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 45vw, 90vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20 text-muted-foreground">
            <Shuffle className="size-12 opacity-60" aria-hidden="true" />
            <span className="sr-only">
              No image available for {exercise.name}
            </span>
          </div>
        )}

        {exercise.sideSpecific ? (
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
            Side Specific
          </Badge>
        ) : null}

        {hasVideo ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handlePlayVideo}
            className="absolute bottom-3 right-3 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition hover:translate-y-[-2px]"
          >
            <Play className="size-4" aria-hidden="true" />
            Watch Demo
          </Button>
        ) : null}
      </div>

      <CardHeader className="flex flex-col gap-3 pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-tight">
            {exercise.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={TYPE_BADGE_CLASSES[exercise.type]}
          >
            {TYPE_LABELS[exercise.type]}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {exercise.type === 'reps'
            ? `Complete ${exercise.reps ?? '—'} reps each set`
            : `Perform for ${formatDuration(exercise.duration)} per set`}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-4">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              Duration
            </dt>
            <dd className="text-base font-semibold text-foreground">
              {exercise.type === 'reps'
                ? `${exercise.reps ?? '—'} reps`
                : formatDuration(exercise.duration)}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Layers3 className="size-4" aria-hidden="true" />
              Sets
            </dt>
            <dd className="text-base font-semibold text-foreground">
              {exercise.sets}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Shuffle className="size-4" aria-hidden="true" />
              Rest After
            </dt>
            <dd className="text-base font-semibold text-foreground">
              {formatDuration(exercise.restAfter)}
            </dd>
          </div>

          {exercise.sideSpecific ? (
            <div className="space-y-1">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Shuffle className="size-4" aria-hidden="true" />
                Sides
              </dt>
              <dd className="text-base font-semibold text-foreground">
                Alternate left & right
              </dd>
            </div>
          ) : null}
        </dl>
      </CardContent>

      {hasInstructions ? (
        <CardFooter className="flex flex-col gap-2 border-t border-border/50 bg-muted/10 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleInstructions}
            aria-expanded={isExpanded}
            aria-controls={instructionsId}
            className="inline-flex items-center justify-between gap-2 px-0 text-sm font-medium hover:bg-transparent focus-visible:ring-0"
          >
            <span>Instructions</span>
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                }`}
              aria-hidden="true"
            />
          </Button>

          <div
            id={instructionsId}
            role="region"
            aria-live="polite"
            className={`text-sm leading-relaxed text-muted-foreground ${isExpanded ? 'max-h-[320px] animate-in fade-in slide-in-from-top-1' : 'hidden'
              }`}
          >
            {exercise.instructions}
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default ExerciseCard;
