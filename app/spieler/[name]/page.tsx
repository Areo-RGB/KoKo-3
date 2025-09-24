import Link from 'next/link';
import PlayerResults from '../_components/player-results';
import { getPlayersFromTests } from '../_lib/data';

interface PageProps {
  params: Promise<{ name: string }>;
}

export function generateStaticParams() {
  // Pre-generate known players from the datasets
  return getPlayersFromTests().map((name) => ({ name }));
}

export default async function SpielerDetailPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{decodedName}</h1>
          <p className="text-muted-foreground">Aktuelle Ergebnisse</p>
        </div>
        <Link
          href="/spieler"
          className="text-sm text-muted-foreground hover:underline"
        >
          Zurück zur Übersicht
        </Link>
      </div>

      <PlayerResults name={decodedName} />
    </div>
  );
}
