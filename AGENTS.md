Of course. I've combined the relevant information from `AGENTS.md` and `.github/copilot-instructions.md` into a single, comprehensive guide for AI assistants. The file `GEMINI.md` was for a different project, so its contents were not included.

This new file, `.github/copilot-instructions.md`, is now the single source of truth. The other two files can be deleted.

Here is the updated and consolidated guide:

```markdown
// .github/copilot-instructions.md
# QuoVadis Sports Training - AI Agent Guide

Next.js 15 PWA for offline-capable sports training with video content management, built for German youth soccer programs.

## Architecture Overview

**Next.js 15 App Router** with static export (`output: 'export'`), PWA capabilities via `next-pwa`, and advanced offline video caching. The app serves as a coaching tool with FIFA 11+, agility drills, ball mastery exercises, and performance tracking.

### Key Technical Decisions

1.  **Static Export + PWA**: All routes pre-rendered for deployment to static hosting; service worker (`sw-custom.js`) handles offline functionality
2.  **Colocation Pattern**: Route-specific code lives in private folders (`_components/`, `_lib/`, `_hooks/`, `_types/`, `_data/`) within `app/[route]/` to keep related logic together. The underscore prefix prevents these folders from being treated as routes.
3.  **Video Architecture**: Two content types—`chapters` (single video with timestamps) and `playlist` (multiple videos). Video content is hosted on a cloud object store (e.g., DigitalOcean Spaces, Cloudflare R2, Cloudinary).
4.  **Client-First UI**: Most interactivity in client components; server components only where beneficial for static generation

## Critical File Locations

```
app/
  layout.tsx              # Root layout: PWA metadata, client-app-shell wrapper
  [route]/
    page.tsx              # Route entry (server or client component)
    _components/          # Route-specific client components (PRIVATE)
    _lib/                 # Route-specific utilities/data (PRIVATE)
    _hooks/               # Route-specific hooks (PRIVATE)
    _types/               # Route-specific TypeScript types (PRIVATE)
    _data/                # Route-specific data, e.g., JSON (PRIVATE)

components/
  ui/                     # shadcn/ui primitives (Button, Card, Dialog, etc.)
  layout/                 # App shell (sidebar, mobile nav, fullscreen toggle)
  theme/                  # Theme provider & toggle
  timer/                  # Timer overlay component

lib/
  utils.ts                # cn() for Tailwind class merging
  video-data.ts           # Central video database with categories & chapters
  cache-manager.ts        # Service worker cache utilities

public/
  sw-custom.js            # Custom service worker (VIDEO CACHING CRITICAL)
  manifest.json           # PWA manifest
  assets/                 # Icons, images, SVGs

next.config.mjs           # PWA config, webpack customizations
tsconfig.json             # Strict mode, @/* path aliases
prettier.config.js        # 80-char lines, auto-organize imports
```

## Development Workflows

### Commands (pnpm required)
```bash
# Core Development
pnpm dev              # Turbopack dev server (default)
pnpm dev:webpack      # Webpack dev server (fallback)
pnpm build            # Production build with static export
pnpm build:clean      # Clean .next/ and out/ before build

# Code Quality & Testing
pnpm format           # Prettier auto-format (ALWAYS run after code gen)
pnpm lint             # ESLint (only 4 rules—build-breaking errors)
pnpm test             # Jest (tests live near implementation)

# AI Assistant Integration
pnpm claude           # Run Claude AI assistant
pnpm qwen             # Run Qwen AI assistant
```

### Video Processing Workflow (Python & Node Scripts)
Located in `scripts/`:
1.  **Download & Clip**: `process-video.py <config.json>` (uses yt-dlp + ffmpeg)
2.  **Upload to Cloud**: `upload-to-cloudinary.py <config.json>` or use R2-specific scripts (e.g., `r2-upload.cjs`) for bulk uploads.
3.  **Update `lib/video-data.ts`**: Add new entries to `videoDatabase` array

See `scripts/README.md` for detailed examples.

## Environment & Configuration

-   **Node.js**: Requires Node.js version 20 or higher (as specified in `package.json` engines).
-   **TypeScript**: `tsconfig.json` is configured with `noUnusedLocals: false` and `noUnusedParameters: false` to allow for development flexibility.
-   **React**: The project may include specific overrides for packages like `react-is` in `package.json` to ensure compatibility between dependencies.

## Code Patterns & Conventions

### Import Organization (Auto-Sorted)
```typescript
// External packages first
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Internal imports (@/* aliases)
import { cn } from '@/lib/utils';
import { VideoPlayer } from './_components/video-player';
```

### Client vs Server Components
```typescript
// CLIENT: Use 'use client' directive, access browser APIs, hooks
'use client';
import React from 'react';
import { useVideoCache } from '@/hooks/use-video-cache';

// SERVER (default): Can import Node.js modules, fetch at build time
import fs from 'fs/promises';
import path from 'path';
```

**ESLint enforces**: Client components (`components/**/*.tsx`, `app/**/_components/**/*.tsx`) CANNOT import `fs`, `path`, `crypto`, etc.

### Styling with Tailwind
```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  'flex items-center gap-2',
  isActive && 'bg-primary text-primary-foreground',
  className // Accept external className prop
)} />
```

### Video Data Structure
```typescript
// lib/video-data.ts exports:
export interface VideoData {
  id: string;
  type: 'chapters' | 'playlist';  // CRITICAL distinction
  videoUrl?: string;               // For 'chapters' type
  chapters: VideoChapter[];        // timestamps OR individual URLs
}

