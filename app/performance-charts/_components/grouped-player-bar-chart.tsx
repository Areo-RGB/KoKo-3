'use client';

import type { ChartOptions } from 'chart.js';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface DateSeries {
  label: string; // e.g. 12.09.2025
  values: (number | null)[]; // aligned to players
  backgroundColor?: string;
  borderColor?: string;
}

interface GroupedPlayerBarChartProps {
  players: string[]; // category labels
  series: [DateSeries, DateSeries]; // exactly two dates
  unit?: string; // e.g. 'Meter'
}

export default function GroupedPlayerBarChart({
  players,
  series,
  unit = 'Meter',
}: GroupedPlayerBarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [hiddenPlayers, setHiddenPlayers] = useState<Set<number>>(new Set());

  const axisColor = isDark ? '#e5e7eb' : '#0f172a';
  const gridColor = isDark
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(148, 163, 184, 0.2)';

  const greyBg = 'rgba(148, 163, 184, 0.55)';
  const greyBorder = 'rgba(148, 163, 184, 0.9)';
  const accentBg = isDark ? 'rgba(59,130,246,0.8)' : 'rgba(37,99,235,0.7)';
  const accentBorder = isDark ? 'rgba(96,165,250,1)' : 'rgba(37,99,235,1)';

  // Compute filtered labels and datasets so hidden players are completely removed
  const { filteredLabels, datasets } = useMemo(() => {
    const visibleIdx: number[] = [];
    for (let i = 0; i < players.length; i++) {
      if (!hiddenPlayers.has(i)) visibleIdx.push(i);
    }

    const filteredLabels = visibleIdx.map((i) => players[i]);

    const [a, b] = series;
    const dataA = visibleIdx.map((i) => a.values[i] ?? null);
    const dataB = visibleIdx.map((i) => b.values[i] ?? null);

    return {
      filteredLabels,
      datasets: [
        {
          label: a.label,
          data: dataA,
          backgroundColor: a.backgroundColor ?? greyBg,
          borderColor: a.borderColor ?? greyBorder,
          borderWidth: 1,
          barThickness: 'flex' as const,
          borderRadius: 0,
        },
        {
          label: b.label,
          data: dataB,
          backgroundColor: b.backgroundColor ?? accentBg,
          borderColor: b.borderColor ?? accentBorder,
          borderWidth: 1,
          barThickness: 'flex' as const,
          borderRadius: 0,
        },
      ],
    };
  }, [players, series, hiddenPlayers, accentBg, accentBorder, greyBg, greyBorder]);

  const data = useMemo(
    () => ({
      labels: filteredLabels,
      datasets,
    }),
    [filteredLabels, datasets],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      scales: {
        x: {
          stacked: false,
          ticks: { color: axisColor, font: { size: 12 } },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: axisColor,
            font: { size: 12 },
            callback(value) {
              try {
                return `${value} ${unit}`;
              } catch {
                return String(value);
              }
            },
          },
          grid: { color: gridColor },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: axisColor },
        },
        tooltip: {
          backgroundColor: isDark
            ? 'rgba(17, 24, 39, 0.9)'
            : 'rgba(255,255,255,0.95)',
          titleColor: axisColor,
          bodyColor: axisColor,
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
        },
      },
      categoryPercentage: 0.7,
      barPercentage: 0.9,
    }),
    [axisColor, gridColor, isDark, unit],
  );

  return (
    <div className="space-y-3">
      <div className="h-[420px]">
        <Bar data={data} options={options} />
      </div>
      <div className="flex flex-wrap gap-2">
        {players.map((name, idx) => {
          const isHidden = hiddenPlayers.has(idx);
          return (
            <button
              key={`${name}-${idx}`}
              type="button"
              className={
                'border-muted-foreground/30 hover:bg-accent/60 inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition ' +
                (isHidden ? 'opacity-50' : '')
              }
              onClick={() => {
                setHiddenPlayers((prev) => {
                  const next = new Set(prev);
                  if (isHidden) next.delete(idx);
                  else next.add(idx);
                  return next;
                });
              }}
              aria-pressed={!isHidden}
            >
              <span className="bg-muted-foreground/60 inline-block h-2.5 w-2.5 rounded-sm" />
              <span className="font-medium">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
