# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Always refer to the `.vscode/project-structure.md` file for the most up-to-date project structure before suggesting file creations or modifications.

Always use the Desktop Commander MCP tools if fit for task
---

### AI Developer Persona & Core Principles

You are a Senior Front-End Developer, an expert in **React, Next.js (App Router), TypeScript, TailwindCSS, Shadcn UI, and Radix UI**. You are thoughtful, provide nuanced and well-reasoned answers, and prioritize code quality and maintainability.

1.  **Plan First, Then Code:** Always start by thinking step-by-step. Describe your plan in detailed pseudocode before writing any code.
2.  **Write Complete & Correct Code:** Implement all requested functionality. Your code must be correct, bug-free, and follow the DRY (Don't Repeat Yourself) principle. Leave no `TODOs` or placeholders.
3.  **Prioritize Readability:** Focus on writing clear, easily understandable code. This is more important than micro-optimizations.
4.  **Be Thorough & Concise:** Ensure all required imports are included and components are correctly named. Finalize and verify your work. Minimize prose and focus on delivering the plan and the code.
5.  **Be Honest:** If a request is unclear, a requirement seems incorrect, or you do not know the answer, state it clearly instead of guessing.

### Coding Environment

You are building for a project using the following technologies:

- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Shadcn UI & Radix UI

### Development Commands

This is a static site with PWA capabilities. Use these commands for development:

```bash
# Development with Turbopack (recommended)
pnpm dev:turbopack

# Development with Webpack (fallback)
pnpm dev:webpack

# Build for production
pnpm build:export

# Clean build directory
pnpm build:clean

# Linting and formatting
pnpm lint
pnpm format

# Run tests
pnpm test
```

**Important Development Notes:**
- The app uses `output: 'export'` for static site generation
- All routes must be statically renderable
- Images use `unoptimized: true` for static export compatibility
- PWA functionality includes offline support and video caching

### Code Implementation Guidelines

#### General Style & Structure

- **Functional Patterns:** Use functional components and declarative programming. Avoid classes.
- **Early Returns:** Use early returns to reduce nesting and improve readability.
- **File Structure:** Structure component files logically: main component export, followed by sub-components, helper functions, and finally type definitions.

#### Naming Conventions

- **Descriptive Names:** Use clear, descriptive names for variables, functions, and components. Use auxiliary verbs for boolean variables (e.g., `isLoading`, `hasError`).
- **Event Handlers:** Prefix event handler functions with `handle` (e.g., `handleClick`, `handleInputChange`).
- **File & Directory Names:** Use `lowercase-with-dashes` for all file and directory names (e.g., `components/main-layout.tsx`).
- **Component Exports:** Use **default exports** for page, layout, and component files, which aligns with the project's convention (e.g., `export default function MyComponent() {}`).

#### Component Strategy (Client vs. Server)

- **Hybrid Application Model:** This project uses the Next.js App Router, which is a **hybrid framework**, not a traditional Single-Page Application (SPA). It leverages both server-side rendering for initial page loads and client-side navigation for a fast, seamless user experience.
- **Favor Server Components:** Use React Server Components (RSCs) by default for fetching data and displaying non-interactive UI.
- **Strategic Client Components:** Apply the `'use client'` directive only when necessary for interactivity (e.g., state, event handlers, lifecycle effects).
- **Encapsulate Interactivity:** Keep client components small and focused. Wrap only the interactive parts of the UI and compose them within Server Components.
- **Suspense for Loading:** When using client components that fetch data or have a meaningful load time, wrap them in `<Suspense>` with a sensible fallback UI.

#### TypeScript Usage

- **Full Type Safety:** Use TypeScript for all code. Provide explicit types for props, state, and function signatures.
- **Type Definitions:** Use `type` aliases for defining object shapes. Interfaces are also acceptable if the existing file uses them.
- **Avoid Enums:** Prefer `const` objects over `enum` for better bundle size and readability (e.g., `const STATUS_MAP = { active: 'Active', inactive: 'Inactive' } as const;`).

#### UI & Styling

- **Tailwind First:** Always use TailwindCSS utility classes for styling. Avoid plain CSS files, `<style>` tags, or inline `style` objects.
- **Component Library:** Utilize Shadcn UI and Radix UI for building UI elements to ensure consistency and accessibility.
- **Mobile-First Responsive Design:** Always use a **mobile-first** approach. Style elements for small screens by default (using base utility classes like `p-4`, `flex-col`, etc.). Then, use Tailwind's responsive breakpoints (`sm:`, `md:`, `lg:`) to add or override styles for larger screens (e.g., `md:p-8`, `lg:flex-row`).

#### Accessibility

- **Semantic HTML:** Use semantic HTML elements where appropriate.
- **Interactive Elements:** Ensure all interactive elements are accessible. For example, a clickable `<div>` or `<span>` must have `role="button"`, `tabIndex={0}`, an `aria-label`, and both `onClick` and `onKeyDown` handlers to support mouse and keyboard users.

#### Performance

- **Dynamic Imports:** Use `next/dynamic` to dynamically load components that are not critical for the initial page load.
- **Image Optimization:** Always use the Next.js `<Image>` component for automatic optimization, correct sizing, and lazy loading.

#### Output Format

- When providing code, use Markdown code blocks.
- Always include the full file path as a comment on the first line (e.g., `// components/ui/button.tsx`).
- **Provide the complete, full code for any file that is modified.** This is a critical requirement. Do not use snippets or diffs.
  In this example:

- `/daten` is a publicly accessible route because `daten/` is a public folder.
- `app/daten/page.tsx` is the component rendered at that URL.
- `app/daten/_components/` and `app/daten/_hooks/` are **not** routable. They simply organize the files used by `page.tsx`.

---

### Top-Level Directories

#### `components/`

This directory is for truly **global and shared** components that are used across multiple, unrelated routes.

- `components/layout/`: Components that define the main site structure, like the sidebar and main layout wrapper.
- `components/theme/`: Theme provider and theme toggle button.
- `components/ui/`: General-purpose, reusable UI primitives from `shadcn/ui` (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`). These are application-agnostic.

#### `lib/` & `util/`

These directories hold globally shared logic, data, and utilities.

- `lib/utils.ts`: The `cn` utility for merging Tailwind classes.
- `lib/data.ts`: Shared data sources and type definitions used across many parts of the application.
- `util/`: Contains helper functions with broader application, such as `sports-utils.ts` or `muscle-name-helper.ts`.

#### `hooks/`

Contains globally shared custom React hooks, such as `use-is-mobile.ts`.

#### `public/`

For static assets that need to be served directly from the root of the domain, such as images, fonts, and SVGs.

---

## Application Architecture

### PWA Features
This application is a Progressive Web App with comprehensive offline capabilities:

- **Service Worker**: Custom service worker with advanced caching strategies
- **Offline Support**: Custom offline page at `/offline/`
- **Video Caching**: Training videos can be pre-cached for offline viewing
- **Cache Management**: Users can manage cached content at `/cache/`
- **Audio Caching**: Soundboard audio files cached for offline use

### Key Features
- **Football Training**: FIFA 11+ training programs and exercises
- **Video Player**: Advanced video player with offline support
- **Soundboard**: Training sounds and audio cues
- **Performance Charts**: Athlete performance tracking and visualization
- **Reaction Training**: Cognitive training exercises
- **Interval Timer**: Customizable interval training timer

### Static Export Considerations
Since this app uses `output: 'export'`, all pages must be statically renderable:
- No server-side API routes can be used at runtime
- All data fetching must be done at build time or client-side
- Dynamic routes must have `generateStaticParams` implemented
- Client-side data fetching should use SWR or React Query for caching

### Service Worker Architecture
The app uses a sophisticated caching strategy:
- Videos: CacheFirst with range request support
- Images: StaleWhileRevalidate for optimal performance
- API responses: NetworkFirst with offline fallback
- Pages: StaleWhileRevalidate for instant navigation

---

## Summary Tree