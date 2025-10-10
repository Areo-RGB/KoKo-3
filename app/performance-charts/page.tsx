'use client';

import { Button } from '@/components/ui/button';
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
import GroupedPlayerBarChart from './_components/grouped-player-bar-chart';
import PerformanceHeatmap from './_components/performance-heatmap';
import PlayerTrendLineChart from './_components/player-trend-line-chart';
import VerticalBarChart from './_components/vertical-bar-chart';
import { TABS } from './_lib/config';
import { sortDescending } from './_lib/utils';
import performanceData from './data/performance.json';

export default function PerformanceChartsPage() {
  const [tab, setTab] = useState(TABS[0].key);
  // Per-Tab Datumsfilter (nur für Datensätze mit mehreren Stichtagen genutzt)
  const [dateFilter, setDateFilter] = useState<Record<string, string | null>>(
    {},
  );

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

            // Für Heatmap: pro Spieler nur den neuesten Yo-Yo-Wert verwenden,
            // damit Mehrfacheinträge (verschiedene Daten) nicht duplizieren.
            const latestYoyoByName = new Map<
              string,
              (typeof yoyoData)[number]
            >();
            for (const entry of yoyoData) {
              const current = latestYoyoByName.get(entry.name);
              if (!current || entry.date > current.date) {
                latestYoyoByName.set(entry.name, entry);
              }
            }

            // Merge Daten für Spieler, die in beiden Quellen existieren
            const heatmapData = Array.from(latestYoyoByName.values())
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

          const allRows = (performanceData[
            item.key as keyof typeof performanceData
          ] || []) as {
            name: string;
            value: number;
            date: string;
            team: string | null;
          }[];

          // Nur für Yo-Yo IR1: Datums-Auswahl anbieten und filtern
          const isYoYo = item.key === 'yoyoIr1';
          const availableDates = isYoYo
            ? Array.from(new Set(allRows.map((r) => r.date))).sort((a, b) =>
                a < b ? 1 : a > b ? -1 : 0,
              )
            : ([] as string[]);

          const selectedDate = isYoYo
            ? (dateFilter[item.key] ?? availableDates[0] ?? null)
            : null;

          const rows =
            isYoYo && selectedDate
              ? allRows.filter((r) => r.date === selectedDate)
              : allRows;

          const sorted = sortDescending(rows, 'value');
          const labels = sorted.map((entry) => entry.name);
          const values = sorted.map((entry) => entry.value);
          const sampleDate = isYoYo ? selectedDate : (sorted[0]?.date ?? null);

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
                  {isYoYo && availableDates.length > 1 ? (
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground mr-2 text-sm">
                        Datum:
                      </span>
                      {[...availableDates].reverse().map((d) => {
                        const isActive = d === selectedDate;
                        const [y, m, day] = d.split('-');
                        const label = `${day}.${m}.${y}`;
                        return (
                          <Button
                            key={d}
                            size="sm"
                            variant={isActive ? 'default' : 'secondary'}
                            className="px-3"
                            onClick={() =>
                              setDateFilter((prev) => ({
                                ...prev,
                                [item.key]: d,
                              }))
                            }
                          >
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  ) : null}
                  <VerticalBarChart
                    labels={labels}
                    values={values}
                    datasetLabel={`${item.title} (${item.unit})`}
                    variant={item.variant}
                  />
                  {isYoYo && availableDates.length > 0
                    ? (() => {
                        const lineDatesIso = [...availableDates].sort((a, b) =>
                          a < b ? -1 : a > b ? 1 : 0,
                        );
                        const fmt = (iso: string) => {
                          const [y, m, d] = iso.split('-');
                          return `${d}.${m}.${y}`;
                        };
                        const labelsDisplay = lineDatesIso.map(fmt);

                        const players = Array.from(
                          new Set(allRows.map((r) => r.name)),
                        ).sort();

                        const series = players.map((name) => {
                          const valuesByDate = new Map(
                            allRows
                              .filter((r) => r.name === name)
                              .map((r) => [r.date, Number(r.value) || 0]),
                          );
                          const data = lineDatesIso.map((d) =>
                            valuesByDate.has(d)
                              ? (valuesByDate.get(d) as number)
                              : null,
                          );
                          return { label: name, data };
                        });

                        return (
                          <div className="mt-6">
                            <div className="mb-2 text-sm font-semibold">
                              Verlauf (alle Spieler)
                            </div>
                            <PlayerTrendLineChart
                              labels={labelsDisplay}
                              series={series}
                              unit={item.unit}
                            />
                            {lineDatesIso.length >= 2
                              ? (() => {
                                  // Two-date grouped vertical bars by player
                                  const first = lineDatesIso[0];
                                  const last =
                                    lineDatesIso[lineDatesIso.length - 1];
                                  const fmt = (iso: string) => {
                                    const [y, m, d] = iso.split('-');
                                    return `${d}.${m}.${y}`;
                                  };
                                  const playersSorted = players;
                                  const key = (date: string, name: string) =>
                                    `${date}|${name}`;
                                  const map = new Map<string, number>();
                                  for (const r of allRows) {
                                    map.set(
                                      key(r.date, r.name),
                                      Number(r.value) || 0,
                                    );
                                  }
                                  const aVals = playersSorted.map((p) => {
                                    const v = map.get(key(first, p));
                                    return typeof v === 'number' ? v : null;
                                  });
                                  const bVals = playersSorted.map((p) => {
                                    const v = map.get(key(last, p));
                                    return typeof v === 'number' ? v : null;
                                  });
                                  return (
                                    <div className="mt-8">
                                      <div className="mb-2 text-sm font-semibold">
                                        Spieler-Vergleich (2 Messpunkte)
                                      </div>
                                      <GroupedPlayerBarChart
                                        players={playersSorted}
                                        series={[
                                          { label: fmt(first), values: aVals },
                                          { label: fmt(last), values: bVals },
                                        ]}
                                        unit={item.unit}
                                      />
                                    </div>
                                  );
                                })()
                              : null}
                          </div>
                        );
                      })()
                    : null}
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
