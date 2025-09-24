import simpleNormativeData from '@/data/normative/simple-normative-data.json';
import {
  SimpleCategory,
  SimpleNormativeData,
  SimpleNormativeDataRow,
} from '../_types/simple-interfaces';

export async function getSimpleNormativeData(): Promise<
  SimpleNormativeDataRow[]
> {
  const data: SimpleNormativeDataRow[] = [];
  const normData = simpleNormativeData as SimpleNormativeData;

  // Flatten the data structure into rows for the table
  normData.metrics.forEach((metric) => {
    metric.data.forEach((dataPoint) => {
      data.push({
        id: `${metric.name}-${dataPoint.age}`,
        age: dataPoint.age,
        metric: metric.name,
        unit: metric.unit,
        lowest: dataPoint.lowest,
        highest: dataPoint.highest,
      });
    });
  });

  return data;
}

export async function getSimpleCategories(): Promise<SimpleCategory[]> {
  const normData = simpleNormativeData as SimpleNormativeData;
  return normData.categories || [];
}
