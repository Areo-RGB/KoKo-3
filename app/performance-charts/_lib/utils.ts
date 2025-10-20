export const sortDescending = <T extends Record<string, unknown>>(
  items: T[],
  key: keyof T,
) => {
  return [...items].sort(
    (a, b) => Number(b[key] ?? 0) - Number(a[key] ?? 0),
  );
};
