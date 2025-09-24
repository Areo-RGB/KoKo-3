# Junior Training Management Page (`/junioren`)

## Overview

This is the central hub for accessing DFB (German Football Association) training session materials for various junior age groups (A-Junior to E-Junior). It's a highly interactive client-side application that allows users to filter, search, and manage a large library of training content.

## Component Structure

- **`JuniorenTrainingPage` (`page.tsx`)**: The main client component (`'use client'`) that manages all state and renders the UI. It handles fetching data, filtering, searching, and managing user interactions.
- **`CacheControl` (`_components/cache-control.tsx`)**: A component that allows users to download training materials for offline access using the browser's Cache API, managed via a Service Worker.
- **`useCacheManager` Hook (`hooks/use-cache-manager.ts`)**: Provides the logic for interacting with the Service Worker to cache files, check status, and clear caches.

## Data Flow

1.  **Training Sessions**: The page fetches a master list of all training sessions from the static JSON file at `public/junioren/training-sessions.json`.
2.  **Warm-up Links**: When the "Aufwärmen" category is selected, the page dynamically fetches warm-up exercise links from `public/junioren/aufwaermen-links.json`.
3.  **Favorites**: Favorite sessions are stored in the user's `localStorage` under the key `junior-favorites`.

## State Management

The `JuniorenTrainingPage` component manages several pieces of state:

- `searchTerm`: The current value of the search input.
- `selectedCategory`: The currently selected training category filter.
- `selectedAgeGroup`: The currently selected age group, which is **synchronized with the URL query parameter `?age=`**.
- `favorites`: A `Set` of session IDs that the user has marked as favorites.
- `sessions`: The array of all training sessions loaded from JSON.
- `warmupMap`: The loaded data for warm-up exercises.

## Key Features

- **Multi-dimensional Filtering**: Users can filter the extensive list of training sessions by age group, category, and a full-text search term.
- **Favorites System**: Users can mark sessions as favorites, which are saved locally and can be filtered. The component also handles migrating old, separate favorite lists into a single unified one.
- **Offline Caching**: The `CacheControl` component provides an interface for users to download all materials for a specific age group for offline use.
- **Dynamic Content Loading**: Warm-up exercise data is lazy-loaded only when the user selects that category.
- **URL State Synchronization**: The selected age group is reflected in the URL, allowing for direct links to filtered views.

## File Location

`app/junioren/page.tsx` and its colocated components and data logic in `app/junioren/_components/` and `app/junioren/_lib/`.

## AI Agent Notes

- This is one of the most complex client-side components in the application due to its extensive state management and data filtering logic.
- When modifying filtering or display logic, focus on the `filteredAndGrouped` and `warmupGroups` `useMemo` hooks in `page.tsx`.
- The data for this page lives in `public/junioren/`. Update those JSON files directly (or via external tooling) to change the available sessions and warm-up links. JSON generated postbuild from app/junioren/\_lib/file-manifest.json via scripts/generate-file-manifest.js – run pnpm build:clean after manifest changes.
- The `localStorage` logic for favorites includes a migration step to combine old keys into a new, unified key.

## Development Notes

- Colocation: Use \_components/ and \_lib/ for private route logic (non-routable).
- Static Export: Page pre-built; no runtime data fetching – all from public/ JSON.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
