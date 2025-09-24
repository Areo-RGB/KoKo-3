'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import playersData from '@/data/players/players.json';
import { useState } from 'react';
import ChartDataTable from './_components/chart-data-table';
import VerticalBarChart from './_components/vertical-bar-chart';
import { TABS } from './_lib/config';
import { sortDescending } from './_lib/utils';

export default function PerformanceChartsPage() {
  const [tab, setTab] = useState(TABS[0].key);

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Leistungsübersicht
        </h1>
        <p className="text-muted-foreground text-lg">
          Vergleichbare Visualisierung der Jonglier- und Yo-Yo-IR1-Ergebnisse
          mittels Chart.js.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="px-6 py-2">
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((item) => {
          const rows = (playersData.players as any[])
            .map((p) => {
              const r = (p.results?.[item.key] || []) as {
                date?: string | null;
                value?: number;
                unit?: string;
              }[];
              if (!r.length) return null;
              const latest = [...r].sort((a, b) => {
                if (!a.date && !b.date) return 0;
                if (!a.date) return 1;
                if (!b.date) return -1;
                return String(a.date).localeCompare(String(b.date));
              })[r.length - 1];
              return {
                name: p.name,
                value: latest?.value ?? 0,
                date: latest?.date ?? null,
              };
            })
            .filter(Boolean) as any[];
          const sorted = sortDescending(rows as any[], 'value' as any);
          const labels = sorted.map((entry: any) => entry.name);
          const values = sorted.map((entry: any) => Number(entry.value ?? 0));
          const sampleDate = sorted[0]?.date ?? null;

          if (labels.length === 0) {
            return (
              <TabsContent key={item.key} value={item.key} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Aktuell liegen keine Daten für diese Auswertung vor.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          }

          return (
            <TabsContent key={item.key} value={item.key} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <VerticalBarChart
                    labels={labels}
                    values={values}
                    datasetLabel={`${item.title} (${item.unit})`}
                    variant={item.variant}
                  />
                  {sampleDate ? (
                    <p className="text-muted-foreground mt-4 text-sm">
                      Zuletzt aktualisiert am {sampleDate}
                    </p>
                  ) : null}

                  <ChartDataTable
                    rows={sorted}
                    valueKey={'value'}
                    title={item.title}
                    unit={item.unit}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
