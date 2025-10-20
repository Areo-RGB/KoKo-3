'use client';

import {
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  Plugin,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarDataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface RadarChartProps {
  labels: string[];
  datasets: RadarDataset[];
}

export default function RadarChart({ labels, datasets }: RadarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const axisColor = isDark ? '#e5e7eb' : '#0f172a';
  const gridColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(148, 163, 184, 0.15)';

  const processedDatasets = useMemo(() => {
    const colors = [
      {
        bg: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.2)',
        border: 'rgba(251, 146, 60, 1)',
      },
      {
        bg: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.2)',
        border: 'rgba(37, 99, 235, 1)',
      },
      {
        bg: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(22, 163, 74, 0.2)',
        border: 'rgba(22, 163, 74, 1)',
      },
      {
        bg: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.2)',
        border: 'rgba(147, 51, 234, 1)',
      },
      {
        bg: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(220, 38, 38, 0.2)',
        border: 'rgba(220, 38, 38, 1)',
      },
    ];

    return datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor ?? colors[index % colors.length].bg,
      borderColor: dataset.borderColor ?? colors[index % colors.length].border,
      borderWidth: dataset.borderWidth ?? 2,
      pointBackgroundColor: dataset.borderColor ?? colors[index % colors.length].border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: dataset.borderColor ?? colors[index % colors.length].border,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));
  }, [datasets, isDark]);

  const data = useMemo(
    () => ({
      labels,
      datasets: processedDatasets,
    }),
    [labels, processedDatasets],
  );

  const options = useMemo<ChartOptions<'radar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          angleLines: {
            color: gridColor,
          },
          grid: {
            color: gridColor,
          },
          pointLabels: {
            color: axisColor,
            font: {
              size: 12,
              weight: 'bold',
            },
          },
          ticks: {
            color: axisColor,
            backdropColor: 'transparent',
            font: {
              size: 10,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: axisColor,
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: 'circle',
          },
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
    [axisColor, gridColor, isDark],
  );

  return (
    <div className="h-96">
      <Radar data={data} options={options} />
    </div>
  );
}