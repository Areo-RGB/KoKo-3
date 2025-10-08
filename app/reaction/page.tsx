'use client';
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
import { reactionCards } from './_data/cards';

// Data is co-located under ./_data/cards

export default function ReactionIndexPage() {
  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-2 text-2xl font-semibold">Reaktion</h1>
      <p className="text-muted-foreground mb-6">
        Wähle einen Reaktionstrainer.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reactionCards.map((card) => (
          <Card key={card.id} className="h-full">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardAction>
                <Link
                  href={card.href}
                  aria-disabled={card.disabled}
                  className="text-primary text-sm font-medium underline-offset-4 hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50"
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
