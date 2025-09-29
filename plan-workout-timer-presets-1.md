I have created the following plan after thorough exploration and analysis of the codebase. Follow the below plan verbatim. Trust the files and references. Do not re-verify what's written in the plan. Explore only when absolutely necessary. First implement all the proposed file changes and then I'll review all the changes together at the end.

### Observations

Die Anwendung ist eine Next.js 15 / React 19 Fitness-App mit TypeScript, Tailwind CSS und shadcn/ui Komponenten. Es gibt bereits eine ausgeklügelte Timer-Funktionalität im `yo-yo-ir1_test` Bereich mit requestAnimationFrame-basiertem Timing, Audio-Management und Phasen-basierter Logik. Die App folgt einem feature-basierten Organisationsmuster unter `/app/[feature-name]/` und nutzt Radix UI Primitives. Es existieren bereits Trainings- und Übungsdaten in JSON-Format, sowie ein Sidebar-Navigationssystem.

### Approach

Ich werde eine neue Interval-Timer Komponente erstellen, die das bewährte Architekturmuster der yo-yo-test Funktionalität adaptiert. Der Timer wird Workout-Presets mit konfigurierbaren Intervallen unterstützen (z.B. "Drill 1, 30s, 2 Sets"). Die Implementierung umfasst:

1. **Datenstrukturen** für Workout-Presets und Intervall-Phasen
2. **Custom Hook** für Timer-Logik mit requestAnimationFrame
3. **Audio-Management** für Start/End-Beeps basierend auf dem existierenden Audio-System
4. **UI-Komponenten** mit shadcn/ui für Preset-Auswahl und Timer-Steuerung
5. **Integration** in die bestehende Sidebar-Navigation

Die Lösung wird modular und wiederverwendbar sein, mit klarer Trennung zwischen Geschäftslogik und UI-Komponenten. Das neue Workout-Preset wird als "Stability & Core Training" integriert und umfasst verschiedene Übungstypen wie Planks, Balance-Übungen und Sprünge.

### Reasoning

Ich habe die Codebase analysiert und festgestellt, dass es sich um eine Next.js Fitness-App handelt. Ich untersuchte die bestehende Timer-Funktionalität im yo-yo-test Bereich und das Audio-Management-System. Dann prüfte ich die UI-Komponenten-Struktur, Datenorganisation und Navigationsmuster. Ich identifizierte, dass Audio-Dateien noch nicht vorhanden sind und dass die App einem feature-basierten Organisationsmuster folgt. Die Sidebar-Navigation und das Layout-System wurden ebenfalls analysiert, um die Integration zu verstehen.

## Mermaid Diagram

sequenceDiagram
    participant User
    participant UI as IntervalTimerInterface
    participant Hook as useIntervalTimer
    participant Audio as useIntervalAudio
    participant Logic as timer-logic
    
    User->>UI: Select "Stability & Core Training" Preset
    UI->>Hook: selectPreset(stabilityPreset)
    Hook->>Logic: calculatePhases(preset)
    Logic-->>Hook: phases array with side-specific exercises
    
    User->>UI: Click Start
    UI->>Hook: start()
    Hook->>Hook: Start RAF loop
    Hook->>Audio: playStartBeep()
    
    loop Timer Running
        Hook->>Logic: processTimerTick(currentTime)
        Logic-->>Hook: updated state
        Hook->>UI: state update
        UI->>User: Display time/phase/exercise
        
        alt Phase Transition
            Hook->>Audio: playEndBeep() / playRestBeep()
            Hook->>Logic: moveToNextPhase()
        end
        
        alt Side Change (e.g., Side Plank L->R)
            Hook->>Audio: playSideChangeBeep()
            Hook->>UI: Update side indicator
        end
        
        alt Set Complete
            Hook->>Audio: playTransitionBeep()
            Hook->>Logic: moveToNextSet()
        end
        
        alt Workout Complete
            Hook->>Audio: playFinishBeep()
            Hook->>UI: finished state
        end
    end
    
    User->>UI: Click Pause/Stop
    UI->>Hook: pause() / stop()
    Hook->>Hook: Stop RAF loop

