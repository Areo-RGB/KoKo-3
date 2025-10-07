import Link from 'next/link';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const metadata = {
    title: 'Reaktion — Trainer Auswahl',
};

const cards = [
    {
        title: 'Reaktionstrainer (2x2 Farben)',
        description: 'Zufällige Farbfelder — 1s Standardintervall',
        href: '/reaction/2x2',
    },
    { title: 'Trainer 2', description: 'Bald verfügbar', href: '#' },
    { title: 'Trainer 3', description: 'Bald verfügbar', href: '#' },
    { title: 'Trainer 4', description: 'Bald verfügbar', href: '#' },
    { title: 'Trainer 5', description: 'Bald verfügbar', href: '#' },
    { title: 'Trainer 6', description: 'Bald verfügbar', href: '#' },
];

export default function ReactionIndexPage() {
    return (
        <div className="container mx-auto max-w-6xl p-4 sm:p-6">
            <h1 className="mb-2 text-2xl font-semibold">Reaktion</h1>
            <p className="mb-6 text-muted-foreground">
                Wähle einen Reaktionstrainer.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <Card key={card.title} className="h-full">
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.description}</CardDescription>
                            <CardAction>
                                <Link
                                    href={card.href}
                                    aria-disabled={card.href === '#'}
                                    className="text-sm font-medium text-primary underline-offset-4 hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50"
                                >
                                    Öffnen
                                </Link>
                            </CardAction>
                        </CardHeader>
                        <CardContent />
                        <CardFooter />
                    </Card>
                ))}
            </div>
        </div>
    );
}


