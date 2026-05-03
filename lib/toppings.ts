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

export function toppingLabel(id: string): string {
  return labelById.get(id) ?? id;
}

export function formatToppingsSummary(toppingIds: string[]): string {
  if (toppingIds.length === 0) {
    return "No toppings selected";
  }
  return toppingIds.map(toppingLabel).join(", ");
}
