# Koko Project Overview

## Project Purpose
Koko is a comprehensive sports training management system, specifically designed for junior football teams (A-E Junioren). The application provides tools for managing training sessions, warm-up exercises, performance analysis, and various sports-related features.

## Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and localStorage for persistence
- **Build Tool**: Turbopack (default) with webpack fallback
- **Package Manager**: pnpm
- **Deployment**: Static export mode for static hosting

## Key Dependencies
- **UI Framework**: shadcn/ui with Radix UI components
- **Icons**: Lucide React and Tabler Icons
- **Animations**: Framer Motion
- **Data Visualization**: Recharts, React Table
- **Video**: Plyr React, React Player
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with various plugins
- **Fonts**: Geist font family

## Main Features
1. **Junior Training Management**: Comprehensive system for A-E junior teams
2. **Performance Analysis**: Yo-Yo IR1 test tracking and visualization
3. **Muscle Diagram**: Interactive exercise mapping
4. **Video Player**: Training video playback with playlists
5. **Data Tables**: Performance ratings and analytics
6. **FIFA Cards**: Interactive player cards with animations
7. **Dashboard**: Central navigation hub

## Application Structure
The app uses Next.js App Router with feature-based organization:
- Each major feature has its own `/app/[feature]` directory
- Components are organized in `_components` subdirectories
- Business logic in `_lib` subdirectories
- Data files in `_data` subdirectories where applicable