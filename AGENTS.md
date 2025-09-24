# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands (Non-Obvious)

- Clean build: `pnpm build:clean` (removes .next/out before next build; required after data changes).
- Dev with Turbopack: `pnpm dev` (default; fallback `pnpm dev:webpack` if hangs due to cache=false in next.config.mjs).
- Lint: `pnpm lint` (next lint --strict; ignores build errors but errors on no-undef/hooks).
- Test: `pnpm test` (jest; no config, uses defaults). Single file: `jest app/path/to/file.test.tsx`. Colocate .test.tsx with source (not **tests**).
- Serve static: `pnpm serve out -p 3001` (for debugging exported build).

## Code Style Guidelines (From Configs, Non-Obvious)

- Prettier: printWidth:80 (AI chunk-friendly), arrowParens:'always' (explicit), trailingComma:'all' (stable diffs), singleQuote:true, semi:true.
- ESLint: Client components (\_components/ and app/\*\*/\_components/) block Node imports (fs/path/child_process/os) as errors. Unused vars/any as warns (not errors).
- TS: Strict mode; prefer const objects over enums (e.g., lib/data.ts maps); no explicit return types.
- Naming: Event handlers prefix 'handle' (e.g., handleClick); files/directories lowercase-with-dashes.
- UI: Always use cn(lib/utils.ts) for Tailwind class merging.
- Imports: No restricted paths in client code; update types/ for public shape changes.
