import {
  type CompletedOrder,
  completedOrderFromUnknown,
} from "@/lib/order-storage";

const STORAGE_KEY = "firestone-pizza:day-orders-v1";
const MAX_ORDERS = 10;

function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSameLocalDay(iso: string, ref: Date): boolean {
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) {
    return false;
  }
  return localDayKey(t) === localDayKey(ref);
}

function loadRaw(): CompletedOrder[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((row) => completedOrderFromUnknown(row))
      .filter((o): o is CompletedOrder => o !== null);
  } catch {
    return [];
  }
}

function persist(list: CompletedOrder[]) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** Keep only today’s orders in storage; return up to MAX_ORDERS newest first. */
export function getTodaysOrders(): CompletedOrder[] {
  const now = new Date();
  const list = loadRaw();
  const todayOnly = list.filter((o) => isSameLocalDay(o.placedAt, now));
  if (todayOnly.length !== list.length) {
    persist(todayOnly);
  }
  return [...todayOnly]
    .sort(
      (a, b) =>
        new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    )
    .slice(0, MAX_ORDERS);
}

/** Append after a successful checkout; drops prior-day rows and caps at MAX_ORDERS. */
export function appendTodaysOrder(order: CompletedOrder): void {
  const now = new Date();
  if (!isSameLocalDay(order.placedAt, now)) {
    return;
  }
  const kept = loadRaw().filter((o) => isSameLocalDay(o.placedAt, now));
  const next = [order, ...kept.filter((o) => o.orderId !== order.orderId)];
  next.sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
  );
  persist(next.slice(0, MAX_ORDERS));
}

/** Remove one order from today’s log by id; no-op if missing or not today. */
export function removeTodaysOrder(orderId: string): void {
  if (typeof orderId !== "string" || orderId.length === 0) {
    return;
  }
  const now = new Date();
  const kept = loadRaw().filter((o) => isSameLocalDay(o.placedAt, now));
  const next = kept.filter((o) => o.orderId !== orderId);
  if (next.length === kept.length) {
    return;
  }
  persist(next);
}
