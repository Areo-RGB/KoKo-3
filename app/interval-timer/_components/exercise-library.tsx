'use client';

import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { EXERCISE_MEDIA_MAP, type ExerciseMedia } from '../_lib/exercise-media';
import type { Exercise, ExerciseType, WorkoutPreset } from '../_lib/types';
import { ExerciseCard } from './exercise-card';

type FilterType = ExerciseType | 'all';

function VideoPlayerOverlay({
  media,
  onClose,
}: {
  media: ExerciseMedia;
  onClose: () => void;
}) {
  if (!media.videoSrc) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          src={media.videoSrc}
          poster={media.posterSrc ?? media.imageSrc}
          controls
          autoPlay
          className="aspect-video w-full rounded-lg shadow-2xl"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full text-white hover:bg-white/20 hover:text-white"
          aria-label="Close video player"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export default function ExerciseLibrary({
  selectedPreset,
}: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [playingMedia, setPlayingMedia] = useState<ExerciseMedia | null>(null);

  const exercises = useMemo(
    () => selectedPreset?.exercises ?? [],
    [selectedPreset],
  );

  const filteredExercises = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesType = typeFilter === 'all' || exercise.type === typeFilter;
      const matchesQuery =
        query.length === 0 ||
        exercise.name.toLowerCase().includes(query) ||
        (exercise.instructions?.toLowerCase().includes(query) ?? false);
      return matchesType && matchesQuery;
    });
  }, [exercises, searchTerm, typeFilter]);

  const handlePlayVideo = (exercise: Exercise, media: ExerciseMedia) => {
    if (media.videoSrc) {
      setPlayingMedia(media);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Exercise Library
          </h2>
          <p className="text-muted-foreground text-sm">
            {selectedPreset
              ? `Showing ${filteredExercises.length} of ${exercises.length} exercises from “${selectedPreset.name}”.`
              : 'Select a workout preset to explore exercise media, tips, and instructions.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              aria-label="Search exercises"
              className="border-input bg-background focus-visible:ring-ring w-full rounded-md border py-2 pr-3 pl-9 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:outline-none"
              placeholder="Search exercises…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
            />
          </div>
          <div className="relative w-full sm:w-44">
            <Filter className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <select
              aria-label="Filter by exercise type"
              className="border-input bg-background focus-visible:ring-ring w-full appearance-none rounded-md border py-2 pr-8 pl-9 text-sm shadow-sm transition focus-visible:ring-2 focus-visible:outline-none"
              onChange={(event) =>
                setTypeFilter(event.target.value as FilterType)
              }
              value={typeFilter}
            >
              <option value="all">All types</option>
              <option value="work">Work</option>
              <option value="hold">Hold</option>
              <option value="reps">Reps</option>
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {!selectedPreset ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No preset selected</CardTitle>
            <CardDescription>
              Choose a workout preset from the timer tab to preview detailed
              exercise media and instructions tailored to that session.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filteredExercises.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No exercises found</CardTitle>
            <CardDescription>
              Try adjusting your search or filter to find exercises in this
              preset.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => {
            const media = EXERCISE_MEDIA_MAP[exercise.name];
            return (
              <ExerciseCard
                key={`${exercise.name}-${exercise.type}`}
                exercise={exercise}
                media={media}
                onPlayVideo={handlePlayVideo}
              />
            );
          })}
        </div>
      )}

      {playingMedia && (
        <VideoPlayerOverlay
          media={playingMedia}
          onClose={() => setPlayingMedia(null)}
        />
      )}
    </div>
  );
}

interface ExerciseLibraryProps {
  selectedPreset: WorkoutPreset | null;
}
