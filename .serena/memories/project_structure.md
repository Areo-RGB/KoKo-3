# Project Structure Guide

## Top-Level Directories

### `/app` - Next.js App Router Pages
- **Root**: `app/page.tsx` - Main entry point (redirects to dashboard)
- **Layout**: `app/layout.tsx` - Root layout with theme provider
- **Routes**: Various training modules and features
  - `junioren/` - Junior training management (complex client component)
  - `fifa-11-plus/` - FIFA training programs
  - `video-player/` - Advanced video player with offline support
  - `performance-charts/` - Athlete performance visualization
  - `reaction/` - Cognitive training exercises
  - `interval-timer/` - Custom interval training timer
  - `soundboard/` - Training audio cues
  - `dashboard/` - Main dashboard navigation

### `/components` - Global Shared Components
- **layout/**: Site structure components (sidebar, main layout)
- **theme/**: Theme provider and theme toggle
- **ui/**: Shadcn UI primitives (Button, Card, Input, etc.)

### `/lib` - Global Shared Logic
- **utils.ts**: `cn` utility for Tailwind class merging
- **data.ts**: Shared data sources and type definitions

### `/hooks` - Custom React Hooks
- **use-is-mobile.ts**: Mobile detection hook
- **use-outside-click.ts**: Click outside detection

### `/public` - Static Assets
- **assets/**: Images, fonts, SVGs served from root
- **junioren/**: Training session data JSON files
- **training-directories/**: Additional training resources

### `/util` - Helper Functions
- **sports-utils.ts**: Sport-specific utility functions
- **muscle-name-helper.ts**: Muscle-related helpers

## Route Organization Pattern
```
app/
├── route-name/
│   ├── page.tsx              # Main page component
│   ├── _components/          # Route-specific components (non-routable)
│   ├── _hooks/              # Route-specific hooks
│   ├── _lib/                # Route-specific utilities
│   └── README.md            # Documentation
```

## Import Path Aliases
```typescript
@/components/*     → components/
@/lib/*           → lib/
@/hooks/*         → hooks/
@/utils/*         → util/
```

## Static Export Considerations
- All data must be statically available or fetched client-side
- No server-side API routes at runtime
- Dynamic routes need `generateStaticParams`
- Client-side data fetching recommended (SWR/React Query)