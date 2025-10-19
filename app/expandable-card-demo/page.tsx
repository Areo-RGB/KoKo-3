import ExpandableCardDemo from "@/components/ui/expandable-card-demo-grid";
import { playerCards } from "./_components";

export default function ExpandableCardDemoPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 md:px-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Team Showcase
          </h1>
          <p className="text-muted-foreground">
            Explore quick profiles for five of our standout players. Tap a card
            to reveal more details and get a feel for their style of play.
          </p>
        </div>
        <ExpandableCardDemo cards={playerCards} />
      </div>
    </main>
  );
}
