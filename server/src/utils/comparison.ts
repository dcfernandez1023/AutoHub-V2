export function diffObjects<T extends Record<string, any>>(oldObj: T, newObj: T) {
  const diff: Partial<Record<keyof T, { before: any; after: any }>> = {};

  for (const key of new Set([...Object.keys(oldObj), ...Object.keys(newObj)])) {
    if (oldObj[key] !== newObj[key]) {
      diff[key as keyof T] = {
        before: oldObj[key],
        after: newObj[key],
      };
    }
  }

  return diff;
}

export function formatDiff(diff: Record<string, { before: any; after: any }>, excludeKeys?: string[]): string {
  return Object.entries(diff)
    .map(([path, { before, after }]) => {
      if (excludeKeys?.includes(path)) {
        return null;
      }
      const oldVal = JSON.stringify(before);
      const newVal = JSON.stringify(after);
      return `${path}: ${oldVal} → ${newVal}`;
    })
    .filter((d) => Boolean(d))
    .join(' | ');
}
