'use client';

import { loadMuscleData } from '@/app/muscle-diagram/_lib/exercise-data-loader';
import {
  formatMuscleForDisplay,
  getExerciseDataKey,
  getMuscleIdFromElement,
} from '@/util/muscle-name-helper';
import { useEffect, useRef, useState } from 'react';

interface ExerciseInfo {
  title: string;
  videoCount: number;
  videos: string[];
}

interface InteractiveMuscleSVGProps {
  svgPath: string;
  title: string;
  selectedMuscleId?: string | null;
  onMuscleHover?: (
    muscleId: string | null,
    displayName?: string,
    exerciseInfo?: ExerciseInfo,
  ) => void;
  onMuscleClick?: (
    muscleId: string | null,
    displayName?: string,
    exerciseInfo?: ExerciseInfo,
  ) => void;
}

export default function InteractiveMuscleSVG({
  svgPath,
  title,
  selectedMuscleId,
  onMuscleHover,
  onMuscleClick,
}: InteractiveMuscleSVGProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get exercise info from the new data system
  const getMuscleExerciseInfo = async (
    muscleId: string,
  ): Promise<ExerciseInfo | undefined> => {
    const exerciseDataKey = getExerciseDataKey(muscleId);
    if (!exerciseDataKey) return undefined;

    try {
      const muscleData = await loadMuscleData(exerciseDataKey);
      if (muscleData?.exerciseData) {
        return {
          title: muscleData.exerciseData.title,
          videoCount: muscleData.exerciseData.videos.length,
          videos: muscleData.exerciseData.videos,
        };
      }
    } catch (error) {
      console.warn(
        `Failed to load exercise data for ${exerciseDataKey}:`,
        error,
      );
    }
    return undefined;
  };

  useEffect(() => {
    // Load the SVG content
    fetch(svgPath)
      .then((response) => response.text())
      .then((text) => {
        // Process the SVG to add hover classes and improve styling
        let processedSvg = text;

        // Add hover classes to elements with fill="currentColor"
        processedSvg = processedSvg.replace(
          /fill="currentColor"/g,
          'fill="white" class="muscle-part"',
        );

        // Add hover classes to bodymap elements (muscle groups)
        processedSvg = processedSvg.replace(
          /class="bodymap([^"]*)"/g,
          'class="bodymap$1 muscle-group"',
        );

        setSvgContent(processedSvg);
      })
      .catch((error) => {
        console.error('Fehler beim Laden der SVG:', error);
        setSvgContent(
          `<svg viewBox="0 0 400 600"><text x="200" y="300" text-anchor="middle" fill="gray">Fehler beim Laden ${title}</text></svg>`,
        );
      });
  }, [svgPath, title]);

  // Add event listeners after SVG content is loaded
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    // Store references for cleanup
    const eventListeners: Array<{
      element: Element;
      event: string;
      handler: EventListener;
    }> = [];

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleMuscleHover = async (event: Event) => {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'path' &&
          target.classList.contains('muscle-part')
        ) {
          const muscleId = getMuscleIdFromElement(target);
          if (muscleId != null && muscleId !== '') {
            const displayName = formatMuscleForDisplay(muscleId);

            // Load exercise info asynchronously
            const exerciseInfo = await getMuscleExerciseInfo(muscleId);

            onMuscleHover?.(muscleId, displayName, exerciseInfo);
          }
        }
      };

      const handleMuscleClick = async (event: Event) => {
        const target = event.target as HTMLElement;

        if (
          target.tagName === 'path' &&
          target.classList.contains('muscle-part')
        ) {
          const muscleId = getMuscleIdFromElement(target);

          if (muscleId != null && muscleId !== '') {
            const displayName = formatMuscleForDisplay(muscleId);

            // Load exercise info asynchronously
            const exerciseInfo = await getMuscleExerciseInfo(muscleId);

            onMuscleClick?.(muscleId, displayName, exerciseInfo);
          }
        }
      };

      const handleMuscleLeave = (event: Event) => {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'path' &&
          target.classList.contains('muscle-part')
        ) {
          // Only clear hover state, don't affect selected state
          onMuscleHover?.(null);
        }
      };

      const handleTouchEnd = (e: Event) => {
        e.preventDefault();
      };

      // Handle clicks on SVG background to clear selection
      const handleBackgroundClick = (event: Event) => {
        const target = event.target as HTMLElement;
        // Only clear selection if clicking on SVG background, not on muscle parts
        if (
          target.tagName === 'svg' ||
          (!target.classList.contains('muscle-part') &&
            !target.closest('.muscle-part'))
        ) {
          onMuscleClick?.(null);
        }
      };

      // Add background click handler to the container
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        svgElement.addEventListener('click', handleBackgroundClick);
        eventListeners.push({
          element: svgElement,
          event: 'click',
          handler: handleBackgroundClick,
        });
      }

      // Add event listeners to all muscle parts
      const muscleParts = container.querySelectorAll('.muscle-part');
      muscleParts.forEach((part) => {
        // Desktop hover events
        part.addEventListener('mouseenter', handleMuscleHover);
        eventListeners.push({
          element: part,
          event: 'mouseenter',
          handler: handleMuscleHover,
        });

        part.addEventListener('mouseleave', handleMuscleLeave);
        eventListeners.push({
          element: part,
          event: 'mouseleave',
          handler: handleMuscleLeave,
        });

        // Click events for selection (desktop and mobile)
        const handleMuscleClickWithStop = (event: Event) => {
          event.stopPropagation(); // Prevent background click handler
          handleMuscleClick(event);
        };

        part.addEventListener('click', handleMuscleClickWithStop);
        eventListeners.push({
          element: part,
          event: 'click',
          handler: handleMuscleClickWithStop,
        });

        // Touch events for mobile selection
        const handleMuscleClickTouchWithStop = (event: Event) => {
          event.stopPropagation(); // Prevent background click handler
          handleMuscleClick(event);
        };

        part.addEventListener('touchstart', handleMuscleClickTouchWithStop);
        eventListeners.push({
          element: part,
          event: 'touchstart',
          handler: handleMuscleClickTouchWithStop,
        });

        // Prevent default touch behavior to avoid double-tap zoom
        part.addEventListener('touchend', handleTouchEnd);
        eventListeners.push({
          element: part,
          event: 'touchend',
          handler: handleTouchEnd,
        });
      });
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      // Remove all event listeners
      eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    };
  }, [svgContent, onMuscleHover, onMuscleClick]);

  // Update selected muscle state when selectedMuscleId changes
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const container = containerRef.current;
    const muscleParts = container.querySelectorAll('.muscle-part');

    muscleParts.forEach((part) => {
      const muscleId = getMuscleIdFromElement(part);
      if (muscleId === selectedMuscleId) {
        part.classList.add('muscle-selected');
        part.setAttribute('data-selected', 'true');
      } else {
        part.classList.remove('muscle-selected');
        part.removeAttribute('data-selected');
      }
    });
  }, [svgContent, selectedMuscleId]);

  return (
    <div className="relative">
      <h3 className="mb-4 text-center text-2xl font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <div
        ref={containerRef}
        className="muscle-diagram-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      <style jsx>{`
        .muscle-diagram-container :global(svg) {
          width: 100%;
          max-width: 400px;
          height: auto;
          margin: 0 auto;
          display: block;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
          max-height: 70vh;
        }

        /* Base state - white */
        .muscle-diagram-container :global(.muscle-part) {
          cursor: pointer;
          transition: fill 0.3s ease;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
          fill: white !important;
        }

        /* Hover state - light red (only when not selected) */
        .muscle-diagram-container
          :global(.muscle-part:not(.muscle-selected):hover) {
          fill: #f87171 !important;
        }

        /* Selected state - dark red (highest priority) */
        .muscle-diagram-container :global(.muscle-part.muscle-selected),
        .muscle-diagram-container :global(.muscle-part.muscle-selected:hover),
        .muscle-diagram-container :global(.muscle-part[data-selected='true']),
        .muscle-diagram-container
          :global(.muscle-part[data-selected='true']:hover) {
          fill: #dc2626 !important;
          transition: none !important;
        }

        .muscle-diagram-container :global(.muscle-group) {
          cursor: pointer;
          transition: all 0.3s ease;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Group hover effects - only apply to non-selected muscles */
        .muscle-diagram-container
          :global(.muscle-group:hover .muscle-part:not(.muscle-selected)) {
          fill: #f87171 !important;
        }

        .muscle-diagram-container :global(.bodymap) {
          cursor: pointer;
          transition: all 0.3s ease;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Bodymap hover effects - only apply to non-selected muscles */
        .muscle-diagram-container
          :global(.bodymap:hover .muscle-part:not(.muscle-selected)) {
          fill: #f87171 !important;
        }

        /* Mobile optimizations */
        @media (hover: none) and (pointer: coarse) {
          .muscle-diagram-container :global(.muscle-part) {
            min-width: 44px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
