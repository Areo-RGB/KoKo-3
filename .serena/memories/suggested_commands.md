# Suggested Commands for Koko Project

## Development Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm dev:webpack` - Start development server with webpack
- `pnpm build` - Build for production (includes post-build scripts)
- `pnpm build:clean` - Clean build (removes .next and out directories)
- `pnpm build:export` - Build and export static files
- `pnpm start` - Start production server
- `pnpm serve` - Serve static export on port 3001

## Code Quality
- `pnpm lint` - Run ESLint with strict mode
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without changes
- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run Jest in watch mode

## Data Generation
- `pnpm generate:warmups` - Generate warm-up data JSON
- `pnpm generate:sessions` - Generate sessions data JSON
- `pnpm postbuild` - Run all post-build data generation scripts

## AI Assistant Commands
- `pnpm claude` - Start Claude Code CLI (skip permissions)
- `pnpm qwen` - Start Qwen CLI

## Windows System Commands
- `dir` - List directory contents (Windows)
- `type` - Display file contents (Windows equivalent of cat)
- `findstr` - Search text in files (Windows equivalent of grep)
- `powershell` - Start PowerShell
- `cmd` - Start Command Prompt

## Git Commands
- `git status` - Check repository status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit with message
- `git push` - Push changes to remote
- `git pull` - Pull changes from remote

## Package Management
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add development dependency
- `pnpm remove <package>` - Remove dependency