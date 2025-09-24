export const sortDescending = <T extends Record<string, any>>(
  items: T[],
  key: keyof T,
) => {
  return [...items].sort((a, b) => Number(b[key]) - Number(a[key]));
};
