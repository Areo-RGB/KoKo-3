'use client';

import type { ChartOptions, Plugin } from 'chart.js';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { Variant } from '../_lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StackedSeries {
  label: string;
  values: number[];
  backgroundColor?: string;
  borderColor?: string;
}

interface VerticalBarChartProps {
  labels: string[];
  // Single dataset (default)
  values?: number[];
  datasetLabel?: string;
  // Stacked datasets (optional). When provided, stacked bars are rendered
  stackedSeries?: StackedSeries[];
  variant?: Variant;
}

export default function VerticalBarChart({
  labels,
  values,
  datasetLabel,
  stackedSeries,
  variant = 'blue',
}: VerticalBarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const axisColor = isDark ? '#e5e7eb' : '#0f172a';
  const gridColorX = isDark
    ? 'rgba(255,255,255,0.3)'
    : 'rgba(148, 163, 184, 0.3)';
  const gridColorY = isDark
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(148, 163, 184, 0.15)';
  const barBg =
    variant === 'orange'
      ? isDark
        ? 'rgba(253, 186, 116, 0.85)'
        : 'rgba(251, 146, 60, 0.7)'
      : isDark
        ? 'rgba(59, 130, 246, 0.8)'
        : 'rgba(37, 99, 235, 0.7)';
  const barBorder =
    variant === 'orange'
      ? 'rgba(251, 146, 60, 1)'
      : isDark
        ? 'rgba(96, 165, 250, 1)'
        : 'rgba(37, 99, 235, 1)';

  // Defaults for stacked view (baseline vs delta)
  const stackedBaseBg = isDark
    ? 'rgba(148, 163, 184, 0.45)'
    : 'rgba(148, 163, 184, 0.45)'; // slate-400-ish
  const stackedBaseBorder = isDark
    ? 'rgba(148, 163, 184, 0.7)'
    : 'rgba(148, 163, 184, 0.7)';
  const stackedDeltaBg = barBg;
  const stackedDeltaBorder = barBorder;

  const datasets = useMemo(() => {
    if (stackedSeries && stackedSeries.length > 0) {
      return stackedSeries.map((s, idx) => ({
        label: s.label,
        data: s.values,
        borderRadius: 0,
        backgroundColor:
          s.backgroundColor ?? (idx === 0 ? stackedBaseBg : stackedDeltaBg),
        borderColor:
          s.borderColor ?? (idx === 0 ? stackedBaseBorder : stackedDeltaBorder),
        borderWidth: 1,
        maxBarThickness: 28,
      }));
    }
    // Fallback to single dataset
    return [
      {
        label: datasetLabel ?? 'Werte',
        data: values ?? [],
        borderRadius: 0,
        backgroundColor: barBg,
        borderColor: barBorder,
        borderWidth: 1,
        maxBarThickness: 28,
      },
    ];
  }, [
    stackedSeries,
    datasetLabel,
    values,
    barBg,
    barBorder,
    stackedBaseBg,
    stackedBaseBorder,
    stackedDeltaBg,
    stackedDeltaBorder,
  ]);

  const data = useMemo(
    () => ({
      labels,
      datasets,
    }),
    [labels, datasets],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      layout: { padding: 12 },
      scales: {
        x: {
          beginAtZero: true,
          stacked: datasets.length > 1,
          ticks: { color: axisColor, font: { size: 12 } },
          grid: { color: gridColorX },
        },
        y: {
          stacked: datasets.length > 1,
          ticks: { color: axisColor, font: { size: 12 } },
          grid: { color: gridColorY },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: axisColor, font: { size: 12 } },
        },
        tooltip: {
          backgroundColor: isDark
            ? 'rgba(17, 24, 39, 0.9)'
            : 'rgba(255,255,255,0.95)',
          titleColor: axisColor,
          bodyColor: axisColor,
          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.formattedValue}`;
            },
          },
        },
      },
    }),
    [axisColor, gridColorX, gridColorY, isDark, datasets],
  );

  // Draw values at the end inside each bar
  const valueLabelPlugin = useMemo<Plugin<'bar'>>(
    () => ({
      id: 'value-label-plugin',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        const dsCount = chart.data.datasets.length;
        if (!dsCount) return;
        const lastMeta = chart.getDatasetMeta(dsCount - 1);
        if (!lastMeta || !lastMeta.data) return;

        ctx.save();
        ctx.font =
          '700 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        // Use white text for stacked (better contrast), otherwise depend on variant
        ctx.fillStyle =
          dsCount > 1
            ? 'rgba(255, 255, 255, 0.95)'
            : variant === 'orange'
              ? 'rgba(0, 0, 0, 0.9)'
              : 'rgba(255, 255, 255, 0.95)';
        ctx.textBaseline = 'middle';

        lastMeta.data.forEach((element, index) => {
          const bar = element as BarElement;
          // Sum stacked values for the label position
          let sum = 0;
          for (let d = 0; d < dsCount; d++) {
            const raw = chart.data.datasets[d].data?.[index];
            const val = typeof raw === 'number' ? raw : Number(raw ?? 0);
            if (!Number.isNaN(val)) sum += val;
          }
          if (sum <= 0) return;

          const label = Number.isInteger(sum)
            ? String(sum)
            : sum.toLocaleString();

          const x = bar.x;
          const y = bar.y;
          const offset = 6;
          let xPos = x - offset;
          ctx.textAlign = 'right';

          if (chartArea) {
            const minX = chartArea.left + 2;
            const maxX = chartArea.right - 2;
            xPos = Math.max(minX, Math.min(maxX, xPos));
          }

          ctx.fillText(label, xPos, y);
        });

        ctx.restore();
      },
    }),
    [variant],
  );

  return (
    <div className="h-96">
      <Bar data={data} options={options} plugins={[valueLabelPlugin]} />
    </div>
  );
}
