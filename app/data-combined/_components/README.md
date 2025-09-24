# Normwerte Charts Component

This component provides interactive data visualizations for the normative sports performance data using Chart.js.

## Features

### Chart Types

1. **Age Progression Chart (Line Chart)**
   - Shows how performance values change across age groups
   - Displays both lowest and highest values for a selected metric
   - Only visible when a specific metric is selected

2. **Performance Range Chart (Bar Chart)**
   - Visualizes the performance range (highest - lowest) for each metric
   - Only visible when a specific age group is selected
   - Helps identify which metrics have the most variation

3. **Category Distribution (Doughnut Chart)**
   - Shows the distribution of metrics across different categories
   - Always visible as an overview
   - Helps understand the data structure

4. **Performance Profile (Radar Chart)**
   - Detailed view of all metrics within a selected category
   - Only visible when both age group and category are selected
   - Ideal for comparing multiple performance aspects

5. **Performance Development (Mixed Bar/Line Chart)**
   - Combines average values (line) with performance ranges (bars)
   - Shows both central tendency and variability across age groups
   - Only visible when a specific metric is selected

### Interactive Features

- Charts automatically update based on table filter selections
- Responsive design that works on desktop and mobile
- Hover tooltips for detailed information
- Color-coded data for easy interpretation

### Data Integration

The component receives filtered data from the main data table and automatically:

- Filters data based on current selections
- Calculates appropriate chart data
- Updates visualizations in real-time
- Provides summary statistics

## Usage

```tsx
<NormwerteCharts
  data={normativeData}
  categories={categories}
  selectedCategory={filters.selectedCategory}
  selectedAge={filters.selectedAge}
  selectedMetric={filters.selectedMetric}
/>
```

## Dependencies

- Chart.js 4.5.0
- react-chartjs-2 5.3.0
- React 19+

## Color Scheme

The component uses a consistent color scheme:

- Primary (Blue): Main data series
- Secondary (Green): Comparison data series
- Accent (Orange): Highlights and special data
- Danger (Red): Warning or extreme values
