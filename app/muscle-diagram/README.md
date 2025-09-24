# Interactive Muscle Diagram (`/muscle-diagram`)

## Overview

This page features an interactive anatomical diagram that allows users to explore exercises and stretches for different muscle groups. It uses SVG maps for both front and back views of the human body, with hover and click interactions to display relevant training information.

## Component Structure

- **`MuscleDiagramPage` (`page.tsx`)**: The main client component (`'use client'`) that manages the state for hovered and selected muscles and orchestrates the UI.
- **`Carousel` (`components/ui/carousel.tsx`)**: A shadcn/ui component used to switch between the front and back view of the muscle diagram.
- **`InteractiveMuscleSVG` (`_components/interactive-muscle-svg.tsx`)**: A key component that fetches and renders an SVG file. It attaches event listeners (`mouseenter`, `mouseleave`, `click`) to the paths within the SVG to detect user interaction with specific muscle groups.
- **`ExerciseFullscreenOverlay` (`_components/exercise-fullscreen-overlay.tsx`)**: A modal component that displays exercise and stretching videos in a fullscreen view when a user selects a muscle and chooses an exercise type.

## Data Flow

1.  The `InteractiveMuscleSVG` component fetches SVG content from `public/images/front.svg` or `public/images/back.svg`.
2.  When a user interacts with a muscle in the SVG, its ID is extracted (e.g., "gluteus-maximus").
3.  This SVG ID is mapped to a data key (e.g., "glutes") using the `muscleToExerciseDataMap` in `util/muscle-name-helper.ts`.
4.  The `getExerciseDataKey` function resolves the final key, which is then used by `loadMuscleData` from `_lib/exercise-data-loader.ts` to asynchronously fetch the relevant exercise data from a corresponding JSON file (e.g., `public/data/exercises/glutes.json`).
5.  The fetched data (exercise titles, video URLs) is then passed to the `ExerciseFullscreenOverlay` when a user clicks an exercise button.

## Key Features

- **Interactive SVG Diagram**: Users can hover over and click on individual muscle groups.
- **Dual Views**: A carousel allows switching between front and back anatomical views.
- **Dynamic Data Loading**: Exercise data for a muscle is fetched on-demand when the muscle is first interacted with, keeping the initial page load light.
- **Fullscreen Video Overlay**: Provides an immersive, focused view for watching exercise videos without leaving the page.
- **State Distinction**: The UI clearly distinguishes between a "hovered" muscle (temporary highlight) and a "selected" muscle (persistent highlight).

## File Location

`app/muscle-diagram/page.tsx` and its colocated components and data logic in `app/muscle-diagram/_components/` and `app/muscle-diagram/_lib/`.

## AI Agent Notes

- The interaction logic is heavily dependent on the structure of the SVG files. The IDs of `<path>` and `<g>` elements within the SVGs are used to identify muscle groups.
- This page demonstrates a "lazy loading" or "on-demand" data fetching pattern. Data is not loaded until the user interacts with a specific muscle.
- The `util/muscle-name-helper.ts` file is crucial as it acts as a bridge between the SVG element IDs and the data file names.

## Development Notes

- Colocation: \_components/ and \_lib/ for private SVG/data logic (non-routable).
- Static Export: SVGs/data in public/ – pre-built, no runtime fetches beyond lazy JSON.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
