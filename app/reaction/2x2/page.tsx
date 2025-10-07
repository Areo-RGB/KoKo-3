"use client";
import { Suspense } from 'react';

import { ReactionTrainer } from '@/components/reaction-trainer';

export default function Reaction2x2Page() {
    return (
        <div className="container mx-auto max-w-5xl p-4 sm:p-6">
            <h1 className="mb-4 text-2xl font-semibold">Reaktion — 2x2 Farben</h1>
            <p className="mb-6 text-muted-foreground">
                In zufälligen Intervallen leuchtet ein Feld. Trainiere deine
                Reaktionsschnelligkeit auf externe Signale (z. B. Rot = rechtes Ohr
                berühren).
            </p>
            <Suspense fallback={<div>Wird geladen…</div>}>
                <ReactionTrainer defaultIntervalMs={1000} />
            </Suspense>
        </div>
    );
}


