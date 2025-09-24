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

## Development Notes

- Colocation: \_components/ for private player logic (non-routable).
- Static Export: Pre-built; videos/assets in public/ – no runtime fetches.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
