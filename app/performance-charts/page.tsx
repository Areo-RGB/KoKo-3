'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import ChartDataTable from './_components/chart-data-table';
import FortschrittTimeline from './_components/fortschritt-timeline';
import PerformanceHeatmap from './_components/performance-heatmap';
import VerticalBarChart from './_components/vertical-bar-chart';
import { TABS } from './_lib/config';
import { sortDescending } from './_lib/utils';
import performanceData from './data/performance.json';

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
        <TabsList className="grid w-full grid-cols-4 md:w-fit">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="px-6 py-2">
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((item) => {
          // Special handling for fortschritt tab
          if (item.key === 'fortschritt') {
            return (
              <TabsContent key={item.key} value={item.key} className="mt-6">
                <FortschrittTimeline />
              </TabsContent>
            );
          }

          // Special handling for heatmap tab
          if (item.key === 'heatmap') {
            const yoyoData = performanceData.yoyoIr1 || [];
            const jonglierenData = performanceData.jonglieren || [];

            // Merge data for players who have both scores
            const heatmapData = yoyoData
              .map((yoyoEntry) => {
                const jonglierenEntry = jonglierenData.find(
                  (j) => j.name === yoyoEntry.name,
                );
                if (!jonglierenEntry) return null;

                return {
                  name: yoyoEntry.name,
                  yoyo: yoyoEntry.value,
                  jonglieren: jonglierenEntry.value,
                };
              })
              .filter((entry): entry is NonNullable<typeof entry> => !!entry);

            if (heatmapData.length === 0) {
              return (
                <TabsContent key={item.key} value={item.key} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Aktuell liegen nicht genügend Daten für diese Auswertung
                        vor. Spieler benötigen sowohl Yo-Yo IR1- als auch
                        Jonglier-Ergebnisse.
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
                    <PerformanceHeatmap data={heatmapData} />
                    <div className="text-muted-foreground mt-6 space-y-3 text-sm">
                      <p className="font-semibold">
                        Wie wird der Gesamtwert berechnet?
                      </p>
                      <p>
                        Jede Metrik wird normalisiert (0-100%), dann wird der
                        Durchschnitt beider Werte gebildet:
                      </p>
                      <ul className="ml-4 list-disc space-y-1">
                        <li>
                          <strong>Yo-Yo IR1:</strong> Ausdauer/Fitness (max:{' '}
                          {Math.max(...heatmapData.map((d) => d.yoyo))}m)
                        </li>
                        <li>
                          <strong>Jonglieren:</strong> Technische Fähigkeiten
                          (max:{' '}
                          {Math.max(...heatmapData.map((d) => d.jonglieren))}{' '}
                          Wdh.)
                        </li>
                        <li>
                          <strong>Gesamtwert:</strong> (Normalisiertes Yo-Yo +
                          Normalisiertes Jonglieren) ÷ 2
                        </li>
                      </ul>
                      <p className="pt-2">
                        <strong>Farbcodierung:</strong> 🟢 Grün ≥75% | 🟡 Gelb
                        50-74% | 🟠 Orange 25-49% | 🔴 Rot &lt;25%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          }

          const rows = (performanceData[
            item.key as keyof typeof performanceData
          ] || []) as {
            name: string;
            value: number;
            date: string;
            team: string | null;
          }[];

          const sorted = sortDescending(rows, 'value');
          const labels = sorted.map((entry) => entry.name);
          const values = sorted.map((entry) => entry.value);
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
                    title={item.key === 'jonglieren' ? '' : item.title}
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
