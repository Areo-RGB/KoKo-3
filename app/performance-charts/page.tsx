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
        <TabsList className="grid w-full grid-cols-3 md:w-fit">
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
