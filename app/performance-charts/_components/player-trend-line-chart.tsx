'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

interface Series {
  label: string;
  data: (number | null)[];
}

interface PlayerTrendLineChartProps {
  labels: string[]; // e.g. formatted dates
  series: Series[]; // one per player
  unit?: string; // e.g. 'Meter'
}

export default function PlayerTrendLineChart({
  labels,
  series,
  unit = 'Meter',
}: PlayerTrendLineChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const chartRef = useRef<any>(null);
  const [hidden, setHidden] = useState<Set<number>>(new Set());

  const axisColor = isDark ? '#e5e7eb' : '#0f172a';
  const gridColor = isDark
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(148, 163, 184, 0.15)';

  // Deterministic HSL palette for many players
  function colorForIndex(i: number, alpha = 0.8) {
    const hue = (i * 43) % 360; // spread across wheel
    return `hsla(${hue}, 70%, ${isDark ? 60 : 45}%, ${alpha})`;
  }

  const datasets = useMemo(
    () =>
      series.map((s, i) => ({
        label: s.label,
        data: s.data,
        borderColor: colorForIndex(i, 0.9),
        backgroundColor: colorForIndex(i, 0.3),
        pointBackgroundColor: colorForIndex(i, 0.95),
        pointBorderColor: colorForIndex(i, 0.95),
        pointRadius: 3,
        pointHoverRadius: 4,
        borderWidth: 2,
        tension: 0.35,
        spanGaps: true,
      })),
    [series, isDark],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets],
  );

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 8 },
      scales: {
        x: {
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
          display: false, // avoid clutter with many players
        },
        tooltip: {
          backgroundColor: isDark
            ? 'rgba(17, 24, 39, 0.95)'
            : 'rgba(255,255,255,0.95)',
          titleColor: axisColor,
          bodyColor: axisColor,
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          callbacks: {
            label(context) {
              const val = context.parsed.y;
              const label = context.dataset?.label || '';
              return `${label}: ${val ?? '-'} ${unit}`;
            },
          },
        },
      },
      elements: {
        line: { cubicInterpolationMode: 'monotone' },
      },
    }),
    [axisColor, gridColor, isDark, unit],
  );

  return (
    <div className="space-y-3">
      <div className="h-[340px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="flex flex-wrap gap-2">
        {datasets.map((ds, i) => {
          const color = (ds.borderColor as string) || 'hsl(210 10% 50%)';
          const isHidden = hidden.has(i);
          return (
            <button
              key={`${ds.label}-${i}`}
              type="button"
              className={
                'border-muted-foreground/30 hover:bg-accent/60 inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition ' +
                (isHidden ? 'opacity-50' : '')
              }
              onClick={() => {
                const chart = chartRef.current;
                if (!chart) return;
                const currentlyVisible = chart.isDatasetVisible(i);
                chart.setDatasetVisibility(i, !currentlyVisible);
                chart.update();
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (currentlyVisible) next.add(i);
                  else next.delete(i);
                  return next;
                });
              }}
              aria-pressed={!isHidden}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{ds.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
