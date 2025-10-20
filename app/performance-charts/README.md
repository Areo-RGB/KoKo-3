# Performance Charts

Leistungsübersicht für Yo-Yo IR1 und Jonglieren mit verschiedenen Visualisierungen.

## Features

### Tabs

1. **Jonglieren** - Vertikales Balkendiagramm der Jonglier-Bestwerte
2. **Yo-Yo IR1** - Vertikales Balkendiagramm der zurückgelegten Distanzen
3. **Heatmap** - Kombinierte Visualisierung beider Metriken

### Heatmap Tab

Die Heatmap zeigt die kombinierte Leistung jedes Spielers basierend auf:
- **Yo-Yo IR1**: Ausdauerleistung (in Metern)
- **Jonglieren**: Technische Fähigkeiten (Wiederholungen)

#### Farbcodierung

- 🟢 **Grün**: Hohe Gesamtleistung (≥75% normalisiert)
- 🟡 **Gelb**: Mittlere bis hohe Leistung (50-74%)
- 🟠 **Orange**: Mittlere bis niedrige Leistung (25-49%)
- 🔴 **Rot**: Niedrige Gesamtleistung (<25%)

#### Datenberechnung

Die Heatmap kombiniert beide Metriken:
1. Normalisierung der Yo-Yo- und Jonglier-Werte auf eine 0-100 Skala
2. Berechnung des Durchschnitts beider Werte für jeden Spieler
3. Sortierung nach Yo-Yo IR1-Leistung

Nur Spieler mit **beiden** Metriken werden angezeigt.

## Technische Details

### Komponenten

- `performance-heatmap.tsx` - Heatmap-Visualisierung mit chartjs-chart-matrix
- `vertical-bar-chart.tsx` - Vertikale Balkendiagramme
- `chart-data-table.tsx` - Datentabellen-Ansicht

### Abhängigkeiten

- `chart.js` - Basis-Chart-Bibliothek
- `react-chartjs-2` - React-Wrapper
- `chartjs-chart-matrix` - Matrix/Heatmap-Plugin

### Datenquelle

Daten werden aus `data/performance.json` geladen:
```json
{
  "jonglieren": [...],
  "yoyoIr1": [...]
}
```

Jeder Eintrag enthält:
- `name`: Spielername
- `value`: Messwert
- `date`: Datum der Messung
- `team`: Team-Zuordnung (optional)
