You are absolutely right. My apologies for not providing them for all pages in the previous step. Ensuring every page has clear, specific documentation is crucial for maintainability.

I have now analyzed every page component in the `app` directory and generated a detailed `README.md` for each one. These new READMEs provide a much deeper insight into each page's specific role, data flow, and key components, which will be very helpful for any developer or AI agent working on them.

Here are all the new and updated files, including the `copilot-instructions.md` and all page-specific READMEs.

```markdown
# .github/copilot-instructions.md
# AI Assistant Guide for the Koko Project

This guide provides essential, actionable knowledge for an AI assistant to be productive in this codebase.

## 1. Big Picture: A Statically Exported Next.js App

- **Framework**: This is a **Next.js 15 (App Router)** application that is configured for **static export** (`output: 'export'` in `next.config.mjs`). This means no dynamic server-side rendering on request; all pages are pre-built at build time.
- **UI & Styling**: The UI is built with **React 19**, **Tailwind CSS**, and **shadcn/ui** components. Global, reusable UI primitives are in `components/ui/`, while layout components are in `components/layout/`.
- **Architecture: Colocation is Key**: The project uses a feature-based structure within the `app/` directory. Route-specific components, hooks, and data logic are colocated inside **private folders** (e.g., `_components/`, `_lib/`) to keep them organized without creating public URL segments. For example, `app/dashboard/_components/` contains components used only by the `/dashboard` route. For more details, refer to `.vscode/project-structure.md`.
- **Data Flow**: Data is sourced from local files (`.json`, `.csv`, `.ts` modules, and markdown in `.benchmark/`). Crucially, several scripts in the `scripts/` directory (e.g., `generate-sessions-json.js`) run during the `postbuild` step to process and generate JSON data consumed by the application. This is a form of build-time data fetching.

## 2. Developer Workflow & Commands

- **Package Manager**: The project uses **pnpm**. Always use `pnpm` for installing dependencies (`pnpm install`).
- **Development Server**: Use `pnpm dev` to start the fast Turbopack dev server.
- **Build Process**: The full build and export process is `pnpm build`. This runs `next build` and then the `postbuild` scripts in `package.json`.
- **Linting & Formatting**: Run `pnpm lint` and `pnpm format` to check code quality. Note that `next.config.mjs` is set to `eslint.ignoreDuringBuilds: true`, so builds will succeed even with lint errors.

## 3. Project Conventions & Patterns

- **Imports**: Always use the `@/*` path alias for absolute imports from the project root (e.g., `import { Button } from '@/components/ui/button'`).
- **Component Strategy**:
    - Default to React Server Components (RSCs).
    - Only add the `'use client'` directive for components that require interactivity (state, hooks, event listeners). Keep client components small and specific.
- **File Naming**: Use `kebab-case` for all files and directories (e.g., `app/data-table-demo/`, `video-player.tsx`).
- **Data Modules**: Feature-specific data is often loaded and processed in colocated `_lib/` or `_data/` folders. For example, `app/junioren/_lib/e-junior-data.ts` defines data structures for that specific route.
- **File Manifest**: The `junioren` feature uses a manifest system (`app/junioren/_lib/file-manifest.json`) to manage hundreds of static training files. This is generated at build time by `scripts/generate-file-manifest.js`. When working on this feature, use the helpers in `app/junioren/_lib/file-utils.ts` to safely access file paths.

## 4. Key Files & Examples to Reference

- **Configuration**:
    - `next.config.mjs`: Note `output: 'export'` and `trailingSlash: true`, which are critical for the static build.
    - `package.json`: Check the `"scripts"` section for build-time data generation commands (`postbuild`).
    - `.vscode/project-structure.md`: The definitive guide to the project's folder organization.
- **Feature Examples**:
    - `app/junioren/page.tsx`: A complex client component with extensive filtering, state management, and interaction with the file manifest system.
    - `app/data-table-demo/page.tsx`: An example of a server component that fetches and processes local data for a complex table.
    - `app/video-player/page.tsx`: Shows how video data is loaded and presented in a grid, launching a full-screen player.
```

```markdown
# app/README.md
# Root Page (`/`)

## Overview

This is the root entry point of the application, located at `app/page.tsx`. Its sole responsibility is to redirect users to the main dashboard page at `/dashboard`.

## Component Structure

- **`HomePage` (`page.tsx`)**: A simple client component that uses the `useRouter` hook from `next/navigation` to perform an immediate client-side redirect.

## Key Features

- **Automatic Redirect**: Uses a `useEffect` hook to call `router.replace('/dashboard')` as soon as the component mounts. `router.replace` is used instead of `router.push` to prevent the root page from being added to the browser's history stack.
- **Loading State**: While the redirect is happening (which is nearly instantaneous), a simple loading spinner and text ("Weiterleitung zum Dashboard...") are displayed to provide user feedback.

## File Location

`app/page.tsx`

## AI Agent Notes

This page is purely for navigation and contains no business logic or data. When asked to modify the application's landing page, the agent should understand that the actual content is at `/dashboard` and this page just handles the initial routing.
```

```markdown
# app/dashboard/README.md
# Dashboard Page (`/dashboard`)

## Overview

The Dashboard serves as the main landing page and central navigation hub for the application. It presents a visually engaging grid of cards that link to the application's core features.

## Components Structure

- **`Page` (`page.tsx`)**: The main page component that sets up the layout, including the header with breadcrumbs, and renders the `Dashboard` component.
- **`Dashboard` (`_components/dashboard.tsx`)**: A simple wrapper component that composes the main content.
- **`Content` (`_components/content.tsx`)**: Renders the `FeaturesSectionDemo` component.
- **`FeaturesSectionDemo` (`_components/features-section.tsx`)**: This is the core UI component for this page. It's a client component (`'use client'`) that maps over a `navigationCards` array to render a grid of feature cards. It also includes a decorative, animated grid background effect.

## Data Flow

- The content is static and hardcoded within the `FeaturesSectionDemo` component in the `navigationCards` array. There is no external data fetching.
- Each card in the grid is a `next/link` that navigates the user to a different feature page (e.g., `/data-table-demo`, `/muscle-diagram`).

## Key Features

- **Feature Navigation**: Provides clear, icon-driven links to all major sections of the application.
- **Responsive Grid**: The layout adjusts from a single column on small screens to multiple columns on larger screens.
- **Interactive Hover Effects**: Cards have a subtle scale-up effect on hover.
- **Animated Background**: A dynamic `GridPattern` SVG background adds visual interest.

## File Location

`app/dashboard/page.tsx` and its colocated components in `app/dashboard/_components/`.

## AI Agent Notes

- This page is the primary entry point for users after the initial redirect.
- To add or modify a feature link on the dashboard, you need to edit the `navigationCards` array in `app/dashboard/_components/features-section.tsx`.
- The page uses the colocation pattern, with all its specific components stored in the `_components` sub-directory.
```

```markdown
# app/data-table-demo/README.md
# Data Table Demo Page (`/data-table-demo`)

## Overview

This page provides a comprehensive demonstration of a data table for displaying and analyzing sports performance data. It features advanced functionality including sorting, multi-column filtering, column visibility toggles, and pagination.

## Component Structure

- **`DataTableDemoPage` (`page.tsx`)**: A **Server Component** that fetches and processes the raw player performance data on the server using `_lib/data.ts`.
- **`DataTable` (`_components/data-table.tsx`)**: A **Client Component** (`'use client'`) that receives the processed data and handles all user interactions. It uses `@tanstack/react-table` to manage the table state.
- **`columns` (`_components/columns.tsx`)**: Defines the structure, headers, and cell rendering for each column in the table. It also includes sorting toggles.

## Data Flow

1.  The server component `DataTableDemoPage` calls `getPlayerData()` from `app/data-table-demo/_lib/data.ts`.
2.  `getPlayerData()` is a server-only function that reads and parses local JSON files (`players.json`, `metrics.json`) using `fs/promises`.
3.  The raw data is processed, and percentile ranks (`prRank`) are calculated for each real player.
4.  The fully processed data array is passed as a prop to the `DataTable` client component.
5.  `DataTable` uses this data to initialize `@tanstack/react-table` and manages all client-side state (sorting, filtering, pagination).
6.  Cell background colors are determined by `_lib/color.ts`, which uses performance tiers defined in `_lib/performance_ratings.json`.

## Key Features

- **Server-Side Data Processing**: Initial data load is handled on the server for performance.
- **Client-Side Interactivity**: All table interactions (sorting, filtering) are handled instantly on the client.
- **Multi-faceted Filtering**: Users can filter by player name (text search) and category (dropdown).
- **Conditional Rendering**: The table can toggle the visibility of "benchmark" players and apply a color scale to cells based on performance.
- **Custom Column Definitions**: Columns are defined with custom renderers for badges, formatted numbers, and actions.

## File Location

`app/data-table-demo/page.tsx` and its colocated components and data logic in `app/data-table-demo/_components/` and `app/data-table-demo/_lib/`.

## AI Agent Notes

- This page is a prime example of a hybrid component pattern. The parent page is a Server Component for efficient data loading, while the interactive table itself is a Client Component.
- When modifying table logic or adding features, you will likely need to edit `_components/data-table.tsx` (for interactivity) and `_components/columns.tsx` (for display).
- The data source is local JSON, processed at build time on the server. There are no live API calls.
```

```markdown
# app/fifa-cards/README.md
# FIFA Cards Animation Page (`/fifa-cards`)

## Overview

This page presents a visually immersive, animated showcase of FIFA-style player cards. It features an infinite vertical scroll effect, 3D card tilt on hover, and a dynamic starfield background that reacts to mouse movement.

## Component Structure

- **`FifaCardsPage` (`page.tsx`)**: The main client component (`'use client'`) that sets up the scene and orchestrates the different animation components.
- **`InfiniteMovingCometCards` (`_components/infinite-moving-comet-cards.tsx`)**: This component is responsible for the continuous vertical scrolling animation of the cards. It duplicates the list of cards to create a seamless loop.
- **`CometCard` (`components/ui/comet-card.tsx`)**: A wrapper component that applies the 3D tilt effect to individual cards on mouse hover using Framer Motion (`motion/react`).
- **`StarsBackground` / `StarLayer` (`_components/stars.tsx`)**: These components create the multi-layered, animated starfield background that subtly moves with the cursor.

## Data Flow

- The `fifaImages` array in `page.tsx` contains a static list of image filenames.
- This array is mapped to a format suitable for the `InfiniteMovingCometCards` component.
- All content is static and hardcoded; there is no external data fetching.

## Key Features

- **Infinite Scrolling Animation**: Cards scroll vertically in a seamless, continuous loop.
- **3D Tilt Effect**: Cards tilt in 3D space based on the user's cursor position, creating an interactive "comet" effect.
- **Parallax Starfield Background**: A multi-layered background of stars moves at different speeds, creating a sense of depth that reacts to mouse movement.
- **Glassmorphism UI**: The cards and container use a frosted glass effect with `backdrop-blur`.
- **Touch Controls**: On mobile, swiping left/right can pause/resume the animation.

## File Location

`app/fifa-cards/page.tsx` and its colocated components in `app/fifa-cards/_components/`.

## AI Agent Notes

- This page is a heavily visual, animation-focused feature. The core logic is driven by the **Framer Motion** library (`motion/react`).
- The infinite scroll is achieved by rendering the list of cards twice within a vertically animating container.
- The 3D effect in `CometCard` is created using CSS `perspective` and Framer Motion's `useSpring` and `useTransform` hooks to translate mouse movement into `rotateX` and `rotateY` transforms.
- When modifying this page, be mindful of performance, as multiple layers of animations can be resource-intensive.
```

```markdown
# app/junioren/README.md
# Junior Training Management Page (`/junioren`)

## Overview

This is the central hub for accessing DFB (German Football Association) training session materials for various junior age groups (A-Junior to E-Junior). It's a highly interactive client-side application that allows users to filter, search, and manage a large library of training content.

## Component Structure

- **`JuniorenTrainingPage` (`page.tsx`)**: The main client component (`'use client'`) that manages all state and renders the UI. It handles fetching data, filtering, searching, and managing user interactions.
- **`CacheControl` (`_components/cache-control.tsx`)**: A component that allows users to download training materials for offline access using the browser's Cache API, managed via a Service Worker.
- **`useCacheManager` Hook (`hooks/use-cache-manager.ts`)**: Provides the logic for interacting with the Service Worker to cache files, check status, and clear caches.

## Data Flow

1.  **Training Sessions**: The page fetches a master list of all training sessions from a static JSON file at `public/junioren/training-sessions.json`. This file is generated at build time by `scripts/generate-sessions-json.js`.
2.  **Warm-up Links**: When the "Aufwärmen" category is selected, the page dynamically fetches warm-up exercise links from `public/junioren/aufwaermen-links.json`, which is also generated at build time.
3.  **File Manifest**: The application relies on `app/junioren/_lib/file-manifest.json` to know which HTML and PDF files actually exist. This prevents broken links. File paths are resolved using helpers from `app/junioren/_lib/file-utils.ts`.
4.  **Favorites**: Favorite sessions are stored in the user's `localStorage` under the key `junior-favorites`.

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
- The data for this page is pre-processed and generated at build time by scripts in the `scripts/` directory. The page itself consumes static JSON files.
- The `localStorage` logic for favorites includes a migration step to combine old keys into a new, unified key.
```

```markdown
# app/muscle-diagram/README.md
# Interactive Muscle Diagram (`/muscle-diagram`)

## Overview

This page features an interactive anatomical diagram that allows users to explore exercises and stretches for different muscle groups. It uses SVG maps for both front and back views of the human body, with hover and click interactions to display relevant training information.

## Component Structure

- **`MuscleDiagramPage` (`page.tsx`)**: The main client component (`'use client'`) that manages the state for hovered and selected muscles and orchestrates the UI.
- **`Carousel` (`components/ui/carousel.tsx`)**: A shadcn/ui component used to switch between the front and back view of the muscle diagram.
- **`InteractiveMuscleSVG` (`_components/interactive-muscle-svg.tsx`)**: A key component that fetches and renders an SVG file. It attaches event listeners (`mouseenter`, `mouseleave`, `click`) to the paths within the SVG to detect user interaction with specific muscle groups.
- **`ExerciseFullscreenOverlay` (`_components/exercise-fullscreen-overlay.tsx`)**: A modal component that displays exercise and stretching videos in a fullscreen view when a user selects a muscle and chooses an exercise type.

## Data Flow

1.  The `InteractiveMuscleSVG` component fetches SVG content from `public/assets/svg/front.svg` or `public/assets/svg/back.svg`.
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

```markdown
# app/ranking/README.md
# Player Rankings Page (`/ranking`)

## Overview

This page displays player performance rankings for various DFB (German Football Association) athletic tests. It features an interactive leaderboard for each exercise, with integrated video playback for available player performances.

## Component Structure

- **`HomePage` (`page.tsx`)**: The main client component (`'use client'`) that manages the state for the selected exercise, video playback, and user interactions.
- **`SelectNative` (`components/ui/select-native.tsx`)**: A native `<select>` dropdown used for choosing the exercise to display.
- **`MovingBorderButton` (`components/ui/moving-border.tsx`)**: A custom button with an animated border used to highlight the top-ranked player.
- **Video Player**: The page dynamically imports and instantiates the `plyr` video player library when a video is selected for playback.

## Data Flow

1.  The page imports static `sportsData` from `lib/data.ts`.
2.  The `getSportsDataWithRanks` utility from `util/sports-utils.ts` is called to process this raw data. This function calculates a rank for each player within each sport, handling ties correctly.
3.  The ranked data is then used to render the leaderboards.
4.  When a user clicks on a player with an available video, the `getVideoForPlayer` utility resolves the correct video URL, which is then passed to the `plyr` instance.

## Key Features

- **Dynamic Exercise Selection**: Users can switch between different athletic tests using a dropdown menu, and the leaderboard updates instantly.
- **Integrated Video Playback**: Clicking on a player with a video icon opens a full-overlay video player.
- **Dynamic Ranking**: Ranks are calculated on the fly based on player scores, correctly handling both "lower is better" (e.g., sprint times) and "higher is better" (e.g., juggling points) metrics.
- **Touch-to-Play**: The video player is optimized for mobile with touch-to-play/pause functionality.
- **Swipe-to-Adjust-Speed**: On mobile, users can swipe up or down on the video to control the playback speed, with a visual indicator for the current rate.
- **Top Rank Highlight**: The #1 ranked player for each exercise is highlighted with an animated "moving border" effect.

## File Location

`app/ranking/page.tsx`.

## AI Agent Notes

- The video player logic is a key part of this page. It uses a dynamic `import('plyr')` to lazy-load the player library only when needed. It manages the player instance lifecycle carefully using `useEffect` and `useRef`.
- The touch controls for playback speed are a unique feature implemented with `onTouchStart`, `onTouchMove`, and `onTouchEnd` event handlers.
- All data is static and processed on the client. The core ranking logic resides in `util/sports-utils.ts`.
```

```markdown
# app/video-player/README.md
# Video Player Library (`/video-player`)

## Overview

This page serves as a library for browsing and playing football training videos. It presents videos in a filterable grid layout. Clicking on a video opens a custom, full-screen video player with playlist functionality.

## Component Structure

- **`VideoPlayerPage` (`page.tsx`)**: The main client component (`'use client'`) that displays the grid of video thumbnails and manages the selection of a video to play.
- **`VideoPlayer` (`_components/video-player.tsx`)**: A full-screen video player component that takes over the view when a video is selected. It includes custom controls and an integrated playlist sidebar.
- **`PlaylistSidebar` (`_components/playlist-sidebar.tsx`)**: A component within the `VideoPlayer` that shows the list of videos or chapters, allowing users to navigate between them.
- **`VideoThumbnail` (`_components/video-thumbnail.tsx`)**: A component that displays a preview image for each video card. It intelligently tries to derive a thumbnail from a video URL if an explicit thumbnail isn't provided.
- **`VideoPlayerControls` (`_components/video-player-controls.tsx`)**: The custom UI for the video player, including play/pause, seek bar, volume, and fullscreen buttons.

## Data Flow

1.  The `VideoPlayerPage` imports the `videoDatabase` from `lib/video-data.ts`. This module contains a structured list of all videos, including metadata like title, category, and chapters or playlist items.
2.  Users can filter the videos by category using a dropdown. The filtering logic is handled by `getVideosByCategory`.
3.  When a user clicks a video card, `handleVideoSelect` is called, setting the `selectedVideo` state and opening the `VideoPlayer` component in a full-screen overlay.
4.  The `VideoPlayer` component uses the selected video data to generate a playlist and manage playback of the video or its chapters.

## Key Features

- **Categorized Video Library**: Videos are organized by categories like "Agility & Speed" and "Ball Control & Dribbling".
- **Grid Layout**: Videos are presented in a responsive grid of cards.
- **Custom Full-Screen Player**: An immersive player experience that replaces the library view.
- **Playlist Functionality**: The player includes a sidebar to navigate between videos in the same category or chapters within a single video.
- **Intelligent Thumbnails**: The `VideoThumbnail` component attempts to generate a preview image from video URLs, with fallbacks.
- **Deterministic Difficulty Badges**: A simple hashing function on the video ID assigns a "Leicht", "Mittel", or "Schwer" badge for visual variety.

## File Location

`app/video-player/page.tsx` and its colocated components in `app/video-player/_components/`.

## AI Agent Notes

- This page demonstrates a two-state UI: a library/browse view and a full-screen player view. The state `isPlayerOpen` in `page.tsx` controls which view is active.
- The `lib/video-data.ts` module is the single source of truth for all video content displayed on this page. To add a new video, that file must be updated.
- The player itself is a custom HTML5 video implementation, not a third-party library, giving full control over its appearance and behavior.
```

```markdown
# app/yo-yo-ir1-timeline/README.md
# Yo-Yo IR1 Timeline Page (`/yo-yo-ir1-timeline`)

## Overview

This page provides a comprehensive data visualization dashboard for analyzing Yo-Yo Intermittent Recovery Test Level 1 results. It presents the performance data of multiple players over time through a series of charts and an interactive timeline.

## Component Structure

- **Main Page (`page.tsx`)**: A **Server Component** that handles the initial data processing. It imports raw JSON data and uses a helper function to transform it into a structured format suitable for the charting components.
- **Chart Components (`_components/`)**: All components are client-side (`'use client'`) and use the `recharts` library for rendering.
    - **`YoYoIR1Timeline`**: Displays a horizontal, interactive timeline of test dates, showing player performance changes at each step.
    - **`ChartAreaInteractive`**: An area chart showing the absolute distance covered by each player over time. Includes an interactive legend to toggle player visibility.
    - **`ChartAreaPercent`**: A stacked area chart showing the percentage contribution of each player to the team's total distance for each test date.
    - **`YoYoCharts`**: A composite component that includes a line chart for a selected player's trend against the team average, and a bar chart ranking players by their latest performance.

## Data Flow

1.  The `page.tsx` Server Component imports raw data from `_data/yoyo-ir1-data.json`.
2.  This raw data is passed to the `processYoYoData` function in `_lib/process-yoyo-data.ts`. This function is the core of the data pipeline for this page. It validates the data using Zod, normalizes dates, groups records by player, and calculates aggregate statistics like daily averages and latest results.
3.  The resulting structured `YoYoData` object is passed as props to the various client-side chart components.
4.  Components like `ChartAreaPercent` perform additional client-side calculations (e.g., calculating percentage contributions) in `_lib/distance-helpers.ts`.

## Key Features

- **Multi-faceted Visualization**: Data is presented in four different ways (timeline, area chart, percentage chart, and bar/line charts) to provide a complete picture of performance.
- **Server-Side Data Processing**: Initial data transformation is done on the server at build time, ensuring a fast initial load.
- **Interactive Charts**: Users can hover over data points for details and use legends to filter the data shown in the charts.
- **Player-Specific Analysis**: The `YoYoCharts` component allows users to select a specific player and compare their performance against the team average.
- **Ranking**: A bar chart provides a clear ranking of players based on their most recent test results.

## File Location

`app/yo-yo-ir1-timeline/page.tsx` and its colocated components and data logic in `app/yo-yo-ir1-timeline/_components/` and `app/yo-yo-ir1-timeline/_lib/`.

## AI Agent Notes

- This page is an excellent example of a data visualization dashboard built with Next.js Server Components and client-side charting libraries.
- The data pipeline is a key concept: Raw JSON -> `processYoYoData` (server) -> Structured Props -> Chart Components (client).
- When modifying this page, be aware of the data structures defined in `lib/yoyo-data.ts` and how they are generated and consumed.
- The `recharts` library is the primary dependency for all visualizations.
```

```markdown
# app/yo-yo-ir1_test/README.md
# Yo-Yo IR1 Test Interface

## Overview

This page provides an interactive, real-time tool for administering and recording the Yo-Yo Intermittent Recovery Test Level 1. It features a synchronized timer, audio cues, and controls for managing player performance during the test, including issuing warnings and recording eliminations.

## Component Structure

- **Main Page (`page.tsx`)**: A client-side component that dynamically loads the main test interface and fetches the initial list of players.
- **`YoYoTestInterface` (`_components/yo-yo-test-interface.tsx`)**: The core component that orchestrates the entire test. It integrates all sub-components and manages the overall UI.
- **Sub-components (`_components/`)**:
    - **`ControlPanel`**: Provides buttons for starting, pausing, stopping, and resetting the test.
    - **`StatisticsDashboard`**: Displays real-time metrics like current level, speed, and total distance.
    - **`TimerDisplay`**: Shows the main test timer.
    - **`PlayerEventList`**: Lists players who have been warned or eliminated.
    - **`PlayerActionDialog`**: A modal for manually recording a player's warning or elimination.

## State Management & Logic

- **`useYoYoTest` Hook (`_hooks/use-yo-yo-test.ts`)**: This is the brain of the feature. It's a complex custom hook that manages the entire test state machine using a `requestAnimationFrame` loop for a precise, drift-free timer. It processes shuttle events, calculates statistics, and handles all player state changes.
- **`useAudioManager` Hook (`_hooks/use-audio-manager.ts`)**: Manages the playback of spoken audio cues for player warnings and eliminations, providing real-time feedback to the test administrator.

## Data Flow

1.  `page.tsx` fetches an initial list of player names from `public/yo-yo/players.json`.
2.  The `useYoYoTest` hook fetches the complete test protocol from `public/yo-yo/shuttle_events.json`. This JSON file contains precise timestamps and details for every event in the test (beeps, turns, pauses, etc.).
3.  The main audio track (`public/yo1.mp3`) is played and synchronized with the timer managed by the `useYoYoTest` hook.
4.  User interactions (e.g., clicking "Warn Player") trigger state updates in the hook, which then may trigger audio cues via the `useAudioManager` hook.

## Key Features

- **Real-time Test Administration**: A fully functional interface to run the Yo-Yo IR1 test.
- **Synchronized Audio**: The UI timer is synchronized with the official Yo-Yo test audio track.
- **Player Management**: Functionality to issue warnings and record eliminations for players in real-time.
- **Live Statistics**: Displays current level, speed, distance, and shuttles completed.
- **Level Jumping**: Allows the administrator to jump to any level for practice or specific training scenarios.
- **Spoken Audio Feedback**: The `useAudioManager` provides optional spoken alerts (e.g., "Warning, Finley", "Levi, out at 600 meters").

## AI Agent Notes

- This is a highly interactive and stateful client-side application. The core logic is almost entirely contained within the `useYoYoTest` hook.
- When making changes, be mindful of the tight coupling between the timer loop, the shuttle event data, and the UI state updates.
- The application relies on static JSON files in the `public/` directory for its core data. The `_lib/` folder contains the pure logic for processing this data.
```

```markdown
# app/normwerte/README.md
# Normative Data Page

## Overview

This page displays normative performance data for youth athletes, primarily sourced from DFB (German Football Association) talent development program benchmarks. It presents a simplified, interactive table showing the best and weakest performance values for various athletic tests across different age groups (U11-U15).

## Components Structure

- **Main Page (`page.tsx`)**: A Server Component that fetches the normative data and renders the main table component.
- **`SimpleDataTable` Component (`_components/simple-data-table.tsx`)**: A client-side component that provides an interactive table with filtering and sorting capabilities for the normative data.
- **`simpleColumns` (`_components/simple-columns.tsx`)**: Defines the table structure, including columns for metric, age, best value, and weakest value.

## Data Flow

1.  The `page.tsx` Server Component asynchronously calls `getSimpleNormativeData()` and `getSimpleCategories()` from `_lib/simple-data.ts`.
2.  These helper functions read and parse `_data/simple-normative-data.json`, which contains the aggregated benchmark data.
3.  The processed data is passed as props to the `SimpleDataTable` client component.
4.  The `SimpleDataTable` component handles all user interactions like filtering by age group, category, or metric, and sorting the columns.

## Key Features

- **Simplified Data View**: Shows the range of performance (best vs. weakest) for quick assessment.
- **Interactive Filtering**: Users can filter the data by category (e.g., "Sprint Tests"), age group (e.g., "U12"), and specific metric (e.g., "20m Sprint").
- **Sortable Columns**: All columns in the table are sortable.
- **Server-Side Data Loading**: The initial data is loaded on the server for fast page loads.

## File Location

`app/normwerte/page.tsx`

## AI Agent Notes

- The primary implementation for this page uses the files prefixed with `simple-` (e.g., `simple-data-table.tsx`, `simple-columns.tsx`, `simple-data.ts`). The other, more complex data table components (`data-table.tsx`, `columns.tsx`) are part of a previous iteration and are not currently used on this page.
- When modifying this page, focus on the "simple" implementation path. Data originates from the `simple-normative-data.json` file.