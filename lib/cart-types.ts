export type CartLine = {
  /** Unique row id (base menu id + sorted toppings). */
  lineId: string;
  menuId: string;
  name: string;
  priceCents: number;
  quantity: number;
  toppingIds: string[];
};