## Proposed File Changes

### app/interval-timer(NEW)

Erstelle ein neues Verzeichnis für die Interval-Timer Funktionalität, das dem bestehenden Organisationsmuster der App folgt (ähnlich wie `yo-yo-ir1_test`, `fifa-11-plus`, etc.).

### app/interval-timer/page.tsx(NEW)

References: 

- app/yo-yo-ir1_test/page.tsx

Erstelle die Hauptseite für den Interval-Timer. Diese Seite wird die `IntervalTimerInterface` Komponente rendern und als Einstiegspunkt für die Funktionalität dienen. Verwende das gleiche Layout-Muster wie in anderen Feature-Seiten der App.

### app/interval-timer/_lib(NEW)

Erstelle ein Verzeichnis für die Geschäftslogik und Datenstrukturen des Interval-Timers, analog zu anderen Feature-Bereichen.

### app/interval-timer/_lib/types.ts(NEW)

References: 

- app/yo-yo-ir1_test/_lib/types.ts

Definiere TypeScript-Interfaces für den Interval-Timer:

- `WorkoutPreset`: Enthält id, name, description und intervals Array
- `IntervalPhase`: Definiert type ('work' | 'rest'), duration (Sekunden), name, reps (optional)
- `TimerState`: Verwaltet currentTime, isRunning, currentPhase, currentSet, totalSets, etc.
- `TimerPhase`: Enum für 'ready' | 'running' | 'paused' | 'finished'
- `AudioEvent`: Für Start/End-Beep Ereignisse
- `ExerciseType`: Enum für 'duration' | 'reps' | 'hold' um verschiedene Übungsarten zu unterstützen

Orientiere dich an der Struktur von `app/yo-yo-ir1_test/_lib/types.ts` für Konsistenz.

### app/interval-timer/_lib/presets.ts(NEW)

References: 

- app/interval-timer/_lib/types.ts(NEW)

Erstelle vordefinierte Workout-Presets als exportierte Konstante. Implementiere Beispiel-Presets wie:

- "Drill 1": 30s Arbeit, 10s Pause, 2 Sets
- "HIIT Basic": 45s Arbeit, 15s Pause, 8 Sets
- "Tabata": 20s Arbeit, 10s Pause, 8 Sets
- "Sprint Intervals": 60s Arbeit, 30s Pause, 6 Sets
- **"Stability & Core Training"**: Das neue Preset mit den spezifizierten Übungen:
  - Forearm Plank (30s, 3 Sets)
  - Side Forearm Plank (30s, 3 Sets pro Seite)
  - Hamstrings Beginner (5 Reps oder 60s, 1 Set)
  - Single Leg Stance mit Ball (30s, 2 Sets pro Bein)
  - Squats auf Zehenspitzen (30s, 2 Sets)
  - Vertikale Sprünge (30s, 2 Sets)

Jedes Preset sollte eine eindeutige ID, beschreibenden Namen und Array von IntervalPhase-Objekten enthalten. Berücksichtige verschiedene Übungstypen (Hold, Reps, Duration) und seitenspezifische Übungen.

### app/interval-timer/_lib/timer-logic.ts(NEW)

References: 

- app/yo-yo-ir1_test/_lib/test-logic.ts

Implementiere die Kern-Timer-Logik mit Funktionen für:

- `processTimerTick`: Verarbeitet Timer-Updates und Phasenübergänge
- `calculateCurrentPhase`: Bestimmt aktuelle Phase basierend auf Zeit
- `calculateProgress`: Berechnet Fortschritt für UI-Anzeige
- `shouldTriggerAudio`: Bestimmt wann Audio-Events ausgelöst werden sollen
- `formatTime`: Formatiert Zeit für Anzeige (MM:SS)
- `handleSetTransitions`: Verwaltet Übergänge zwischen Sets und seitenspezifischen Übungen
- `calculateTotalWorkoutTime`: Berechnet Gesamtdauer eines Workouts

