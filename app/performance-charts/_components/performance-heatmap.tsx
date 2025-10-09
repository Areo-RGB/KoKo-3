'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Plugin,
  Tooltip,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  MatrixController,
  MatrixElement,
  Tooltip,
  Legend,
);

interface HeatmapData {
  name: string;
  yoyo: number;
  jonglieren: number;
}

interface PerformanceHeatmapProps {
  data: HeatmapData[];
}

export default function PerformanceHeatmap({ data }: PerformanceHeatmapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const axisColor = isDark ? '#e5e7eb' : '#0f172a';
  const gridColor = isDark
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(148, 163, 184, 0.1)';

  // Prepare matrix data
  const matrixData = useMemo(() => {
    // Calculate max values for normalization
    const maxYoyo = Math.max(...data.map((d) => d.yoyo));
    const maxJonglieren = Math.max(...data.map((d) => d.jonglieren));

    // Map and calculate combined scores
    const withScores = data.map((player) => {
      const normalizedYoyo = (player.yoyo / maxYoyo) * 100;
      const normalizedJonglieren = (player.jonglieren / maxJonglieren) * 100;
      const combinedScore = (normalizedYoyo + normalizedJonglieren) / 2;

      return {
        x: 'Yo-Yo IR1',
        y: player.name,
        v: combinedScore,
        raw: {
          yoyo: player.yoyo,
          jonglieren: player.jonglieren,
        },
      };
    });

    // Sort by combined score ascending (worst to best) so best appears at top of chart
    return withScores.sort((a, b) => a.v - b.v);
  }, [data]);

  const playerNames = useMemo(
    () => [...new Set(matrixData.map((d) => d.y))],
    [matrixData],
  );

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: 'Gesamtleistung',
          data: matrixData,
          backgroundColor(context: any) {
            const value = context.dataset.data[context.dataIndex]?.v || 0;

            // Color gradient from red (low) to yellow to green (high)
            if (value >= 75) {
              // High performance: green shades
              const intensity = ((value - 75) / 25) * 0.3 + 0.6;
              return isDark
                ? `rgba(34, 197, 94, ${intensity})`
                : `rgba(22, 163, 74, ${intensity})`;
            } else if (value >= 50) {
              // Medium-high: yellow-green
              const intensity = ((value - 50) / 25) * 0.3 + 0.6;
              return isDark
                ? `rgba(234, 179, 8, ${intensity})`
                : `rgba(202, 138, 4, ${intensity})`;
            } else if (value >= 25) {
              // Medium-low: orange
              const intensity = ((value - 25) / 25) * 0.3 + 0.5;
              return isDark
                ? `rgba(251, 146, 60, ${intensity})`
                : `rgba(249, 115, 22, ${intensity})`;
            } else {
              // Low performance: red shades
              const intensity = (value / 25) * 0.3 + 0.4;
              return isDark
                ? `rgba(239, 68, 68, ${intensity})`
                : `rgba(220, 38, 38, ${intensity})`;
            }
          },
          borderColor: isDark
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          width: ({ chart }: any) => {
            const { width } = chart.chartArea || { width: 0 };
            return Math.max(width * 0.8, 40);
          },
          height: ({ chart }: any) => {
            const { height } = chart.chartArea || { height: 0 };
            const barCount = playerNames.length || 1;
            return Math.max((height * 0.8) / barCount, 20);
          },
        },
      ],
    }),
    [matrixData, isDark, playerNames.length],
  );

  const options = useMemo<ChartOptions<'matrix'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 16 },
      scales: {
        x: {
          type: 'category',
          labels: ['Yo-Yo IR1'],
          offset: true,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          type: 'category',
          labels: playerNames,
          offset: true,
          ticks: {
            color: axisColor,
            font: { size: 12 },
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark
            ? 'rgba(17, 24, 39, 0.95)'
            : 'rgba(255,255,255,0.95)',
          titleColor: axisColor,
          bodyColor: axisColor,
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title(context: any) {
              const dataPoint = context[0]?.raw;
              return dataPoint?.y || '';
            },
            label(context: any) {
              const dataPoint = context.raw;
              if (!dataPoint?.raw) return '';

              return [
                `Yo-Yo IR1: ${dataPoint.raw.yoyo} m`,
                `Jonglieren: ${dataPoint.raw.jonglieren} Wdh.`,
                ``,
                `Gesamtwert: ${Math.round(dataPoint.v)}%`,
              ];
            },
          },
        },
      },
    }),
    [axisColor, gridColor, isDark, playerNames],
  );

  // Plugin to draw values inside cells
  const valueLabelPlugin = useMemo<Plugin<'matrix'>>(
    () => ({
      id: 'heatmap-value-label',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        ctx.save();
        ctx.font =
          '600 11px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        meta.data.forEach((element: any, index: number) => {
          const dataPoint = matrixData[index];
          if (!dataPoint?.raw) return;

          const { x, y } = element.getCenterPoint();

          // Draw text with shadow for better readability
          const value = dataPoint.v;
          const textColor =
            value >= 50
              ? 'rgba(255, 255, 255, 0.95)'
              : isDark
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(0, 0, 0, 0.8)';

          ctx.fillStyle = textColor;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 2;

          // Display both values compactly
          const yoyoText = `${dataPoint.raw.yoyo}m`;
          const jonglierenText = `${dataPoint.raw.jonglieren}×`;

          ctx.fillText(yoyoText, x, y - 6);
          ctx.fillText(jonglierenText, x, y + 6);
        });

        ctx.restore();
      },
    }),
    [matrixData, isDark],
  );

  return (
    <div className="h-[600px]">
      <Chart
        type="matrix"
        data={chartData}
        options={options}
        plugins={[valueLabelPlugin]}
      />
    </div>
  );
}
