import type { LucideIcon } from 'lucide-react';
import {
  Database,
  Download,
  Dumbbell,
  GraduationCap,
  Home,
  PlayCircle,
  Target,
  Timer,
  Trophy,
} from 'lucide-react';

type SidebarLink = {
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

const navigationLinks: SidebarLink[] = [
  {
    title: 'Startseite',
    url: '/',
    icon: Home,
    mobileLabel: 'Home',
    showOnMobile: true,
  },
];

const datenLinks: SidebarLink[] = [
  {
    title: 'Video DFB Tests',
    url: '/ranking',
    icon: Trophy,
    mobileLabel: 'Ranking',
    showOnMobile: false,
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

const toolsLinks: SidebarLink[] = [
  {
    title: 'Video Cache',
    url: '/cache',
    icon: Download,
    mobileLabel: 'Cache',
    showOnMobile: false,
  },
];

const trainingToolsLinks: SidebarLink[] = [
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
    mobileLabel: 'FIFA 11+',
    showOnMobile: true,
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
    showOnMobile: false,
  },
  {
    title: 'Yo-Yo Ranking',
    url: '/yo-yo',
    icon: Trophy,
    mobileLabel: 'Ranking',
    showOnMobile: false,
  },
  {
    title: 'Reaktion',
    url: '/reaction',
    icon: Target,
    mobileLabel: 'Reaktion',
    showOnMobile: true,
  },
];

const juniorLinks: SidebarLink[] = [
  {
    title: 'Junioren \u00dcbersicht',
    url: '/junioren',
    icon: GraduationCap,
    mobileLabel: 'Junioren',
    showOnMobile: false,
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
