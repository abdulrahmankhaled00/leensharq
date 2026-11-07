/**
 * Moves one id up or down inside an ordered list and returns the new full order.
 * The caller writes back 0..n-1, which also repairs gaps or duplicate sort values.
 */
export function moveInList(ids: number[], id: number, direction: "up" | "down"): number[] | null {
  const i = ids.indexOf(id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return null;
  const next = [...ids];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
