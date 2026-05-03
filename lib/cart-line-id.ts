/** Stable id for a cart row: same base + same topping set merges quantity. */
export function makeLineId(menuId: string, toppingIds: string[]): string {
  const sorted = [...toppingIds].sort().join("|");
  return `${menuId}::${sorted}`;
}
