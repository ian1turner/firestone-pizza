import type { ToppingPlacement } from "@/lib/cart-types";

/** Stable id for a cart row: same base + placement + same topping set merges quantity. */
export function makeLineId(
  menuId: string,
  toppingIds: string[],
  placement: ToppingPlacement = "full",
): string {
  const sorted = [...toppingIds].sort().join("|");
  return `${menuId}::${placement}::${sorted}`;
}
