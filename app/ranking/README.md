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

## Development Notes

- Colocation: No \_lib/ (data in lib/); add if route-specific.
- Static Export: Pre-built; data from lib/data.ts – no runtime.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
