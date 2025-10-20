# Essential Development Commands

## Development Server
```bash
# Primary development (Turbopack + debugging + incognito)
pnpm dev:turbopack

# Fallback development (Webpack)
pnpm dev:webpack

# Clean development environment
pnpm clean:dev
```

## Build & Production
```bash
# Clean build directory
pnpm build:clean

# Build for static export
pnpm build:export

# Serve built site locally
pnpm serve
```

## Code Quality
```bash
# Lint with strict mode
pnpm lint

# Format code with Prettier
pnpm format

# Check formatting without fixing
pnpm format:check
```

## Testing
```bash
# Run tests
pnpm test
```

## System Utilities (Windows/WSL)
```bash
# Git operations
git status
git add .
git commit -m "message"
git push

# File operations
ls -la          # List files
cd directory    # Change directory
grep pattern    # Search in files
find . -name    # Find files

# Windows-specific via WSL
kill-port 3000  # Kill processes on port
```

## Package Management
```bash
# Install dependencies
pnpm install

# Add dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name
```

## Next.js Specific
```bash
# Generate static routes (if needed)
npx next build

# TypeScript checking
npx tsc --noEmit
```

## Development Workflow
1. Start with `pnpm dev:turbopack`
2. Make changes and test
3. Run `pnpm lint` and `pnpm format` before commits
4. Use `pnpm build:clean` to verify production build
5. Test with `pnpm serve` locally if needed