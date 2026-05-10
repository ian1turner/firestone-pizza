/** Where the topping should go on the pizza. */
export type ToppingPlacement = "full" | "left" | "right";

export type CartLine = {
  /** Unique row id (menu id + placement + sorted toppings). */
  lineId: string;
  menuId: string;
  name: string;
  priceCents: number;
  quantity: number;
  toppingIds: string[];
  /** Coverage for this line; default full for legacy stored orders. */
  placement: ToppingPlacement;
};
