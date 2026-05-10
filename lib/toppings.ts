import type { CartLine, ToppingPlacement } from "@/lib/cart-types";

export type Topping = {
  id: string;
  label: string;
};

/** Cart must include this (or guest confirms “no base”) before placing order. */
export const ITALIAN_TOMATO_BASE_ID = "italian-tomato-base";

export const TOPPINGS: Topping[] = [
  { id: ITALIAN_TOMATO_BASE_ID, label: "Italian Tomato base" },
  { id: "mozzarella", label: "Mozzarella" },
  { id: "italian-sausage", label: "Italian Sausage" },
  { id: "ham", label: "Ham" },
  { id: "pepperoni", label: "Pepperoni" },
  { id: "chicken", label: "Chicken" },
  { id: "mushroom", label: "Mushroom" },
  { id: "bacon", label: "Bacon" },
  { id: "onion", label: "Onion" },
  { id: "pepper", label: "Pepper" },
  { id: "olives", label: "Olives" },
  { id: "basil", label: "Basil" },
  { id: "tartufatu", label: "Tartufatu" },
];

const labelById = new Map(TOPPINGS.map((t) => [t.id, t.label]));

const MENU_TOPPING_IDS = new Set(TOPPINGS.map((t) => t.id));

/** True when this menu id is one of the toppings list rows (not a combo line). */
export function isMenuToppingId(menuId: string): boolean {
  return MENU_TOPPING_IDS.has(menuId);
}

/** Total menu-topping picks (sum of line quantities for known topping ids). */
export function countMenuToppingSelections(lines: CartLine[]): number {
  if (!Array.isArray(lines)) {
    return 0;
  }
  return lines.reduce((acc, line) => {
    if (line == null || typeof line.menuId !== "string") {
      return acc;
    }
    if (!isMenuToppingId(line.menuId)) {
      return acc;
    }
    const q =
      typeof line.quantity === "number" && Number.isFinite(line.quantity)
        ? line.quantity
        : 0;
    return acc + Math.max(0, Math.floor(q));
  }, 0);
}

export function toppingLabel(id: string): string {
  return labelById.get(id) ?? id;
}

export function formatToppingsSummary(toppingIds: string[]): string {
  if (toppingIds.length === 0) {
    return "No toppings selected";
  }
  return toppingIds.map(toppingLabel).join(", ");
}

/** Human-readable coverage for cart, checkout, and tickets. */
export function formatPlacementNote(
  placement: ToppingPlacement | undefined,
): string {
  const p = placement ?? "full";
  if (p === "full") {
    return "Whole pizza";
  }
  if (p === "left") {
    return "Left side only";
  }
  return "Right side only";
}
