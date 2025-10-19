# Code Style & Conventions Guide

## File Structure & Organization
- **Naming**: `lowercase-with-dashes` for all files and directories
- **Component Exports**: Default exports only (`export default function ComponentName()`)
- **File Layout**: Main component → sub-components → helpers → type definitions
- **Colocation**: Route-specific logic in `_components/` and `_lib/` directories

## Code Patterns
- **Functional Components Only**: No classes, use functional patterns with hooks
- **Early Returns**: Reduce nesting, improve readability
- **Server Components First**: Use RSCs by default, add `'use client'` only when necessary
- **Encapsulate Interactivity**: Keep client components small and focused

## TypeScript Conventions
- **Explicit Types**: Provide types for props, state, and function signatures
- **Type Aliases**: Use `type` over `interface` for object shapes
- **No Enums**: Prefer `const` objects with `as const` assertion
- **Path Mapping**: Use `@/` alias for clean imports

## Naming Conventions
- **Components**: PascalCase (e.g., `TrainingCard`, `VideoPlayer`)
- **Variables**: camelCase with descriptive names
- **Booleans**: Prefix with auxiliary verbs (`isLoading`, `hasError`, `canSubmit`)
- **Event Handlers**: Prefix with `handle` (`handleClick`, `handleSubmit`)
- **Files**: lowercase-with-dashes (`training-session.tsx`, `use-cache-manager.ts`)

## Styling Guidelines
- **TailwindCSS Only**: No plain CSS files or inline styles
- **Mobile-First**: Base styles for mobile, responsive breakpoints for larger screens
- **Utility Classes**: Use Tailwind's utility classes consistently
- **Component Library**: Leverage Shadcn UI and Radix UI components

## Import Organization
- **Auto-organized**: Prettier plugin handles import organization
- **Path Aliases**: Use `@/components`, `@/lib`, `@/hooks` consistently
- **Type Imports**: Use `import type` for type-only imports when beneficial

## ESLint Configuration
- **AI-Friendly**: Non-critical rules disabled for flexibility
- **Error-Only**: Only build/runtime breaking rules as errors
- **Client/Server Separation**: Prevents Node.js imports in client components

## Prettier Configuration
- **Consistent Formatting**: 2 spaces, 80 character line width
- **Trailing Commas**: All trailing commas for stable diffs
- **Arrow Parentheses**: Always for explicit syntax
- **Semicolons**: Always for ASI clarity