'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Plugin,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { Variant } from '../_lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface VerticalBarChartProps {
  labels: string[];
  values: number[];
  datasetLabel: string;
  variant?: Variant;
}

export default function VerticalBarChart({
  labels,
  values,
  datasetLabel,
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

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: datasetLabel,
          data: values,
          borderRadius: 0,
          backgroundColor: barBg,
          borderColor: barBorder,
          borderWidth: 1,
          maxBarThickness: 28,
        },
      ],
    }),
    [labels, values, datasetLabel, barBg, barBorder],
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
          ticks: { color: axisColor, font: { size: 12 } },
          grid: { color: gridColorX },
        },
        y: {
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
    [axisColor, gridColorX, gridColorY, isDark],
  );

  // Draw values at the end inside each bar
  const valueLabelPlugin = useMemo<Plugin<'bar'>>(
    () => ({
      id: 'value-label-plugin',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        if (!dataset || !meta || !meta.data) return;

        ctx.save();
        ctx.font = '700 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
        // Use dark text for orange bars, white text for blue bars
        ctx.fillStyle = variant === 'orange'
          ? 'rgba(0, 0, 0, 0.9)'
          : 'rgba(255, 255, 255, 0.95)';
        ctx.textBaseline = 'middle';

        meta.data.forEach((bar: any, index: number) => {
          const raw = (dataset.data?.[index] ?? '') as number | string;
          if (raw === '' || raw === null || raw === undefined) return;

          const val = typeof raw === 'number' ? raw : Number(raw);
          if (Number.isNaN(val)) return;
          const label = Number.isInteger(val) ? String(val) : val.toLocaleString();

          const x = bar.x as number;
          const y = bar.y as number;
          const isPositive = val >= 0;

          // Position label slightly inside the bar end
          const offset = 6;
          let xPos = isPositive ? x - offset : x + offset;
          ctx.textAlign = isPositive ? 'right' : 'left';

          // Keep text within chart area bounds
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
