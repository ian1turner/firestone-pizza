"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-context";

const nav = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "View All Orders" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--charcoal)] shadow-[var(--shadow-float)]">
      <div className="mx-auto flex min-h-[4.25rem] max-w-5xl items-center justify-between gap-4 px-4 py-2 sm:px-6 sm:py-0">
        <Link
          href="/"
          className="font-display group flex min-w-0 flex-wrap items-baseline gap-x-2 text-left text-lg leading-tight tracking-tight transition-opacity hover:opacity-90 sm:text-xl md:text-2xl"
        >
          <span className="shrink-0">
            <span className="text-[var(--gold)] transition-colors group-hover:text-[#dcc598]">
              Firestone
            </span>
            <span className="text-[var(--cream)]"> Pizza</span>
          </span>
          <span className="font-sans text-[0.7rem] font-normal leading-snug text-stone-500 sm:text-xs md:text-sm">
            A division of Turner Enterprises
          </span>
        </Link>
        <nav
          className="flex max-w-[min(100%,42rem)] flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Main"
        >
          {nav.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3 py-2 text-sm font-semibold tracking-wide transition-colors sm:px-4 ${
                  active
                    ? "bg-[var(--ember)] text-white shadow-md shadow-black/20"
                    : "text-stone-400 hover:bg-white/5 hover:text-[var(--cream)]"
                }`}
              >
                {label}
                {href === "/cart" && itemCount > 0 ? (
                  <span
                    className="ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--cream)] px-1 text-xs font-bold text-[var(--charcoal)]"
                    aria-label={`${itemCount} items in cart`}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
