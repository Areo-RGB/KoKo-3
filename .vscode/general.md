# Project Structure Guide

This document outlines the project structure, with a focus on how we use **colocation** and **private folders** within the Next.js `app` directory. This approach helps keep related files (components, hooks, utilities) organized alongside the routes that use them, without creating unintended public routes.

## Core Philosophy: Colocation with Private Folders

The primary organizational principle is **colocation**. We group files by feature or route, rather than by file type. This means a route's specific components, hooks, and utility functions live inside that route's directory.

To prevent these colocated files from being treated as public URL segments by the Next.js App Router, we place them inside **private folders**. A private folder is any folder whose name is prefixed with an underscore (`_`), for example: `_components`, `_lib`, `_hooks`.

**Benefits:**

1.  **Improved Organization**: All files related to a specific page or feature are located in one place, making them easier to find and manage.
2.  **Clearer Dependencies**: It's immediately obvious which components or hooks are specific to a certain route.
3.  **Route Safety**: The underscore prefix guarantees that Next.js will never create a route from that folder, preventing accidental exposure of internal files.
4.  **Maintainability**: Refactoring or deleting a route is simpler because all its associated files can be removed at once.

---

## Directory Breakdown

### `app/` Directory

The `app` directory is the heart of the application, containing all routes and UI logic.

#### Routing and Special Files

- **Folders create routes**: Each folder inside `app` (that doesn't start with `_`) maps to a URL segment. For example, `app/dashboard/` corresponds to the `/dashboard` route.
- `page.tsx`: The main page component for a route segment. This is what users see.
- `layout.tsx`: A UI shell that wraps a route segment and its children. The root layout in `app/layout.tsx` is shared across the entire application.
- `global-error.tsx`: The global error boundary for the application.

#### Private Folders (`_folderName`)

This is the key to our colocation strategy. Any folder prefixed with an underscore is opted out of routing.

- `_components/`: Contains React components that are only used by the page or layout within the same route segment.
- `_hooks/`: Contains custom React hooks specific to the logic of a single route.
- `_lib/` or `_utils/`: Contains utility functions, data fetching logic, or type definitions relevant only to that route.
- `_styles/`: For CSS Modules or style-related files specific to a route.
- `_tests/`: For tests related to a specific route.

#### Example: The `/daten` Route

The structure for the `/daten` page illustrates this pattern perfectly:
app/
└── daten/
├── \_components/ # Private: Not a route. Contains components for the DatenPage.
│ ├── FullscreenToggle.tsx
│ ├── StatsTable.tsx
│ └── TableControls.tsx
├── \_hooks/ # Private: Not a route. Contains hooks for the DatenPage.
│ └── use-sports-data.ts
└── page.tsx # Public Route: Renders at /daten
code
Code
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

## Summary Tree