// 'chapters': single video with startTime/endTime
// 'playlist': chapters have individual videoUrl
```

## PWA & Offline Strategy

### Service Worker Caching (`public/sw-custom.js`)
-   **Videos**: CacheFirst with RangeRequestsPlugin (enables seeking in cached videos). Use the `useVideoCache()` hook for programmatic caching.
-   **Images**: StaleWhileRevalidate (show cached, update background)
-   **Pages**: NetworkFirst with offline fallback (`/offline/`)
-   **Cache Limits**: 50 videos (30 days), 100 images (30 days)

### Key Components
-   `/cache/` - User-facing cache management (download content for offline)
-   `/offline/` - Offline fallback page (shown when no network + no cache)
-   `hooks/use-video-cache.ts` - React hook for video caching API
-   `components/video-cache-manager.tsx` - UI for batch video caching

**Testing Offline**: DevTools → Application → Service Workers → check "Offline"

## Project-Specific Constraints

1.  **No Google Fonts**: Removed to avoid build-time network fetch; uses system fonts
2.  **Webpack Cache Disabled**: `cache: false` in `next.config.mjs` to prevent build issues
3.  **Images Unoptimized**: `unoptimized: true` for static export compatibility
4.  **German UI**: All user-facing text in German (labels, descriptions, error messages)
5.  **Path Aliases Only**: Always use `@/*` imports (never relative `../../` beyond 1 level)

## Common Tasks for AI Agents

### Add New Route with Video Player
1.  Create `app/[route-name]/page.tsx` (client component if interactive)
2.  Add `_components/` for route-specific UI (e.g., `playlist-view.tsx`, `video-player.tsx`)
3.  Add `_data/` or `_lib/` with route-specific constants (playlist, video URLs)
4.  Import types from `lib/video-data.ts` or a local `_types/` file.
5.  Use `VideoPlayer` component (handles Plyr.js integration)

### Add Videos to Central Database
Edit `lib/video-data.ts`:
```typescript
export const videoDatabase: VideoData[] = [
  // ... existing entries
  {
    id: 'my-new-drill',
    title: 'New Drill Title',
    category: 'Agility & Speed',
    type: 'playlist', // or 'chapters'
    playlistTitle: 'Display Name',
    chapters: [
      {
        id: 'drill-1',
        title: 'Drill 1',
        videoUrl: 'https://data-h03.fra1.cdn.digitaloceanspaces.com/...',
      },
    ],
  },
];
```

### Modify Sidebar Navigation
Edit `components/layout/sidebar.tsx` - menu items structured by category.

### Add shadcn/ui Component
```bash
# Use CLI to add new primitives
npx shadcn@latest add [component-name]
```
Components auto-install to `components/ui/`.

## Linting Philosophy

**Only 4 ESLint Rules (Errors Only)**:
1.  `no-undef` - Undefined variables
2.  `react-hooks/rules-of-hooks` - Hook violations
3.  `react/jsx-key` - Missing list keys
4.  `no-restricted-imports` - Node.js in client components

Everything else is handled by TypeScript strict mode + Prettier auto-formatting.

## Testing Notes

-   Jest configured but minimal coverage currently
-   Tests go next to implementation: `my-component.test.tsx`
-   Run `pnpm test` or `pnpm test:watch`
-   Mock service worker with `jest-environment-jsdom`

## Reference Documentation

-   **`.github/AI-CONFIG.md`**: Detailed config explanations
-   **`.github/AI-QUICK-REFERENCE.md`**: One-page cheat sheet
-   **`docs/OFFLINE-PWA-GUIDE.md`**: Complete PWA/caching architecture
-   **`docs/VIDEO-CACHING.md`**: Video cache implementation details
-   **`scripts/README.md`**: Video processing workflow

---

**Remember**: Format (`pnpm format`) → Lint (`pnpm lint`) → Build (`pnpm build`) before committing.
```