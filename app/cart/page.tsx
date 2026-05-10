"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { formatPlacementNote, formatToppingsSummary } from "@/lib/toppings";

export default function CartPage() {
  const { lines, removeLine, itemCount } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
          Your cart is empty
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Start with something from the menu — the kitchen is ready when you
          are.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex rounded-full bg-[var(--ember)] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
        Cart
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <ul className="mt-10 divide-y divide-stone-200/90 rounded-3xl border border-stone-200/90 bg-[var(--paper)] shadow-[var(--shadow-card)]">
        {lines.map((line) => (
          <li
            key={line.lineId}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-lg font-semibold text-[var(--ink)]">{line.name}</p>
              <p className="mt-1 text-sm font-semibold tracking-wide text-[var(--ember)]">
                {formatPlacementNote(line.placement)}
              </p>
              {line.toppingIds.length > 0 ? (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {formatToppingsSummary(line.toppingIds)}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => removeLine(line.lineId)}
                className="text-sm font-medium text-stone-400 underline-offset-2 hover:text-[var(--ember)] hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-stone-200/90 bg-[var(--paper)] p-7 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          Ready for the kitchen — no prices on this list.
        </p>
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center rounded-full bg-[var(--ember)] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
        >
          Continue to checkout
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        <Link href="/menu" className="font-medium text-[var(--ink)] underline-offset-2 hover:underline">
          Add more from the menu
        </Link>
      </p>
    </div>
  );
}
