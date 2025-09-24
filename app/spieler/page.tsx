import Link from 'next/link';
import { getPlayersFromTests } from './_lib/data';

export default function SpielerIndexPage() {
  const players = getPlayersFromTests();

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Spieler</h1>
        <p className="text-muted-foreground">
          Wähle einen Spieler für aktuelle Testergebnisse.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {players.map((name) => (
          <Link
            key={name}
            href={`/spieler/${encodeURIComponent(name)}`}
            className="bg-card hover:bg-accent hover:text-accent-foreground rounded-md border p-3 transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
