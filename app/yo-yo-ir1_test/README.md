# Yo-Yo IR1 Test Interface

## Overview

This page provides an interactive, real-time tool for administering and recording the Yo-Yo Intermittent Recovery Test Level 1. It features a synchronized timer, audio cues, and controls for managing player performance during the test, including issuing warnings and recording eliminations.

## Component Structure

- **Main Page (`page.tsx`)**: A client-side component that dynamically loads the main test interface and fetches the initial list of players.
- **`YoYoTestInterface` (`_components/yo-yo-test-interface.tsx`)**: The core component that orchestrates the entire test. It integrates all sub-components and manages the overall UI.
- **Sub-components (`_components/`)**:
  - **`ControlPanel`**: Provides buttons for starting, pausing, stopping, and resetting the test.
  - **`StatisticsDashboard`**: Displays real-time metrics like current level, speed, and total distance.
  - **`TimerDisplay`**: Shows the main test timer.
  - **`PlayerEventList`**: Lists players who have been warned or eliminated.
  - **`PlayerActionDialog`**: A modal for manually recording a player's warning or elimination.

## State Management & Logic

- **`useYoYoTest` Hook (`_hooks/use-yo-yo-test.ts`)**: This is the brain of the feature. It's a complex custom hook that manages the entire test state machine using a `requestAnimationFrame` loop for a precise, drift-free timer. It processes shuttle events, calculates statistics, and handles all player state changes.
- **`useAudioManager` Hook (`_hooks/use-audio-manager.ts`)**: Manages the playback of spoken audio cues for player warnings and eliminations, providing real-time feedback to the test administrator.

## Data Flow

1.  `page.tsx` fetches an initial list of player names from `public/yo-yo/players.json`.
2.  The `useYoYoTest` hook generates the complete test protocol via `_lib/generate-shuttle-events.ts`, which derives precise timestamps and details for every event (beeps, turns, pauses, etc.) from a compact configuration.
3.  Shuttle beeps are generated on the fly via the Web Audio API and scheduled from the same drift-free timer that powers
    `useYoYoTest`.
4.  User interactions (e.g., clicking "Warn Player") trigger state updates in the hook, which then may trigger audio cues via the `useAudioManager` hook.

## Key Features

- **Real-time Test Administration**: A fully functional interface to run the Yo-Yo IR1 test.
- **Synchronized Audio**: Shuttle tones are generated programmatically and share the same timer as the UI, guaranteeing perfect
  sync.
- **Player Management**: Functionality to issue warnings and record eliminations for players in real-time.
- **Live Statistics**: Displays current level, speed, distance, and shuttles completed.
- **Level Jumping**: Allows the administrator to jump to any level for practice or specific training scenarios.
- **Spoken Audio Feedback**: The `useAudioManager` provides optional spoken alerts (e.g., "Warning, Finley", "Levi, out at 600 meters").

## AI Agent Notes

- This is a highly interactive and stateful client-side application. The core logic is almost entirely contained within the `useYoYoTest` hook.
- When making changes, be mindful of the tight coupling between the timer loop, the shuttle event data, and the UI state updates.
- The shuttle protocol now comes from `_lib/generate-shuttle-events.ts`, with supporting assets like audio and player lists remaining in `public/`.

## Development Notes

- Colocation: \_components/, \_hooks/, \_lib/ for private test logic (non-routable).
- Static Export: Pre-built; player list from public/yo-yo/players.json – events generated client-side.
- Refer to .vscode/project-structure.md for up-to-date file organization and imports.
