"use client";

import { useCallback, useState } from "react";
import { PlacementToggle } from "@/components/placement-toggle";
import { useCart } from "@/components/cart-context";
import type { ToppingPlacement } from "@/lib/cart-types";
import { makeLineId } from "@/lib/cart-line-id";
import { TOPPINGS } from "@/lib/toppings";

export function MenuClient() {
  const { addItem, removeLine } = useCart();
  const [lastPlacement, setLastPlacement] = useState<
    Record<string, ToppingPlacement>
  >({});

  const handlePick = useCallback(
    (menuId: string, name: string, p: ToppingPlacement) => {
      setLastPlacement((prev) => ({ ...prev, [menuId]: p }));
      addItem(menuId, name, 0, [], p);
    },
    [addItem],
  );

  const handlePlacement = useCallback(
    (
      menuId: string,
      name: string,
      next: ToppingPlacement | null,
      toggledOff?: ToppingPlacement,
    ) => {
      if (next === null) {
        if (toggledOff === undefined) {
          return;
        }
        removeLine(makeLineId(menuId, [], toggledOff));
        setLastPlacement((prev) => {
          const copy = { ...prev };
          delete copy[menuId];
          return copy;
        });
        return;
      }
      handlePick(menuId, name, next);
    },
    [handlePick, removeLine],
  );

  return (
    <div className="mt-10 w-full max-w-2xl">
      <ul className="divide-y divide-stone-200/90 overflow-hidden rounded-2xl border border-stone-200/90 bg-[var(--paper)] shadow-[var(--shadow-card)]">
        {TOPPINGS.map((t) => (
          <li key={t.id} className="px-4 py-4 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="min-w-0 flex-1">
                <span className="font-display text-lg font-semibold text-[var(--ink)] sm:text-xl">
                  {t.label}
                </span>
                <p className="mt-1.5 text-xs leading-snug text-[var(--muted)] sm:text-sm">
                  Tap{" "}
                  <span className="font-semibold text-[var(--ink)]">left</span>,{" "}
                  <span className="font-semibold text-[var(--ink)]">whole</span>, or{" "}
                  <span className="font-semibold text-[var(--ink)]">right</span> to add
                  to your cart — tap the same choice again to remove it. Your last
                  choice stays highlighted.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5 sm:items-end">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 sm:text-right sm:text-[11px]">
                  On the pizza
                </p>
                <PlacementToggle
                  compact
                  selectionAccent="red"
                  value={lastPlacement[t.id] ?? null}
                  onChange={(next, toggledOff) => {
                    handlePlacement(t.id, t.label, next, toggledOff);
                  }}
                  idPrefix={`row-${t.id}`}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
