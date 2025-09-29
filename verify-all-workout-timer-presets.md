I have the following verification comments after thorough review and exploration of the codebase. Implement the comments by following the instructions in the comments verbatim.

---
## Comment 1: Timer RAF loop captures stale state so elapsed time never advances beyond the first frame.

In `app/interval-timer/_hooks/use-interval-timer.ts`, refactor the rAF loop to mirror `use-yo-yo-test.ts`: maintain a `stateRef` and current time ref updated on each render, and have `tick` compute `newTime` from those refs so elapsed time advances correctly.

### Referred Files
- /home/nwender/Koko-3/app/interval-timer/_hooks/use-interval-timer.ts
---
## Comment 2: Preset uses exercise type “reps” but the type definition only allows “work” | “hold”.

Update `app/interval-timer/_lib/types.ts` so `ExerciseType` (and any switch logic) includes the `'reps'` variant used by the Hamstrings preset, and ensure the UI handles that type without breaking.

### Referred Files
- /home/nwender/Koko-3/app/interval-timer/_lib/types.ts
- /home/nwender/Koko-3/app/interval-timer/_lib/presets.ts
---
## Comment 3: Phase-change audio effect never fires, so the beeps promised by the plan won’t play.

In `app/interval-timer/_hooks/use-interval-timer.ts`, replace the cleanup-based phase comparison with a `useRef` (or `usePrevious`) that keeps the previous `activePhase`, and on each render detect changes to trigger the audio callbacks.

### Referred Files
- /home/nwender/Koko-3/app/interval-timer/_hooks/use-interval-timer.ts
---