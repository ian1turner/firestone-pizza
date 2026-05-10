"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-context";
import { appendTodaysOrder } from "@/lib/orders-day-log";
import type { CompletedOrder } from "@/lib/order-storage";
import { saveCompletedOrder } from "@/lib/order-storage";
import {
  formatPlacementNote,
  formatToppingsSummary,
  ITALIAN_TOMATO_BASE_ID,
  toppingLabel,
} from "@/lib/toppings";

function makeOrderId(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HK-${part}`;
}

function cartHasItalianTomatoBase(lines: { menuId: string }[]): boolean {
  return lines.some((l) => l.menuId === ITALIAN_TOMATO_BASE_ID);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalCents, clearCart, addItem } = useCart();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [baseModalOpen, setBaseModalOpen] = useState(false);
  const baseModalTitleId = useId();

  const completeOrder = useCallback(
    (guestName: string) => {
      const orderId = makeOrderId();
      const placedAt = new Date().toISOString();
      const snapshot = lines.map((l) => ({ ...l }));

      const order: CompletedOrder = {
        orderId,
        guestName,
        lines: snapshot,
        totalCents,
        placedAt,
      };
      saveCompletedOrder(order);
      appendTodaysOrder(order);
      clearCart();
      router.push("/thank-you");
    },
    [lines, totalCents, clearCart, router],
  );

  useEffect(() => {
    if (!baseModalOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBaseModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [baseModalOpen]);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
          Nothing to check out
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Add items from the menu first, then come back here.
        </p>
        <Link
          href="/menu"
          className="mt-8 inline-flex rounded-full bg-[var(--ember)] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
        >
          Go to menu
        </Link>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("Please enter the name you want on the ticket.");
      return;
    }
    if (trimmed.length > 80) {
      setError("Keep it under 80 characters so it fits the ticket.");
      return;
    }
    setError(null);

    if (!cartHasItalianTomatoBase(lines)) {
      setBaseModalOpen(true);
      return;
    }

    setSubmitting(true);
    completeOrder(trimmed);
  }

  function handleNoBaseConfirm() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setBaseModalOpen(false);
      setError("Please enter the name you want on the ticket.");
      return;
    }
    setBaseModalOpen(false);
    setSubmitting(true);
    completeOrder(trimmed);
  }

  function handleYesAddBase() {
    addItem(
      ITALIAN_TOMATO_BASE_ID,
      toppingLabel(ITALIAN_TOMATO_BASE_ID),
      0,
      [],
      "full",
    );
    setBaseModalOpen(false);
  }

  return (
    <div className="relative mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)]">
        Checkout
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        This is a practice order — nothing is charged. We just need what to
        call you at the pass.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-8 rounded-3xl border border-stone-200/90 bg-[var(--paper)] p-6 shadow-[var(--shadow-card)] sm:p-9"
      >
        <div>
          <label
            htmlFor="guest-name"
            className="block text-sm font-semibold text-[var(--ink)]"
          >
            Name for the ticket
          </label>
          <input
            id="guest-name"
            name="guestName"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={80}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3.5 text-[var(--ink)] placeholder:text-stone-400 transition focus:border-[var(--ember)] focus:outline-none focus:ring-2 focus:ring-[var(--ember)]/25"
          />
          {error ? (
            <p className="mt-2 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
            Order summary
          </h2>
          <ul className="mt-3 divide-y divide-stone-100">
            {lines.map((line) => (
              <li
                key={line.lineId}
                className="py-3 text-sm text-[var(--muted)]"
              >
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[var(--ember)] py-4 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Place order (demo)"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link
          href="/cart"
          className="font-medium text-[var(--muted)] underline-offset-2 hover:text-[var(--ink)] hover:underline"
        >
          Back to cart
        </Link>
      </p>

      {baseModalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[var(--charcoal-deep)]/70 backdrop-blur-sm"
            onClick={() => setBaseModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={baseModalTitleId}
            className="relative z-[101] w-full max-w-md rounded-2xl border border-stone-200/90 bg-[var(--paper)] p-6 shadow-[var(--shadow-float)] sm:p-8"
          >
            <h2
              id={baseModalTitleId}
              className="font-display text-xl font-semibold text-[var(--ink)] sm:text-2xl"
            >
              Are you sure you don&apos;t want any base?
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your cart doesn&apos;t include Italian Tomato base. We can add
              it for you, or confirm you really want no base.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleNoBaseConfirm}
                className="flex-1 rounded-full border-2 border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-stone-50"
              >
                Nope, no base!
              </button>
              <button
                type="button"
                onClick={handleYesAddBase}
                className="flex-1 rounded-full bg-[var(--ember)] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)]"
              >
                Dough! 😉, yes i do!
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
