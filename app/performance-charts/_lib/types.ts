export type Variant = 'orange' | 'blue';

export interface TabConfig {
  key: string;
  title: string;
  valueKey: string;
  unit: string;
  description: string;
  variant: Variant;
}
