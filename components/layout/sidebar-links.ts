import type { LucideIcon } from 'lucide-react';
import {
  Database,
  Download,
  Dumbbell,
  FileImage,
  GraduationCap,
  Home,
  Images,
  Layers,
  LayoutDashboard,
  PlayCircle,
  Target,
  Trophy,
  WifiOff,
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
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    mobileLabel: 'Dashboard',
    showOnMobile: true,
  },
];

const datenLinks: SidebarLink[] = [
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
  {
    title: 'Offline Modus',
    url: '/offline',
    icon: WifiOff,
    mobileLabel: 'Offline',
    showOnMobile: false,
  },
    {
    title: 'Expandable Cards',
    url: '/expandable-card-demo',
    icon: Layers,
    mobileLabel: 'Cards',
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
    showOnMobile: true,
  },
    {
    title: 'Stabi-Training',
    url: '/muscle-diagram',
    icon: Dumbbell,
    mobileLabel: 'Stabi',
    showOnMobile: true,
  },
    {
    title: 'Yo-Yo Ranking',
    url: '/yo-yo',
    icon: Trophy,
    mobileLabel: 'Ranking',
    showOnMobile: true,
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
