"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { TOPPINGS, type Topping } from "@/lib/toppings";

export function MenuClient() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState(() => new Set<string>());

  function addTopping(t: Topping) {
    addItem(t.id, t.label, 0, []);
    setAddedIds((prev) => new Set(prev).add(t.id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <ul className="mx-auto max-w-2xl divide-y divide-stone-200/90 overflow-hidden rounded-2xl border border-stone-200/90 bg-[var(--paper)] shadow-[var(--shadow-card)]">
        {TOPPINGS.map((t) => (
          <li
            key={t.id}
            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
          >
            <span className="font-display text-lg font-semibold text-[var(--ink)] sm:text-xl">
              {t.label}
            </span>
            <button
              type="button"
              onClick={() => addTopping(t)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition sm:min-w-[8.5rem] ${
                addedIds.has(t.id)
                  ? "border border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200"
                  : "bg-[var(--ember)] text-white hover:bg-[var(--ember-hover)]"
              }`}
            >
              {addedIds.has(t.id) ? "Added" : "Add"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
