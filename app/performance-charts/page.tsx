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
        <TabsList className="grid w-full grid-cols-5 md:w-fit">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="px-6 py-2">
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((item) => {
          // Special handling for overview tab with heatmap
          if (item.key === 'overview') {
            const drillTypes = ['jonglieren', 'yoyoIr1', 'springseil', 'prellwand'] as const;
            
            // Get all unique players across all drills
            const allPlayers = new Set<string>();
            drillTypes.forEach(drill => {
              const drillData = performanceData[drill] || [];
              drillData.forEach(entry => allPlayers.add(entry.name));
            });

            const players = Array.from(allPlayers).sort();
            
            // Create heatmap data for each player (format expected by PerformanceHeatmap)
            const heatmapData = players.map(player => {
              const jonglierenData = performanceData.jonglieren || [];
              const yoyoData = performanceData.yoyoIr1 || [];
              
              const jonglierenEntry = jonglierenData.find(entry => entry.name === player);
              const yoyoEntry = yoyoData.find(entry => entry.name === player);

              return {
                name: player,
                jonglieren: jonglierenEntry ? jonglierenEntry.value : 0,
                yoyo: yoyoEntry ? yoyoEntry.value : 0,
              };
            });

            if (players.length === 0) {
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
                    <PerformanceHeatmap
                      data={heatmapData}
                    />
                    <div className="text-muted-foreground mt-6 space-y-3 text-sm">
                      <p className="font-semibold">
                        Wie werden die Werte verglichen?
                      </p>
                      <p>
                        Die Heatmap zeigt die Leistung jedes Spielers in allen Übungen:
                      </p>
                      <ul className="ml-4 list-disc space-y-1">
                        <li>
                          <strong>Jonglieren:</strong> Balljonglage in Wiederholungen
                        </li>
                        <li>
                          <strong>Yo-Yo IR1:</strong> Zurückgelegte Distanz in Metern
                        </li>
                        <li>
                          <strong>Springseil:</strong> Wiederholungen
                        </li>
                        <li>
                          <strong>Prellwand:</strong> Wiederholungen
                        </li>
                      </ul>
                      <p className="pt-2">
                        <strong>Farbcodierung:</strong> 🟢 Grün ≥75% | 🟡 Gelb
                        50-74% | 🟠 Orange 25-49% | 🔴 Rot 25%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          }

          const allRows = (performanceData[
            item.key as keyof typeof performanceData
          ] || []) as {
            name: string;
            value: number;
          }[];

          const sorted = sortDescending(allRows, 'value');
          const labels = sorted.map((entry) => entry.name);
          const values = sorted.map((entry) => entry.value);

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