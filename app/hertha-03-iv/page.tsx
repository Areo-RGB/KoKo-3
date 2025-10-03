import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FC Hertha 03 IV',
  description:
    'Aktuelle Spiele und Informationen zur Mannschaft FC Hertha 03 IV via fussball.de.',
};

const FCHertha03IVPage = () => {
  return (
    <div className="flex h-screen flex-col">
      <iframe
        title="FC Hertha 03 IV Mannschaft auf fussball.de"
        src="https://next.fussball.de/mannschaft/-/011MIC3SQK000000VTVG0001VTR8C1K7#spiele"
        className="h-full w-full flex-1 border-0"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
};

export default FCHertha03IVPage;
