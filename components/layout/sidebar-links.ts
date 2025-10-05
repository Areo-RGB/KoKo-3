import type { LucideIcon } from 'lucide-react';
import {
  Database,
  Download,
  Dumbbell,
  GraduationCap,
  Home,
  PlayCircle,
  Timer,
  Trophy,
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
];

export const toolsLinks: SidebarLink[] = [
  {
    title: 'Video Cache',
    url: '/cache',
    icon: Download,
    mobileLabel: 'Cache',
    showOnMobile: false,
  },
];

export const trainingToolsLinks: SidebarLink[] = [
  {
    title: 'Trainingsvideos',
    url: '/video-player',
    icon: PlayCircle,
    mobileLabel: 'Videos',
    showOnMobile: true,
  },
  {
    title: 'Soundboard',
    url: '/soundboard',
    icon: PlayCircle,
    mobileLabel: 'Sounds',
    showOnMobile: false,
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
    title: 'Interval Timer',
    url: '/interval-timer',
    icon: Timer,
    mobileLabel: 'Timer',
    showOnMobile: true,
  },
  {
    title: 'Yo-Yo Ranking',
    url: '/yo-yo',
    icon: Trophy,
    mobileLabel: 'Ranking',
    showOnMobile: true,
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
