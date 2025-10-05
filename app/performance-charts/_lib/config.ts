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
    key: 'fortschritt',
    title: 'Fortschritt',
    valueKey: 'level',
    unit: 'Level',
    description: 'Spielerfortschritt und Level-Übersicht',
    variant: 'orange',
  },
] as const;

export type TabKey = (typeof TABS)[number]['key'];
