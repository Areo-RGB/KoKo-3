# Repository Guidelines

> 📚 **For detailed AI configuration**: See [AI-CONFIG.md](.github/AI-CONFIG.md) and [AI-QUICK-REFERENCE.md](.github/AI-QUICK-REFERENCE.md)

## Project Structure & Module Organization
- `app/` App Router routes, pages, layouts, server/client components.
- `components/` Reusable UI; shadcn UI in `components/ui`.
- `lib/` Server-side and shared utilities; `hooks/` React hooks.
- `public/` Static assets; `types/` shared TypeScript types; `util/` helpers.
- `data/` JSON/content sources; `docs/` documentation; `scripts/` node/CLI scripts.
- Import via `@/*` alias (see `tsconfig.json`). Client components must not import Node-only modules (`fs`, `path`, etc.); ESLint enforces this.

## Build, Test, and Development Commands
- `pnpm dev` (preferred) or `npm run dev`: Start Next.js dev server (Turbopack).
- `pnpm dev:webpack`: Dev server with webpack.
- `pnpm build`: Production build. `pnpm build:clean` clears `.next`/`out` then builds.
- `pnpm start`: Start built app. `pnpm serve` serves `out/` if a static export is used.
- **`pnpm format`**: Auto-format all code (run after generating code).
- **`pnpm lint`**: ESLint errors only (build-breaking issues).
- `pnpm format:check`: Prettier validation.
- `pnpm test` / `pnpm test:watch`: Jest unit tests.

## AI-Optimized Configuration

### Linting: Errors Only
ESLint configured to show **only build-breaking errors**:
- ❌ `no-undef` - Undefined variables
- ❌ `react-hooks/rules-of-hooks` - Hook violations
- ❌ `react/jsx-key` - Missing keys
- ❌ `no-restricted-imports` - Node.js in client components

All style rules disabled - handled by Prettier auto-formatting.

### Auto-Formatting
Prettier enforces consistent, AI-friendly patterns:
- 80-char line width (fits AI context windows)
- Explicit syntax (semicolons, arrow parens)
- Single quotes, trailing commas
- Auto-organized imports (organize-imports plugin)
- Auto-sorted Tailwind classes (tailwindcss plugin)

### TypeScript: Strict Mode
- `strict: true` for maximum type safety
- `forceConsistentCasingInFileNames: true`
- Modern target (ES2020) for better inference
- Flexible on unused vars/params during development

## Coding Style & Naming Conventions
- TypeScript, 2-space indent, semicolons, single quotes, trailing commas (see `prettier.config.js`).
- **Always run `pnpm format` after generating code** - ensures consistency.
- Keep imports ordered; Tailwind classes auto-sorted (Prettier plugins).
- Components: PascalCase (`UserCard.tsx`); files in `app/` use Next patterns (`page.tsx`, `layout.tsx`).
- Variables/functions: camelCase; constants UPPER_SNAKE_CASE.

## AI Code Generation Patterns

### Client Components
```typescript
'use client';
import React from 'react'; // Always import React
import { Button } from '@/components/ui/button'; // Use path aliases

// ❌ NO: import fs from 'fs';
// ❌ NO: import path from 'path';

interface Props {
  title: string;
}

export const MyComponent: React.FC<Props> = ({ title }) => {
  return <Button>{title}</Button>;
};
```

### Server Components
```typescript
import fs from 'fs/promises'; // OK in server components
import path from 'path';

export default async function Page() {
  const data = await fs.readFile(/* ... */);
  return <div>{data}</div>;
}
```

### Custom Hooks
```typescript
import { useEffect, useState } from 'react';

export const useData = () => {
  const [data, setData] = useState<string[]>([]);
  
  useEffect(() => {
    // Logic here
  }, []); // No exhaustive-deps warnings
  
  return { data, setData };
};
```

## Testing Guidelines
- Framework: Jest. Place tests beside sources as `*.test.ts`/`*.test.tsx`.
- Test hooks and utilities deterministically; stub network and time.
- Aim for meaningful coverage on new/changed code; no hard threshold yet.
- Run `pnpm test` locally and in CI before opening PRs.

## Commit & Pull Request Guidelines
- Use Conventional Commits going forward: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
  - Example: `feat: add collapsible sections to sidebar`.
- PRs must include: clear description, linked issues, screenshots for UI, and notes on breaking changes/migrations.
- Pre-submit checklist: 
  1. **`pnpm format`** - Auto-format code
  2. **`pnpm lint`** - Check critical errors
  3. **`pnpm build`** - Type check + build
  4. **`pnpm test`** - Run tests

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Use `NEXT_PUBLIC_` only for values safe for the client.
- Review `vercel.json` and deployment envs before enabling features touching S3/Cloudinary/R2.
- Keep large/static assets in `public/` and optimize via existing scripts in `scripts/` when applicable.

## File Structure Convention

```
app/
  [route]/
    page.tsx              # Route entry (server by default)
    layout.tsx            # Layout wrapper
    _components/          # Private: Client components
    _lib/                 # Private: Server utilities
    _hooks/               # Private: Custom hooks
    _types/               # Private: Type definitions
    _data/                # Private: Route-specific data

components/               # Global shared components
  ui/                     # Shadcn UI primitives
  layout/                 # Layout components
  
lib/                      # Global utilities (server-safe)
hooks/                    # Global custom hooks
util/                     # Helper functions
types/                    # Global type definitions
```

---

**Quick Start for AI Agents**:
1. Generate code following patterns above
2. Run `pnpm format` to auto-format
3. Run `pnpm lint` to check errors
4. Run `pnpm build` to validate

