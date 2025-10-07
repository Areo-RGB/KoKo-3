export interface ReactionNavCard {
  id: string;
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}

export const reactionCards: ReactionNavCard[] = [
  {
    id: 'rt-2x2',
    title: 'Reaktionstrainer (2x2 Farben)',
    description: 'Zufällige Farbfelder — 1s Standardintervall',
    href: '/reaction/2x2',
  },
  {
    id: 'rt-2',
    title: 'Trainer 2',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    id: 'rt-3',
    title: 'Trainer 3',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    id: 'rt-4',
    title: 'Trainer 4',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    id: 'rt-5',
    title: 'Trainer 5',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    id: 'rt-6',
    title: 'Trainer 6',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
];