Verwende ähnliche Patterns wie in `app/yo-yo-ir1_test/_lib/test-logic.ts` für Konsistenz. Berücksichtige die Komplexität von seitenspezifischen Übungen und verschiedenen Übungstypen.

### app/interval-timer/_hooks(NEW)

Erstelle ein Verzeichnis für Custom Hooks, analog zu anderen Feature-Bereichen.

### app/interval-timer/_hooks/use-interval-timer.ts(NEW)

References: 

- app/yo-yo-ir1_test/_hooks/use-yo-yo-test.ts

Erstelle den Haupt-Hook für Timer-Funktionalität. Implementiere:

- useReducer für State-Management (ähnlich wie `use-yo-yo-test.ts`)
- requestAnimationFrame-basierte Timer-Schleife für präzises Timing
- Funktionen: start, pause, stop, reset, selectPreset
- Audio-Event-Triggers für Phasenübergänge
- Automatische Phasenübergänge und Set-Wiederholungen
- Spezielle Logik für seitenspezifische Übungen (z.B. "pro Seite")
- Unterstützung für verschiedene Übungstypen (Hold, Reps, Duration)

Verwende das bewährte Muster aus `app/yo-yo-ir1_test/_hooks/use-yo-yo-test.ts` als Vorlage für die Architektur.

### app/interval-timer/_hooks/use-interval-audio.ts(NEW)

References: 

- app/yo-yo-ir1_test/_hooks/use-audio-manager.ts

Erstelle einen spezialisierten Audio-Hook für Interval-Timer. Adaptiere die Funktionalität von `use-audio-manager.ts` für Interval-spezifische Bedürfnisse:

- `playStartBeep`: Spielt Start-Beep für Arbeitsphase
- `playEndBeep`: Spielt End-Beep für Phasenende
- `playRestBeep`: Spielt Beep für Pausenphase
- `playFinishBeep`: Spielt Beep für Workout-Ende
- `playTransitionBeep`: Spielt Beep für Set-Übergänge
- `playSideChangeBeep`: Spielt Beep für Seitenwechsel bei seitenspezifischen Übungen
- Muting-Funktionalität und Audio-Caching

Referenziere Audio-Dateien unter `/public/audio/interval/` (werden später erstellt).

### app/interval-timer/_components(NEW)

Erstelle ein Verzeichnis für UI-Komponenten des Interval-Timers.

### app/interval-timer/_components/interval-timer-interface.tsx(NEW)

References: 

- app/yo-yo-ir1_test/_components/yo-yo-test-interface.tsx

Erstelle die Haupt-UI-Komponente für den Interval-Timer. Diese Komponente orchestriert alle anderen Komponenten und verwaltet den globalen State. Verwende das Layout-Muster aus `app/yo-yo-ir1_test/_components/yo-yo-test-interface.tsx` als Referenz. Integriere PresetSelector, TimerDisplay, ControlPanel und ProgressIndicator Komponenten.

### app/interval-timer/_components/preset-selector.tsx(NEW)

References: 

- components/ui/select.tsx
- components/ui/card.tsx

Erstelle eine Komponente zur Auswahl von Workout-Presets. Verwende shadcn/ui Select-Komponente für die Dropdown-Auswahl. Zeige Preset-Namen, Beschreibung und eine Vorschau der Intervall-Struktur an. Implementiere auch eine "Custom"-Option für benutzerdefinierte Intervalle. Verwende Card-Layout ähnlich wie andere Komponenten in der App. Stelle sicher, dass das neue "Stability & Core Training" Preset prominent angezeigt wird.

### app/interval-timer/_components/timer-display.tsx(NEW)

References: 

