# Repository Guidelines

## Project Structure & Module Organization
- Colocation drives structure: keep feature-specific components, hooks, and helpers beside the route under `app/<route>/`; use route-level `_components/` and `_hooks/` folders for client code.
- `app/` also contains layouts and server components; promote shared pieces to `components/`, `hooks/`, or `lib/` only when reused by multiple routes.
- `data/` and `types/` hold static datasets and public TypeScript contracts—update both when you change exposed fields.
- `public/` stores static assets, `docs/` keeps reference material, and `scripts/` houses maintenance/export scripts.
- Tests live next to their subjects as `.test.tsx` or `.test.ts`; avoid creating a top-level `tests/` directory.

## Build, Test, and Development Commands
- `pnpm dev`: Launch the Turbopack dev server (switch to `pnpm dev:webpack` if cache issues appear).
- `pnpm build:clean`: Clear `.next/` and `out/` before a production build; required after tweaking exported data.
- `pnpm lint`: Run `next lint --strict` to surface `no-undef`, invalid hook usage, and formatting drift.
- `pnpm test`: Execute the Jest suite; target one spec with `pnpm test -- app/path/file.test.tsx`.
- `pnpm serve out -p 3001`: Preview the static export to replicate production behaviour.

## Coding Style & Naming Conventions
- Prettier enforces `printWidth: 80`, `singleQuote: true`, `arrowParens: 'always'`, and trailing commas—run `pnpm lint` or rely on editor format-on-save.
- TypeScript is strict; prefer typed objects over enums and resolve `any` warnings quickly.
- Name event handlers with a `handle` prefix, keep files and directories lowercase-with-dashes, and always merge Tailwind classes with `cn` from `lib/utils.ts`.
- Client components must not import Node-only modules (`fs`, `path`, etc.); keep server logic in server components or shared utilities.

## Testing Guidelines
- Use Jest with React Testing Library patterns; mirror component structure in colocated `.test.tsx` files.
- Cover new behaviour, data edges, and async flows; snapshot UI components when markup shifts.
- Run `pnpm test` (optionally with `--watch`) before opening a pull request.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`) with imperative summaries (e.g., `feat: add carousel autoplay`).
- Keep pull requests focused, document the change set, link related issues, and attach screenshots or recordings for UI updates.
- Flag schema changes, manual steps, and follow-up tasks so reviewers can validate end-to-end.
