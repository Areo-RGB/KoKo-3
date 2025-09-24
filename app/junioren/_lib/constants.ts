import type { AgeGroup } from '@/app/junioren/_lib/types';
import type { LucideIcon } from 'lucide-react';

// Centralized, client-safe constants

export const AGE_GROUPS: AgeGroup[] = [
  'A-Junior',
  'B-Junior',
  'C-Junior',
  'D-Junior',
  'E-Junior',
];

export interface CategoryInfo {
  icon:
    | LucideIcon
    | 'BookOpen'
    | 'Target'
    | 'Users'
    | 'Zap'
    | 'Shield'
    | 'Activity'
    | 'Trophy'
    | 'Home'
    | 'MapPin'
    | 'Heart';
  color: string;
  description: string;
}

// Unified source of truth for all categories (keys must match data source)
export const CATEGORIES: Record<string, CategoryInfo> = {
  Allgemein: {
    icon: 'BookOpen',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    description: 'Allgemeine Trainingsformen und Grundlagen',
  },
  Torschuss: {
    icon: 'Target',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Torschusstraining und Abschlussübungen',
  },
  Dribbling: {
    icon: 'Zap',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    description: 'Einzeltechniken und 1-gegen-1 Situationen',
  },
  Passspiel: {
    icon: 'Users',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Passspiel, Kombinationen und Zusammenspiel',
  },
  // Alias for data inconsistencies
  Passen: {
    icon: 'Users',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    description: 'Passspiel und Kombinationen',
  },
  Verteidigung: {
    icon: 'Shield',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    description: 'Defensive Techniken und Taktiken',
  },
  Schnelligkeit: {
    icon: 'Zap',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    description: 'Schnelligkeit, Antritt und Tempowechsel',
  },
  Koordination: {
    icon: 'Activity',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    description: 'Koordinative Fähigkeiten und Geschicklichkeit',
  },
  Kopfball: {
    icon: 'Target',
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    description: 'Kopfballtechniken und -wettkämpfe',
  },
  Spielformen: {
    icon: 'Trophy',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    description: 'Kleine und große Spielformen',
  },
  // Alias for Spielformen
  Spiele: {
    icon: 'Trophy',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    description: 'Kleine Spiele und Turniere',
  },
  Hallentraining: {
    icon: 'Home',
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    description: 'Spezielle Übungen für die Halle',
  },
  Stationstraining: {
    icon: 'MapPin',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    description: 'Stationsarbeit und Parcours',
  },
  Aufwärmen: {
    icon: 'Heart',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    description: 'Aufwärmübungen und Vorbereitung',
  },
  Favoriten: {
    icon: 'Heart',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    description: 'Deine gespeicherten Favoriten',
  },
};
