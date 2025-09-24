'use client';

import Link from 'next/link';

import { sidebarSections } from '@/components/layout/sidebar-links';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const navigationCards = sidebarSections.flatMap((section) =>
  section.links.map((link) => ({
    ...link,
    sectionLabel: section.label,
  })),
);

export function FeaturesSectionDemo() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Direkte Navigation
          </h2>
          <p className="mt-2 text-muted-foreground">
            Alle Links aus der Seitenleiste als Kartenuebersicht.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {navigationCards.map((item) => (
            <Link
              key={`${item.sectionLabel}-${item.title}`}
              href={item.url}
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            >
              <Card className="h-full transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>
                    Bereich: {item.sectionLabel}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