- components/ui/badge.tsx
- components/ui/card.tsx

Erstelle die Haupt-Timer-Anzeige-Komponente. Zeige:

- Große Zeit-Anzeige (MM:SS)
- Aktuelle Phase ("Work" / "Rest" / "Hold")
- Aktueller Set / Gesamt Sets
- Phase-spezifische Farben (grün für Work, blau für Rest, orange für Hold)
- Übungs-Name (z.B. "Forearm Plank", "Side Forearm Plank - Left")
- Spezielle Anzeigen für Reps-basierte Übungen
- Seitenwechsel-Indikatoren für seitenspezifische Übungen

Verwende große, gut lesbare Typografie und Badge-Komponenten für Status-Anzeigen. Orientiere dich am Design der bestehenden Timer-Komponenten.

### app/interval-timer/_components/control-panel.tsx(NEW)

References: 

- app/yo-yo-ir1_test/_components/control-panel.tsx
- components/ui/button.tsx

Erstelle ein Control Panel für Timer-Steuerung. Implementiere Buttons für:

- Start/Resume (Play-Icon)
- Pause (Pause-Icon)
- Stop (Square-Icon)
- Reset (RotateCcw-Icon)
- Mute/Unmute Audio (Volume-Icons)
- Skip Phase (SkipForward-Icon) für Flexibilität bei verschiedenen Übungstypen

Verwende das gleiche Design-Muster wie `app/yo-yo-ir1_test/_components/control-panel.tsx` mit responsiven Button-Layouts und Lucide-Icons. Implementiere entsprechende disabled-States basierend auf Timer-Status.

### app/interval-timer/_components/progress-indicator.tsx(NEW)

References: 

- components/ui/progress.tsx
- components/ui/card.tsx

Erstelle eine Fortschritts-Anzeige-Komponente. Zeige:

- Gesamtfortschritt des Workouts (Progress Bar)
- Fortschritt der aktuellen Phase (separater Progress Bar)
- Visuelle Darstellung der kommenden Phasen
- Set-Zähler mit visuellen Indikatoren
- Spezielle Indikatoren für seitenspezifische Übungen (L/R)
- Übungstyp-spezifische Visualisierungen (Hold, Reps, Duration)

Verwende die shadcn/ui Progress-Komponente und implementiere verschiedene Farben für Work/Rest/Hold-Phasen. Orientiere dich an modernen Fitness-App-Designs für die Visualisierung.

### app/interval-timer/_components/exercise-instructions.tsx(NEW)

References: 

- components/ui/card.tsx

Erstelle eine Komponente zur Anzeige von Übungsanweisungen. Diese Komponente zeigt:

- Detaillierte Beschreibungen für jede Übung
- Spezielle Hinweise für seitenspezifische Übungen
- Reps vs. Duration Anweisungen
- Visuelle Hinweise für korrekte Ausführung
- Sicherheitshinweise wo relevant

Diese Komponente ist besonders wichtig für das neue "Stability & Core Training" Preset, da es verschiedene komplexe Übungen enthält.

### public/audio(NEW)

Erstelle ein Verzeichnis für Audio-Dateien, analog zur bestehenden Struktur für yo-yo Audio-Dateien.

### public/audio/interval(NEW)

Erstelle ein spezifisches Verzeichnis für Interval-Timer Audio-Dateien. Hier werden die Beep-Sounds für Start, Ende, Phasenübergänge und Seitenwechsel gespeichert.

### components/layout/sidebar-links.ts(MODIFY)

Füge den Interval-Timer zur Navigation hinzu. Erweitere das `trainingToolsLinks` Array um einen neuen Eintrag:

```typescript
{
  title: 'Interval Timer',
  url: '/interval-timer',
  icon: Timer, // Import Timer from lucide-react
  mobileLabel: 'Timer',
  showOnMobile: true,
}
```

Importiere das Timer-Icon von lucide-react am Anfang der Datei.