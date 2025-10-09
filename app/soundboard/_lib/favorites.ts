const FAVORITES_KEY = 'soundboard:favorites';

export function normalizeFavoriteKey(raw: string) {
  if (raw.includes('::')) return raw;
  const parts = raw.split(':').filter(Boolean);
  if (parts.length >= 2) {
    const topicId = parts[parts.length - 2];
    const soundId = parts[parts.length - 1];
    return `${topicId}::${soundId}`;
  }
  return raw;
}

export function readFavoritesFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return new Set();

    return new Set(parsed.map((value) => normalizeFavoriteKey(String(value))));
  } catch {}

  return new Set();
}

export function persistFavorites(favorites: Set<string>) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(Array.from(favorites)),
    );
  } catch {
    // ignore storage errors (quota exceeded, etc.)
  }
}
