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

## Video.js Player Integration

The library now offers a feature-parity Video.js implementation in parallel to the custom HTML5 player. A toggle in `page.tsx` allows you to switch between both experiences, making it easy to validate Video.js functionality inside the existing UX without duplicating layout code.

### Core Components

- **`VideoJsPlayer` (`@/components/video-js/videojs-player`)** renders the Video.js instance together with the playlist sidebar. It accepts `VideoJsPlaylistItem[]` data, rich configuration objects, and playlist callbacks for analytics or custom state sync.
- **`videojs-demo.tsx`** (client component) showcases advanced scenarios—adaptive HLS, manual quality switching, and mobile-first layouts—using the shared demo data utilities.
- **`demo-data.ts`** supplies production-ready sample playlists, helpers to convert existing `PlaylistItem`/`Video` structures, configuration presets, and conversion utilities such as `convertVideoToVideoJsPlaylist`.

### Converting Existing Data

1. Generate `PlaylistItem[]` from your `VideoData` — either map chapters manually or use existing helpers such as `convertVideoToVideoJsPlaylist`.
2. Call `convertPlaylistItemsToVideoJs` or `convertVideoToVideoJsPlaylist` to enrich each entry with Video.js sources, text tracks, and metadata.
3. Pass the resulting `VideoJsPlaylistItem[]` into `VideoJsPlayer` together with an appropriate `VideoJsPlayerConfig` and `PlaylistConfig`.

The conversion helpers normalise durations, guarantee HTTPS URLs, attach multi-quality MP4 sources, add adaptive HLS/DASH manifests, and include multilingual WebVTT tracks by default.

If you don't want to use the conversion helpers, here's a minimal example showing how to map a `Video` with chapters into a `PlaylistItem[]` manually:

```tsx
// Minimal manual mapping example
import type { Video, PlaylistItem } from '@/lib/video-data';

function mapVideoToPlaylist(video: Video): PlaylistItem[] {
  if (!video.chapters || video.chapters.length === 0) {
    return [
      {
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        sources: [{ src: video.url, type: 'video/mp4' }],
      },
    ];
  }

  return video.chapters.map((chapter, i) => ({
    id: `${video.id}-c-${i}`,
    title: chapter.title || `${video.title} — Kapitel ${i + 1}`,
    description: chapter.description || video.description,
    duration:
      chapter.duration ||
      (chapter.end && chapter.start
        ? chapter.end - chapter.start
        : video.duration),
    // Provide the same video source but include optional start/end metadata if your player supports it
    sources: [{ src: video.url, type: 'video/mp4' }],
    // optional metadata used by some players
    startTime: chapter.start,
    endTime: chapter.end,
  }));
}
```

### Usage Example

```tsx
import VideoJsPlayer from '@/components/video-js/videojs-player';
import {
  demoPlaylistConfig,
  demoVideoJsPlayerConfig,
  hlsStreamingDemoPlaylist,
} from '@/components/video-js/demo-data';

export function VideoJsExample() {
  return (
    <VideoJsPlayer
      playlist={hlsStreamingDemoPlaylist}
      playerConfig={demoVideoJsPlayerConfig}
      playlistConfig={demoPlaylistConfig}
      autoPlay
    />
  );
}
```

### Configuration Highlights

- **Adaptive Streaming**: HLS and DASH manifests are bundled with each demo item. Enable or disable auto-advance via `playerConfig.autoAdvance.enabled`.
- **Manual Quality Levels**: Provide a `VideoJsSource[]` when you need explicit quality labels (1080p/720p/480p). Combine with `qualitySelector.disableAuto` to force manual selection.
- **Thumbnails**: `playerConfig.thumbnails` wires VTT thumbnail sprites; set `showTimestamp` for progress scrub previews.
- **Playlists**: `playlistConfig` controls sidebar behaviour (collapsible mode, thumbnail visibility, titles) and is optimised for both desktop and mobile viewports.
- **Resilience**: `createResilientVideoJsConfig` layers error display and manifest redirect handling on top of any base config—useful for production hardening.

### Mobile-First Considerations

The `mobileFirstDemoPlaylist` plus `mobileVideoJsPlayerConfig` demonstrate portrait aspect ratios, condensed playback controls, and a compact sidebar (`compactPlaylistConfig`). Combine these with touch-friendly toggles from the demo component when testing breakpoints.

### Plugin & Browser Requirements

- **videojs-http-streaming** powers the adaptive HLS playback (already bundled via Video.js).
- **videojs-contrib-quality-levels** and **videojs-hls-quality-selector** enable quality menus and automatic detection of manual/auto streams.
- **videojs-vtt-thumbnails** renders sprite maps in the seek bar.

Ensure VTT files and manifest URLs are accessible via HTTPS in local development to avoid mixed-content issues.

For a full API reference covering props, events, and extensibility patterns, see `components/video-js/README.md`.

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

## Zukünftige Verbesserungen

Kurzfristig geplante Verbesserungen und mögliche Erweiterungen:

- Tiefere Analytics-Hooks: Event-basierte Tracking-APIs (play, pause, chapter change, buffering) mit konfigurierbaren Exportern (server, Segment, Google Analytics).
- Offline-Caching & Prefetch: Background-Download von nächsten Playlist-Items, persistenten Cache über Service Worker und optionaler Offline-Playback-UI.
- Mobile Gestures: Erweiterte Touch-Gesten (zwei-Finger-Zoom, horizontales Kapitel-Scrubben, Swipe-to-skip) und bessere ergonomische Steuerung für kleine Bildschirme.
- Verbesserte Untertitel- & Mehrsprach-Unterstützung: Automatische Fallbacks, Subtitle styling-Einstellungen und synchronisierte Kapitel-Metadaten in mehreren Sprachen.
- Robustere Streaming-Fallbacks: Manifest-Fallbacks zwischen HLS/DASH/MP4, verbesserte Fehlerbehandlung und automatischer Qualitäts-Redownshift bei schlechten Verbindungen.
- Accessibility & Keyboard: Vollständige WCAG-Verbesserungen, ARIA-Labels für alle Controls und umfassende Keyboard-Shortcuts.
- Editor für Kapitel/Playlist: Ein kleines Admin-UI zum Erstellen/Anpassen von Kapiteln, Dauer-Resync und Metadaten-Editing direkt im Browser.

Diese Liste ist nicht abschließend und dient als Orientierung für zukünftige Iterationen.
