import { MenuCaloriesCard } from "@/components/menu-calories-card";
import { MenuClient } from "./menu-client";

export const metadata = {
  title: "Toppings — Firestone Pizza",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-14 sm:px-6 sm:pt-16">
      <div className="max-w-2xl border-l-4 border-[var(--ember)] pl-5 sm:pl-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          Toppings
        </h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--muted)]">
          Tap left, whole, or right for each topping to build your cart — tap the
          same choice again on a row to remove that topping from your cart.
        </p>
      </div>

      <MenuCaloriesCard />

      <MenuClient />
    </div>
  );
}
