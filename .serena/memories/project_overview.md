# Project Overview: FC Hertha 03 Football Training Application

## Project Purpose
This is a comprehensive football training management application for FC Hertha 03 IV. It serves as a digital platform for:
- Managing junior football training sessions (A-Junioren through E-Junioren)
- Providing FIFA 11+ training programs and exercises
- Video-based training content with offline capabilities
- Performance tracking and visualization for athletes
- Interactive training tools (reaction training, interval timer, soundboard)

## Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: TailwindCSS v4.1.12 with mobile-first responsive design
- **UI Components**: Shadcn UI v3.4.2 + Radix UI primitives
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Package Manager**: pnpm v10.15.1
- **Deployment**: Static site generation with `output: 'export'`

## Key Features
1. **Progressive Web App (PWA)** with comprehensive offline support
2. **Service Worker** with intelligent caching strategies
3. **Video Player** with offline viewing capabilities
4. **Junior Training Management** with DFB curriculum integration
5. **Performance Charts** using Chart.js
6. **Reaction Training** cognitive exercises
7. **Interval Timer** for custom training sessions
8. **Soundboard** with audio cues for training

## Architecture Notes
- **Static Export**: All routes must be statically renderable
- **Hybrid Rendering**: Server Components by default, Client Components for interactivity
- **Path Aliases**: `@/` for root-level imports
- **Component Organization**: Global components in `/components`, route-specific in `_components/`
- **Data Storage**: JSON files in `/public` for static access, localStorage for user preferences

## Development Environment
- **Node.js**: >=20
- **Platform**: Windows/WSL development environment
- **Source Control**: Git with conventional workflow
- **Code Quality**: ESLint + Prettier with AI-friendly configuration