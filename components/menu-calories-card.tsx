"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { countMenuToppingSelections } from "@/lib/toppings";

const PIG_SRC = "/calories-pig.png";
const MIN_TOPPINGS_FOR_PIG = 6;

export function MenuCaloriesCard() {
  const { lines } = useCart();
  const toppingCount = countMenuToppingSelections(lines);
  const showPig = toppingCount >= MIN_TOPPINGS_FOR_PIG;

  return (
    <div className="mt-8 max-w-2xl rounded-2xl border border-stone-200/90 bg-[var(--paper)] px-4 py-4 text-center shadow-[var(--shadow-card)] sm:px-5 sm:py-5">
      <p className="font-display text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">
        Added enough calories yet?
      </p>
      {showPig ? (
        <div className="mx-auto mt-4 w-full max-w-[280px] rounded-xl bg-white/80 p-2 ring-1 ring-stone-200/90">
          {/* eslint-disable-next-line @next/next/no-img-element -- local static asset; avoids next/image fill layout edge cases */}
          <img
            src={PIG_SRC}
            alt=""
            width={560}
            height={420}
            className="mx-auto h-auto max-h-52 w-full object-contain"
            decoding="async"
          />
        </div>
      ) : null}
      <Link
        href="/cart"
        className="mx-auto mt-4 inline-flex w-full max-w-sm items-center justify-center rounded-full bg-[var(--ember)] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[var(--ember)]/25 transition hover:bg-[var(--ember-hover)] sm:w-auto"
      >
        Yep, check me out!
      </Link>
    </div>
  );
}
