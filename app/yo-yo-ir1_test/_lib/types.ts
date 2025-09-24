'use client';

export interface ShuttleEventDetails {
  speedLevel?: number;
  speedKmh?: number;
  level?: number;
  shuttles?: number;
  accumulatedDistM?: number;
  description: string;
}

export interface ShuttleEvent {
  timestamp: number;
  type:
    | 'speed_change'
    | 'beep_start'
    | 'turn'
    | 'finish'
    | 'distance_change'
    | 'pause_start'
    | 'pause_end';
  details: ShuttleEventDetails;
}

export type TestPhase = 'ready' | 'running' | 'recovery' | 'finished';

export interface LevelInfo {
  level: number;
  timestamp: number;
  eventIndex: number;
}

// Yo-Yo IR1 Test player-related types (for records/warnings UI)
export type PlayerStatus = 'normal' | 'warned' | 'recorded';

export interface Player {
  id: string;
  name: string;
  state: PlayerStatus;
}

export interface PlayerRecord {
  id: string;
  name: string;
  distance: number;
  level: number;
  timestamp: string;
}

export interface PlayerWarning {
  id: string;
  name: string;
  distance: number;
  level: number;
  timestamp: string;
  reason: string;
}
