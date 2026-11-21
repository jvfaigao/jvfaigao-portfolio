// Pure so it can be unit-tested without Astro's content layer.
export function groupProjects<T extends { data: { group: 'production' | 'other'; order: number } }>(
  entries: T[],
): { production: T[]; other: T[] } {
  const sorted = [...entries].sort((a, b) => a.data.order - b.data.order);
  return {
    production: sorted.filter((p) => p.data.group === 'production'),
    other: sorted.filter((p) => p.data.group === 'other'),
  };
}
