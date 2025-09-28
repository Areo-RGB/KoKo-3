# Repository Guidelines

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
- `pnpm lint`: ESLint (strict). `pnpm format` / `pnpm format:check`: Prettier.
- `pnpm test` / `pnpm test:watch`: Jest unit tests.

## Coding Style & Naming Conventions
- TypeScript, 2-space indent, semicolons, single quotes, trailing commas (see `prettier.config.js`).
- Keep imports ordered; Tailwind classes auto-sorted (Prettier plugins).
- Components: PascalCase (`UserCard.tsx`); files in `app/` use Next patterns (`page.tsx`, `layout.tsx`).
- Variables/functions: camelCase; constants UPPER_SNAKE_CASE.

## Testing Guidelines
- Framework: Jest. Place tests beside sources as `*.test.ts`/`*.test.tsx`.
- Test hooks and utilities deterministically; stub network and time.
- Aim for meaningful coverage on new/changed code; no hard threshold yet.
- Run `pnpm test` locally and in CI before opening PRs.

## Commit & Pull Request Guidelines
- Use Conventional Commits going forward: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
  - Example: `feat: add collapsible sections to sidebar`.
- PRs must include: clear description, linked issues, screenshots for UI, and notes on breaking changes/migrations.
- Pre-submit checklist: `pnpm format`, `pnpm lint`, `pnpm build`, `pnpm test` all pass.

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Use `NEXT_PUBLIC_` only for values safe for the client.
- Review `vercel.json` and deployment envs before enabling features touching S3/Cloudinary/R2.
- Keep large/static assets in `public/` and optimize via existing scripts in `scripts/` when applicable.
