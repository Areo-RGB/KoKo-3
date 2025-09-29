'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Filter,
  Search,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { Exercise, ExerciseType, WorkoutPreset } from '../_lib/types';
import { EXERCISE_MEDIA_MAP, type ExerciseMedia } from '../_lib/exercise-media';
import { ExerciseCard } from './exercise-card';

type FilterType = ExerciseType | 'all';

function VideoPlayerOverlay({ media, onClose }: { media: ExerciseMedia; onClose: () => void }) {
  if (!media.videoSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <video
          src={media.videoSrc}
          poster={media.posterSrc ?? media.imageSrc}
          controls
          autoPlay
          className="w-full aspect-video rounded-lg shadow-2xl"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white rounded-full hover:bg-white/20 hover:text-white"
          aria-label="Close video player"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}


export default function ExerciseLibrary({ selectedPreset }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [playingMedia, setPlayingMedia] = useState<ExerciseMedia | null>(null);

  const exercises = useMemo(() => selectedPreset?.exercises ?? [], [selectedPreset]);

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
          <h2 className="text-2xl font-semibold tracking-tight">Exercise Library</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPreset
              ? `Showing ${filteredExercises.length} of ${exercises.length} exercises from “${selectedPreset.name}”.`
              : 'Select a workout preset to explore exercise media, tips, and instructions.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label="Search exercises"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Search exercises…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              type="search"
            />
          </div>
          <div className="relative w-full sm:w-44">
            <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              aria-label="Filter by exercise type"
              className="w-full appearance-none rounded-md border border-input bg-background py-2 pl-9 pr-8 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onChange={(event) => setTypeFilter(event.target.value as FilterType)}
              value={typeFilter}
            >
              <option value="all">All types</option>
              <option value="work">Work</option>
              <option value="hold">Hold</option>
              <option value="reps">Reps</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {!selectedPreset ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No preset selected</CardTitle>
            <CardDescription>
              Choose a workout preset from the timer tab to preview detailed exercise media and
              instructions tailored to that session.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : filteredExercises.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No exercises found</CardTitle>
            <CardDescription>
              Try adjusting your search or filter to find exercises in this preset.
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
        <VideoPlayerOverlay media={playingMedia} onClose={() => setPlayingMedia(null)} />
      )}
    </div>
  );
}

interface ExerciseLibraryProps {
  selectedPreset: WorkoutPreset | null;
}
