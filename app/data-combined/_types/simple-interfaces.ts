// Simplified interfaces for the streamlined normative data table

export interface SimpleDataPoint {
  age: string;
  lowest: number;
  highest: number;
}

export interface SimpleMetric {
  name: string;
  unit: string;
  lowerIsBetter: boolean;
  data: SimpleDataPoint[];
}

export interface SimpleStudy {
  name: string;
  description: string;
}

export interface SimpleCategory {
  name: string;
  description: string;
  metrics: string[];
}

export interface SimpleNormativeData {
  version: string;
  lastUpdated: string;
  study: SimpleStudy;
  categories: SimpleCategory[];
  metrics: SimpleMetric[];
}

// Flattened row interface for the simplified table display
export interface SimpleNormativeDataRow {
  id: string;
  age: string;
  metric: string;
  unit: string;
  lowest: number;
  highest: number;
}
