# Project Structure

## Root Directory
```
Koko/
├── app/                    # Next.js App Router pages
├── components/             # Shared UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Shared utilities
├── types/                  # Global type definitions
├── util/                   # Utility functions
├── public/                 # Static assets
├── scripts/                # Build and data generation scripts
└── .vscode/, .cursor/      # Editor configurations
```

## App Directory Structure
Each feature follows this pattern:
```
app/[feature]/
├── page.tsx               # Main page component
├── README.md              # Feature documentation
├── _components/           # Feature-specific components
│   ├── component-1.tsx
│   └── index.ts          # Component exports
├── _lib/                  # Business logic and utilities
│   ├── types.ts          # Feature-specific types
│   ├── constants.ts      # Feature constants
│   └── data.ts           # Data processing
└── _data/                 # Static data files (JSON)
    └── feature-data.json
```

## Main Features
- **dashboard/**: Landing page with navigation
- **junioren/**: Junior training management (most complex)
- **yo-yo-ir1-timeline/**: Performance visualization
- **yo-yo-ir1_test/**: Interactive performance testing
- **muscle-diagram/**: Exercise mapping
- **video-player/**: Training video management
- **data-table-demo/**: Performance analytics
- **fifa-cards/**: Interactive player cards
- **ranking/**: Performance rankings

## Components Directory
```
components/
├── ui/                    # shadcn/ui components
├── theme/                 # Theme management
├── layout/                # Layout components
├── animate-ui/            # Animation components
└── orgin-ui/              # Custom UI components
```

## Configuration Files
- **next.config.mjs**: Next.js configuration
- **tsconfig.json**: TypeScript configuration
- **components.json**: shadcn/ui configuration
- **prettier.config.js**: Code formatting rules
- **.eslintrc.json**: Code quality rules
- **package.json**: Dependencies and scripts

## Data Flow
1. Static data in `_data/` directories
2. Processing logic in `_lib/` directories  
3. Type definitions in `_lib/types.ts`
4. Components consume processed data
5. State management via React hooks + localStorage