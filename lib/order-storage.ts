import type { CartLine } from "@/lib/cart-types";

export type CompletedOrder = {
  orderId: string;
  guestName: string;
  lines: CartLine[];
  totalCents: number;
  placedAt: string;
};

const KEY = "firestone-pizza:last-order";

export function saveCompletedOrder(order: CompletedOrder): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // ignore quota / private mode
  }
}

export function readCompletedOrder(): CompletedOrder | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CompletedOrder;
  } catch {
    return null;
  }
}

export function clearCompletedOrder(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
