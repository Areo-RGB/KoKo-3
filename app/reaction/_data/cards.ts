export interface ReactionNavCard {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}

export const reactionCards: ReactionNavCard[] = [
  {
    title: 'Reaktionstrainer (2x2 Farben)',
    description: 'Zufällige Farbfelder — 1s Standardintervall',
    href: '/reaction/2x2',
  },
  {
    title: 'Trainer 2',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    title: 'Trainer 3',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    title: 'Trainer 4',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    title: 'Trainer 5',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
  {
    title: 'Trainer 6',
    description: 'Bald verfügbar',
    href: '#',
    disabled: true,
  },
];
