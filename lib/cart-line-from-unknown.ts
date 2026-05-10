import type { CartLine, ToppingPlacement } from "@/lib/cart-types";
import { makeLineId } from "@/lib/cart-line-id";

function isPlacement(x: unknown): x is ToppingPlacement {
  return x === "full" || x === "left" || x === "right";
}

/** Parse a cart line from JSON/localStorage; returns null if required fields are missing. */
export function cartLineFromUnknown(row: unknown): CartLine | null {
  if (typeof row !== "object" || row === null) {
    return null;
  }
  const r = row as Record<string, unknown>;
  if (
    typeof r.menuId !== "string" ||
    typeof r.name !== "string" ||
    typeof r.priceCents !== "number" ||
    typeof r.quantity !== "number"
  ) {
    return null;
  }
  let toppingIds: string[] = [];
  if (
    Array.isArray(r.toppingIds) &&
    r.toppingIds.every((x): x is string => typeof x === "string")
  ) {
    toppingIds = r.toppingIds;
  }
  let placement: ToppingPlacement = "full";
  if (isPlacement(r.placement)) {
    placement = r.placement;
  } else if (typeof r.lineId === "string") {
    const parts = r.lineId.split("::");
    if (parts.length >= 3 && isPlacement(parts[1])) {
      placement = parts[1];
    }
  }
  const lineId = makeLineId(r.menuId, toppingIds, placement);
  return {
    lineId,
    menuId: r.menuId,
    name: r.name,
    priceCents: r.priceCents,
    quantity: r.quantity,
    toppingIds,
    placement,
  };
}
