import type { TrainingSession } from '@/app/junioren/_lib/types';

export interface WarmupMap {
  [key: string]: string[];
}

export type AgeGroup = TrainingSession['ageGroup'];

// External JSON structure expected under /junioren/aufwaermen-links.json

const AGE_TO_KEY: Record<AgeGroup, string> = {
  'A-Junior': 'a-junior',
  'B-Junior': 'b-junior',
  'C-Junior': 'c-junior',
  'D-Junior': 'd-junior',
  'E-Junior': 'e-junior',
};

export interface WarmupItem {
  url: string;
  title: string;
  group: AgeGroup;
}

const makeTitle = (url: string): string => {
  try {
    const last = url.split('/').pop() ?? url;
    let base = last.replace(/\.pdf$/i, '');
    // Remove leading "Aufwaermen"/"Aufwärmen" and optional index like "_1_" or " 1 "
    base = base.replace(/^(Aufwaermen|Aufwärmen)[ _-]*\d*[ _-]*/i, '');
    const pretty = base
      .replace(/_/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return pretty;
  } catch {
    return url;
  }
};

export const getWarmupsFromMap = (
  map: WarmupMap,
  age: AgeGroup | null,
  search: string,
): WarmupItem[] => {
  const query = (search || '').toLowerCase();

  const fromKey = (key: string, label: AgeGroup): WarmupItem[] => {
    const urls = map[key] ?? [];
    const items = urls.map((url) => ({
      url,
      title: makeTitle(url),
      group: label,
    }));
    return query
      ? items.filter(
          (i) =>
            i.title.toLowerCase().includes(query) ||
            i.url.toLowerCase().includes(query),
        )
      : items;
  };

  if (age) {
    const key = AGE_TO_KEY[age];
    return fromKey(key, age);
  }

  // No age selected: flatten all, ordered A->E
  const order: AgeGroup[] = [
    'A-Junior',
    'B-Junior',
    'C-Junior',
    'D-Junior',
    'E-Junior',
  ];
  return order.flatMap((g) => fromKey(AGE_TO_KEY[g], g));
};
