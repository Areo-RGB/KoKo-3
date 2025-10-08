'use client';

import ExerciseFullscreenOverlay from '@/app/muscle-diagram/_components/exercise-fullscreen-overlay';
import InteractiveMuscleSVG from '@/app/muscle-diagram/_components/interactive-muscle-svg';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { muscleToExerciseDataMap } from '@/app/muscle-diagram/_lib/muscle-name-helper';
import { useState } from 'react';

interface ExerciseInfo {
  title: string;
  videoCount: number;
  videos: string[];
}

interface MuscleState {
  id: string | null;
  name: string;
  info: ExerciseInfo | null;
}

interface OverlayState {
  show: boolean;
  exerciseType: 'exerciseData' | 'stretchingData';
}

export default function MuscleDiagramPage() {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleState>({
    id: null,
    name: '',
    info: null,
  });

  const [selectedMuscle, setSelectedMuscle] = useState<MuscleState>({
    id: null,
    name: '',
    info: null,
  });

  const [overlay, setOverlay] = useState<OverlayState>({
    show: false,
    exerciseType: 'exerciseData',
  });

  const handleNavigateToExercises = (
    exerciseType: 'exerciseData' | 'stretchingData',
  ) => {
    // Use selected muscle if available, otherwise use hovered muscle
    const targetMuscle = selectedMuscle.id ?? hoveredMuscle.id;
    if (!targetMuscle) return;

    const exerciseDataKey = muscleToExerciseDataMap[targetMuscle];
    if (!exerciseDataKey) return;

    // Show fullscreen overlay instead of navigating
    setOverlay({
      show: true,
      exerciseType,
    });
  };

  const handleCloseOverlay = () => {
    setOverlay((prev) => ({ ...prev, show: false }));
  };

  const handleMuscleHover = (
    muscleId: string | null,
    displayName?: string,
    exerciseInfo?: ExerciseInfo,
  ) => {
    setHoveredMuscle({
      id: muscleId,
      name: displayName ?? '',
      info: exerciseInfo ?? null,
    });
  };

  const handleMuscleClick = (
    muscleId: string | null,
    displayName?: string,
    exerciseInfo?: ExerciseInfo,
  ) => {
    // If clicking on the same muscle that's already selected, keep it selected
    // If clicking on a different muscle, select the new one
    // If clicking on empty space (muscleId is null), clear selection
    if (muscleId === selectedMuscle.id && muscleId !== null) {
      // Keep the current selection (don't deselect when clicking the same muscle)
      return;
    }

    setSelectedMuscle({
      id: muscleId,
      name: displayName ?? '',
      info: exerciseInfo ?? null,
    });
  };

  // Derived state for display logic
  const currentMuscle = hoveredMuscle.id ? hoveredMuscle : selectedMuscle;
  const hasActiveMuscle = Boolean(currentMuscle.id);
  const isHovering = Boolean(hoveredMuscle.id);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Main content wrapper with better spacing */}
      <div className="flex flex-col items-center space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Carousel section with responsive sizing */}
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
                  <InteractiveMuscleSVG
                    svgPath="/assets/svg/front.svg"
                    title="Vorderansicht"
                    selectedMuscleId={selectedMuscle.id}
                    onMuscleHover={handleMuscleHover}
                    onMuscleClick={handleMuscleClick}
                  />
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
                  <InteractiveMuscleSVG
                    svgPath="/assets/svg/back.svg"
                    title="Rückansicht"
                    selectedMuscleId={selectedMuscle.id}
                    onMuscleHover={handleMuscleHover}
                    onMuscleClick={handleMuscleClick}
                  />
                </div>
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious className="top-1/2 left-2 -translate-y-1/2 sm:left-4" />
            <CarouselNext className="top-1/2 right-2 -translate-y-1/2 sm:right-4" />
          </Carousel>
        </div>

        {/* Information panel with improved responsive design */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="border-border bg-card flex min-h-[8rem] w-full items-start justify-center overflow-hidden rounded-xl border shadow-lg transition-shadow duration-200 hover:shadow-xl sm:min-h-[9rem] md:min-h-[10rem] lg:min-h-[11rem]">
            {hasActiveMuscle ? (
              <div className="flex h-full w-full flex-col">
                {/* Header with muscle name - improved hierarchy */}
                <div className="flex w-full items-center justify-center">
                  <div className="w-full rounded-t-xl border-b-2 border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-center shadow-lg sm:px-6 sm:py-4">
                    <h2 className="text-sm leading-tight font-bold tracking-wide text-white uppercase sm:text-base md:text-lg">
                      {currentMuscle.name}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-blue-100 sm:text-sm">
                      {isHovering ? 'Currently Hovered' : 'Currently Selected'}
                    </p>
                  </div>
                </div>

                {/* Exercise buttons section - improved responsive layout */}
                <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
                  {currentMuscle.info ? (
                    <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          handleNavigateToExercises('exerciseData')
                        }
                        className="h-9 w-full px-4 text-sm font-medium transition-transform duration-200 hover:scale-105 sm:h-10 sm:w-auto sm:px-6"
                      >
                        Kraft
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleNavigateToExercises('stretchingData')
                        }
                        className="h-9 w-full px-4 text-sm font-medium transition-transform duration-200 hover:scale-105 sm:h-10 sm:w-auto sm:px-6"
                      >
                        Dehn
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                      <p className="text-sm font-medium text-slate-600 sm:text-base dark:text-slate-400">
                        Keine Übungen verfügbar
                      </p>
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-500">
                        Für diesen Muskel sind noch keine Übungen hinterlegt
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col p-4 sm:p-6">
                {/* Enhanced empty state header */}
                <div className="mb-4 flex items-center justify-center gap-3">
                  <div className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-slate-300 sm:h-3 sm:w-3 dark:bg-slate-600"></div>
                  <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase sm:text-sm dark:text-slate-400">
                    Muskel auswählen
                  </p>
                </div>

                {/* Enhanced main content section */}
                <div className="flex flex-1 flex-col items-center justify-center space-y-3 sm:space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner sm:h-16 sm:w-16 dark:from-slate-700 dark:to-slate-800">
                    <svg
                      className="h-6 w-6 text-slate-400 sm:h-8 sm:w-8 dark:text-slate-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-sm font-semibold text-slate-700 sm:text-base dark:text-slate-300">
                      Muskelbereich erkunden
                    </p>
                    <p className="max-w-xs text-xs text-slate-500 sm:text-sm dark:text-slate-500">
                      Bewegen Sie die Maus über Muskelbereiche oder tippen Sie
                      darauf
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                      Klicken zum Auswählen und Hervorheben
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Fullscreen Overlay */}
      <ExerciseFullscreenOverlay
        visible={overlay.show}
        muscle={
          muscleToExerciseDataMap[
            selectedMuscle.id ?? hoveredMuscle.id ?? ''
          ] ?? null
        }
        exerciseType={overlay.exerciseType}
        onClose={handleCloseOverlay}
      />
    </div>
  );
}
