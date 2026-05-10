import type { CartLine } from "@/lib/cart-types";
import { cartLineFromUnknown } from "@/lib/cart-line-from-unknown";

export type CompletedOrder = {
  orderId: string;
  guestName: string;
  lines: CartLine[];
  totalCents: number;
  placedAt: string;
};

const KEY = "firestone-pizza:last-order";

/** Validate and normalize JSON from sessionStorage so UI never reads partial orders. */
export function completedOrderFromUnknown(data: unknown): CompletedOrder | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const o = data as Record<string, unknown>;
  if (typeof o.orderId !== "string" || o.orderId.length === 0) {
    return null;
  }
  if (typeof o.guestName !== "string") {
    return null;
  }
  if (
    typeof o.totalCents !== "number" ||
    !Number.isFinite(o.totalCents) ||
    o.totalCents < 0
  ) {
    return null;
  }
  if (typeof o.placedAt !== "string" || o.placedAt.length === 0) {
    return null;
  }
  if (!Array.isArray(o.lines)) {
    return null;
  }
  const lines = o.lines
    .map(cartLineFromUnknown)
    .filter((row): row is CartLine => row !== null);
  if (lines.length === 0) {
    return null;
  }
  return {
    orderId: o.orderId,
    guestName: o.guestName,
    lines,
    totalCents: o.totalCents,
    placedAt: o.placedAt,
  };
}

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
    const parsed = JSON.parse(raw) as unknown;
    return completedOrderFromUnknown(parsed);
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
