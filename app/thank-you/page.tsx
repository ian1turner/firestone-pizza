"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCompletedOrder,
  readCompletedOrder,
  type CompletedOrder,
} from "@/lib/order-storage";
import { formatPlacementNote, formatToppingsSummary } from "@/lib/toppings";

export default function ThankYouPage() {
  const [order, setOrder] = useState<CompletedOrder | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const o = readCompletedOrder();
    setOrder(o);
  }, []);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
          No order here
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Place an order from checkout and you will land here with a
          confirmation.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex rounded-full bg-[var(--ember)] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
        >
          Start from the menu
        </Link>
      </div>
    );
  }

  const placed = new Date(order.placedAt);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--ember)]">
        Order received
      </p>
      <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
        Thanks, {order.guestName}!
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">
        Your kitchen ticket is{" "}
        <span className="rounded-md bg-stone-100 px-2 py-0.5 font-mono text-sm font-semibold text-[var(--ink)]">
          {order.orderId}
        </span>
        . Hang tight — we will call it when it is out of the oven.
      </p>

      <div className="mt-10 rounded-3xl border border-stone-200/90 bg-[var(--paper)] p-7 shadow-[var(--shadow-card)]">
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between text-[var(--muted)]">
            <dt>Placed</dt>
            <dd className="font-medium text-[var(--ink)]">
              {placed.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
        </dl>
        <ul className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm text-[var(--muted)]">
          {order.lines.map((line) => (
            <li key={line.lineId}>
              <span className="font-medium text-[var(--ink)]">{line.name}</span>
              <span className="mt-0.5 block text-xs font-semibold leading-snug text-[var(--ember)]">
                {formatPlacementNote(line.placement)}
              </span>
              {line.toppingIds.length > 0 ? (
                <span className="mt-0.5 block text-xs leading-snug">
                  {formatToppingsSummary(line.toppingIds)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/menu"
          onClick={() => clearCompletedOrder()}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--ember)] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
        >
          New order
        </Link>
        <Link
          href="/"
          className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-stone-300/90 bg-[var(--paper)] px-6 py-3.5 text-center text-sm font-semibold text-[var(--ink)] transition hover:border-stone-400 hover:bg-white"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
