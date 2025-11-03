'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ChartDataTable from './_components/chart-data-table';
import PerformanceHeatmap from './_components/performance-heatmap';
import PerformanceOverviewTable from './_components/performance-overview-table';
import VerticalBarChart from './_components/vertical-bar-chart';
import { TABS } from './_lib/config';
import { sortDescending } from './_lib/utils';
import performanceData from './data/performance.json';

export default function PerformanceChartsPage() {
  const [tab, setTab] = useState('overview');
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Leistungsübersicht
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
          Vergleichbare Visualisierung der Jonglier- und Yo-Yo-IR1-Ergebnisse
          mittels Chart.js.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:w-fit min-w-fit">
          {TABS.map((item) => (
            <TabsTrigger key={item.key} value={item.key} className="px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm">
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
              const springseilData = performanceData.springseil || [];
              const prellwandData = performanceData.prellwand || [];
              
              const jonglierenEntry = jonglierenData.find(entry => entry.name === player);
              const yoyoEntry = yoyoData.find(entry => entry.name === player);
              const springseilEntry = springseilData.find(entry => entry.name === player);
              const prellwandEntry = prellwandData.find(entry => entry.name === player);

              return {
                name: player,
                jonglieren: jonglierenEntry ? jonglierenEntry.value : 0,
                yoyo: yoyoEntry ? yoyoEntry.value : 0,
                springseil: springseilEntry ? springseilEntry.value : 0,
                prellwand: prellwandEntry ? prellwandEntry.value : 0,
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
                  <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
                    <div className="w-full overflow-x-auto">
                      <h3 className="text-lg font-semibold mb-4">Leistungsübersicht Tabelle</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detaillierte Ergebnisse aller Spieler in den verschiedenen Übungen. Klicken Sie auf die Spaltenüberschriften zum Sortieren.
                      </p>
                      <PerformanceOverviewTable
                        data={heatmapData}
                      />
                    </div>
                    <div className="w-full overflow-x-auto mt-6">
                      <Collapsible open={isHeatmapOpen} onOpenChange={setIsHeatmapOpen}>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <h3 className="text-lg font-semibold">Leistungsübersicht Heatmap</h3>
                            {isHeatmapOpen ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-4">
                          <div className="text-muted-foreground mb-4 space-y-2 text-sm">
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
                          <PerformanceHeatmap
                            data={heatmapData}
                          />
                        </CollapsibleContent>
                      </Collapsible>
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
                <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                  <CardTitle className="text-lg sm:text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-4 sm:px-6 sm:py-6">
                  <div className="w-full overflow-x-auto">
                    <VerticalBarChart
                      labels={labels}
                      values={values}
                      datasetLabel={`${item.title} (${item.unit})`}
                      variant={item.variant}
                    />
                  </div>
                  <div className="mt-6 w-full overflow-x-auto">
                    <ChartDataTable
                      rows={sorted}
                      valueKey={'value'}
                      title={item.key === 'jonglieren' ? '' : item.title}
                      unit={item.unit}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}