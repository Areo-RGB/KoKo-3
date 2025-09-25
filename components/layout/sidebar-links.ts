import type { LucideIcon } from 'lucide-react';
import {
  Database,
  Dumbbell,
  GraduationCap,
  Home,
  LineChart,
  PlayCircle,
  Trophy,
  Users,
} from 'lucide-react';

export type SidebarLink = {
  title: string;
  url: string;
  icon: LucideIcon;
  mobileLabel?: string;
  showOnMobile?: boolean;
};

export type SidebarSection = {
  id: 'navigation' | 'daten' | 'training' | 'tools';
  label: string;
  links: SidebarLink[];
};

export const navigationLinks: SidebarLink[] = [
  {
    title: 'Startseite',
    url: '/',
    icon: Home,
    mobileLabel: 'Home',
    showOnMobile: true,
  },
  {
    title: 'Fortschritt',
    url: '/fortschritt',
    icon: LineChart,
  },
];

export const datenLinks: SidebarLink[] = [
  {
    title: 'Video DFB Tests',
    url: '/ranking',
    icon: Trophy,
    mobileLabel: 'Ranking',
    showOnMobile: true,
  },
  {
    title: 'Daten & Normwerte',
    url: '/data-combined',
    icon: Database,
  },
  {
    title: 'Performance Charts',
    url: '/performance-charts',
    icon: Database,
  },
  {
    title: 'Spieler',
    url: '/spieler',
    icon: Users,
    mobileLabel: 'Spieler',
    showOnMobile: true,
  },
];

export const toolsLinks: SidebarLink[] = [];

export const trainingToolsLinks: SidebarLink[] = [
  {
    title: 'Trainingsvideos',
    url: '/video-player',
    icon: PlayCircle,
    mobileLabel: 'Videos',
    showOnMobile: true,
  },
  {
    title: 'FIFA 11+',
    url: '/fifa-11-plus',
    icon: PlayCircle,
  },
  {
    title: 'Stabi-Training',
    url: '/muscle-diagram',
    icon: Dumbbell,
  },
  {
    title: 'YoYo-IR1',
    url: '/yo-yo-ir1_test',
    icon: PlayCircle,
  },
];

export const juniorLinks: SidebarLink[] = [
  {
    title: 'Junioren \u00dcbersicht',
    url: '/junioren',
    icon: GraduationCap,
    mobileLabel: 'Junioren',
    showOnMobile: true,
  },
];

export const sidebarSections: SidebarSection[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    links: navigationLinks,
  },
  {
    id: 'daten',
    label: 'Daten',
    links: datenLinks,
  },
  {
    id: 'training',
    label: 'Training',
    links: juniorLinks,
  },
  {
    id: 'tools',
    label: 'Werkzeuge & Funktionen',
    links: [...trainingToolsLinks, ...toolsLinks],
  },
];
