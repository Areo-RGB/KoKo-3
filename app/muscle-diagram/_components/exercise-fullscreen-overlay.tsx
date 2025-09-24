'use client';

import { loadMuscleData } from '@/app/muscle-diagram/_lib/exercise-data-loader';
import { Button } from '@/components/ui/button';
import { cn } from '@/util/utils';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MuscleExercise {
  title: string;
  videos: string[];
}

interface ExerciseFullscreenOverlayProps {
  visible: boolean;
  muscle: string | null;
  exerciseType: 'exerciseData' | 'stretchingData';
  onClose: () => void;
}

export default function ExerciseFullscreenOverlay({
  visible,
  muscle,
  exerciseType,
  onClose,
}: ExerciseFullscreenOverlayProps) {
  const [currentExercise, setCurrentExercise] = useState<MuscleExercise | null>(
    null,
  );
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  useEffect(() => {
    if (muscle && visible) {
      loadMuscleData(muscle)
        .then((muscleData) => {
          if (muscleData) {
            const exercise =
              exerciseType === 'exerciseData'
                ? muscleData.exerciseData
                : muscleData.stretchingData;

            if (exercise) {
              setCurrentExercise(exercise);
              setSelectedVideoIndex(0);
            } else {
              setCurrentExercise(null);
            }
          } else {
            setCurrentExercise(null);
          }
        })
        .catch((error) => {
          console.error('Error loading muscle data:', error);
          setCurrentExercise(null);
        });
    }
  }, [muscle, exerciseType, visible]);

  // Handle escape key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
      // Navigate videos with arrow keys
      if (visible && currentExercise) {
        if (e.key === 'ArrowLeft' && selectedVideoIndex > 0) {
          setSelectedVideoIndex(selectedVideoIndex - 1);
        }
        if (
          e.key === 'ArrowRight' &&
          selectedVideoIndex < currentExercise.videos.length - 1
        ) {
          setSelectedVideoIndex(selectedVideoIndex + 1);
        }
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [visible, onClose]);

  if (!visible) return null;

  if (!currentExercise) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-card mx-4 max-w-md rounded-lg p-8 text-center">
          <h2 className="text-foreground mb-4 text-xl font-bold">
            Übung nicht gefunden
          </h2>
          <p className="text-muted-foreground mb-6">
            Für diesen Muskel sind keine Übungen verfügbar.
          </p>
          <Button onClick={onClose}>Schließen</Button>
        </div>
      </div>
    );
  }

  const currentVideo = currentExercise.videos[selectedVideoIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-2 z-20 touch-manipulation rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/80 focus:ring-2 focus:ring-white focus:outline-none sm:top-8 sm:right-4 sm:p-3 lg:top-10"
        title="Schließen (Esc)"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Exercise Header */}
      <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6 sm:p-8 lg:p-10">
        <h2 className="pt-4 text-lg font-bold text-white sm:text-xl lg:text-2xl">
          {currentExercise.title}
        </h2>
      </div>

      {/* Main content area */}
      <div className="flex h-full flex-col pt-16 sm:pt-20">
        {/* Video player area */}
        <div className="flex items-start justify-center p-2 pt-8 pb-4 sm:p-4 sm:pt-12 lg:p-6 lg:pt-16">
          {currentVideo ? (
            <video
              key={currentVideo}
              src={currentVideo}
              controls
              autoPlay
              preload="metadata"
              playsInline
              className="h-auto max-h-full w-full rounded-lg shadow-2xl sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2"
              style={{ aspectRatio: '16/9' }}
            >
              Ihr Browser unterstützt das Video-Element nicht.
            </video>
          ) : (
            <div className="px-4 text-center text-white">
              <p className="mb-4 text-lg sm:text-xl">Kein Video verfügbar</p>
              <p className="text-sm text-gray-400 sm:text-base">
                Für diese Übung ist kein Video hinterlegt.
              </p>
            </div>
          )}
        </div>

        {/* Unified Video List */}
        {currentExercise.videos.length > 1 && (
          <div className="border-t border-gray-700 bg-black/50 backdrop-blur-sm">
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="mb-3 text-sm font-semibold text-white sm:text-base lg:text-lg">
                Videos ({currentExercise.videos.length})
              </h3>
              <div className="space-y-2">
                {currentExercise.videos.map((video, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVideoIndex(index)}
                    className={cn(
                      'w-full touch-manipulation rounded-lg p-2 text-left transition-colors sm:p-3',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                      index === selectedVideoIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700',
                    )}
                  >
                    <div className="text-xs font-medium sm:text-sm lg:text-base">
                      Video {index + 1}
                    </div>
                    <div className="truncate text-xs opacity-75 sm:text-sm">
                      {video
                        .split('/')
                        .pop()
                        ?.replace(/\.[^/.]+$/, '') || `Video ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-6 lg:p-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
          <div className="text-center text-white sm:text-left">
            <p className="text-xs opacity-75 sm:text-sm">
              Video {selectedVideoIndex + 1} von {currentExercise.videos.length}
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto sm:gap-3">
            {selectedVideoIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setSelectedVideoIndex(selectedVideoIndex - 1)}
                className="flex-1 touch-manipulation border-white/20 bg-white/10 py-2 text-sm text-white hover:bg-white/20 sm:flex-none sm:py-2 sm:text-base"
              >
                Vorheriges
              </Button>
            )}
            {selectedVideoIndex < currentExercise.videos.length - 1 && (
              <Button
                onClick={() => setSelectedVideoIndex(selectedVideoIndex + 1)}
                className="flex-1 touch-manipulation bg-blue-600 py-2 text-sm text-white hover:bg-blue-700 sm:flex-none sm:py-2 sm:text-base"
              >
                Nächstes
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
