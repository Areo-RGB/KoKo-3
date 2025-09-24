import Dashboard from '@/app/dashboard/_components/dashboard';
import type { ReactElement } from 'react';

/**
 * The root page of the application.
 * This page displays the main dashboard content directly.
 */
export default function HomePage(): ReactElement {
  return (
    <div className="min-h-screen">
      <main className="p-4">
        <Dashboard />
      </main>
    </div>
  );
}
