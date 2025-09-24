# Code Style and Conventions

## TypeScript Configuration
- **Target**: ES6
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **Path Mapping**: `@/*` points to project root

## Prettier Configuration
- **Semicolons**: Always required
- **Quotes**: Single quotes preferred
- **Trailing Commas**: Always (for stable diffs)
- **Tab Width**: 2 spaces
- **Print Width**: 80 characters
- **Bracket Spacing**: Enabled
- **Arrow Parens**: Always explicit
- **End of Line**: LF (Unix-style)
- **Plugins**: Tailwind CSS plugin for class sorting

## ESLint Rules
### Error Level (Site-breaking)
- `no-undef`: Error
- `react-hooks/rules-of-hooks`: Error

### Warning Level (Important but not breaking)
- `@typescript-eslint/no-unused-vars`: Warning
- `@typescript-eslint/no-explicit-any`: Warning
- `react-hooks/exhaustive-deps`: Warning
- `prefer-const`: Warning

### Disabled Rules
- Explicit function return types (inferred types preferred)
- Object shorthand enforcement
- Template literal enforcement

## File Organization
- Feature-based structure in `/app/[feature]`
- Components in `_components/` subdirectories
- Business logic in `_lib/` subdirectories  
- Types in `_lib/types.ts` or dedicated `types/` directory
- Data files in `_data/` subdirectories

## Component Conventions
- Use `'use client'` directive for client components
- Functional components with hooks
- JSX preserved (not compiled)
- Props typing with TypeScript interfaces
- Component export as default

## Import Restrictions
Client components cannot import:
- Node.js modules (fs, path, child_process, os)
- Server-only modules
- Data processing modules from other features

## Naming Conventions
- PascalCase for components and interfaces
- camelCase for variables and functions
- kebab-case for file names
- SCREAMING_SNAKE_CASE for constants