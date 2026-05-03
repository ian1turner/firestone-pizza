"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTodaysOrders, removeTodaysOrder } from "@/lib/orders-day-log";
import type { CompletedOrder } from "@/lib/order-storage";
import { formatToppingsSummary } from "@/lib/toppings";

export function OrdersClient() {
  const [orders, setOrders] = useState<CompletedOrder[] | null>(null);

  useEffect(() => {
    setOrders(getTodaysOrders());
  }, []);

  function handleRemoveOrder(orderId: string, guestName: string) {
    const ok = window.confirm(
      `Remove this order from today’s list?\n\n${guestName}`,
    );
    if (!ok) {
      return;
    }
    removeTodaysOrder(orderId);
    setOrders(getTodaysOrders());
  }

  if (orders === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-[var(--muted)] sm:px-6">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
        View all orders
      </h1>
      <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--muted)]">
        Up to 10 most recent orders from <strong>today</strong> (on this
        device&apos;s clock). Anything from before midnight local time is
        removed from the list automatically.
      </p>

      {orders.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-dashed border-stone-300 bg-[var(--paper)]/80 px-6 py-16 text-center text-[var(--muted)]">
          <p className="text-lg font-medium text-[var(--ink)]">
            No orders yet today
          </p>
          <p className="mt-2 text-sm">
            When someone completes checkout, their ticket shows up here until
            the day rolls over.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-flex rounded-full bg-[var(--ember)] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
          >
            Open menu
          </Link>
        </div>
      ) : (
        <ol className="mt-10 space-y-6">
          {orders.map((order, index) => {
            const placed = new Date(order.placedAt);
            return (
              <li
                key={order.orderId}
                className="rounded-3xl border border-stone-200/90 bg-[var(--paper)] p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                      #{index + 1} · {order.orderId}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {placed.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOrder(order.orderId, order.guestName)}
                    className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                    aria-label={`Delete order for ${order.guestName}`}
                  >
                    Delete order
                  </button>
                </div>
                <p className="mt-3 font-display text-xl font-semibold text-[var(--ink)]">
                  {order.guestName}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {order.lines.map((line) => (
                    <li key={line.lineId}>
                      <span className="font-medium text-[var(--ink)]">
                        {line.quantity}× {line.name}
                      </span>
                      {line.toppingIds.length > 0 ? (
                        <span className="mt-0.5 block text-xs leading-snug">
                          {formatToppingsSummary(line.toppingIds)}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
