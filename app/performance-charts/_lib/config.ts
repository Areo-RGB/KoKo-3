import type { TabConfig } from './types';

export const TABS: readonly TabConfig[] = [
  {
    key: 'jonglieren',
    title: 'Jonglieren',
    valueKey: 'repetitions',
    unit: 'Wdh.',
    description: 'Balljonglage-Bestwerte pro Spieler',
    variant: 'orange',
  },
  {
    key: 'yoyoIr1',
    title: 'Yo-Yo IR1',
    valueKey: 'distance',
    unit: 'Meter',
    description: 'Zurückgelegte Distanz pro Spieler',
    variant: 'blue',
  },
  {
    key: 'springseil',
    title: 'Springseil',
    valueKey: 'repetitions',
    unit: 'Wdh.',
    description: 'Springseil-Bestwerte pro Spieler',
    variant: 'orange',
  },
  {
    key: 'prellwand',
    title: 'Prellwand',
    valueKey: 'repetitions',
    unit: 'Wdh.',
    description: 'Prellwand-Bestwerte pro Spieler',
    variant: 'orange',
  },
  {
    key: 'overview',
    title: 'Übersicht',
    valueKey: 'combined',
    unit: 'Score',
    description: 'Kombinierte Übersicht aller Übungen pro Spieler',
    variant: 'blue',
  },
] as const;

export type TabKey = (typeof TABS)[number]['key'];
