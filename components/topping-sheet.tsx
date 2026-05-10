"use client";

import { useEffect, useId, useState } from "react";
import { PlacementToggle } from "@/components/placement-toggle";
import type { MenuItem } from "@/lib/menu";
import { formatPrice } from "@/lib/menu";
import type { ToppingPlacement } from "@/lib/cart-types";
import { TOPPINGS } from "@/lib/toppings";

type ToppingSheetProps = {
  item: MenuItem;
  onClose: () => void;
  /** Same behavior as the menu: each tap on left / whole / right adds that topping. */
  onAddTopping: (
    toppingId: string,
    toppingLabel: string,
    placement: ToppingPlacement,
  ) => void;
  /** When the guest clears a highlighted placement, remove that line from the cart. */
  onRemoveTopping?: (
    toppingId: string,
    placement: ToppingPlacement,
  ) => void;
};

export function ToppingSheet({
  item,
  onClose,
  onAddTopping,
  onRemoveTopping,
}: ToppingSheetProps) {
  const titleId = useId();
  const [lastPlacement, setLastPlacement] = useState<
    Record<string, ToppingPlacement>
  >({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close topping picker"
        className="absolute inset-0 bg-[var(--charcoal-deep)]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-stone-200/90 bg-[var(--paper)] shadow-[var(--shadow-float)] sm:max-h-[85vh] sm:rounded-[1.75rem]"
      >
        <div className="border-b border-white/10 bg-[var(--charcoal)] px-5 pb-5 pt-6 sm:px-7 sm:pt-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
            Toppings for this pizza
          </p>
          <h2
            id={titleId}
            className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--cream)]"
          >
            {item.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">
            {item.description}
          </p>
          <p className="mt-3 text-sm font-semibold text-[var(--cream)]">
            {formatPrice(item.priceCents)}{" "}
            <span className="font-normal text-stone-500">· any combination</span>
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--paper)] px-5 py-5 sm:px-7">
          <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">
            Tap{" "}
            <span className="font-semibold text-[var(--ink)]">left</span>,{" "}
            <span className="font-semibold text-[var(--ink)]">whole</span>, or{" "}
            <span className="font-semibold text-[var(--ink)]">right</span> for a
            topping to add it to your cart — tap the same choice again to remove
            it. Same as the main menu.
          </p>
          <ul className="divide-y divide-stone-200/90 overflow-hidden rounded-2xl border border-stone-200/90 bg-[var(--paper)] shadow-[var(--shadow-card)]">
            {TOPPINGS.map((t) => (
              <li key={t.id} className="px-4 py-4 sm:px-5 sm:py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="font-display text-base font-semibold text-[var(--ink)] sm:text-lg">
                    {t.label}
                  </span>
                  <div className="flex shrink-0 flex-col gap-1 sm:items-end">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400 sm:text-right">
                      On the pizza
                    </p>
                    <PlacementToggle
                      compact
                      selectionAccent="red"
                      value={lastPlacement[t.id] ?? null}
                      onChange={(next, toggledOff) => {
                        if (next === null) {
                          if (toggledOff === undefined) {
                            return;
                          }
                          onRemoveTopping?.(t.id, toggledOff);
                          setLastPlacement((prev) => {
                            const copy = { ...prev };
                            delete copy[t.id];
                            return copy;
                          });
                          return;
                        }
                        setLastPlacement((prev) => ({ ...prev, [t.id]: next }));
                        onAddTopping(t.id, t.label, next);
                      }}
                      idPrefix={`sheet-${t.id}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-200/80 bg-[var(--cream)]/90 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-stone-50 sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
