"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, ToppingPlacement } from "@/lib/cart-types";
import { makeLineId } from "@/lib/cart-line-id";
import { cartLineFromUnknown } from "@/lib/cart-line-from-unknown";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  totalCents: number;
  addItem: (
    menuId: string,
    name: string,
    priceCents: number,
    toppingIds: string[],
    placement?: ToppingPlacement,
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "firestone-pizza:cart-v5";

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map(cartLineFromUnknown)
      .filter((row): row is CartLine => row !== null);
  } catch {
    return [];
  }
}

function persist(lines: CartLine[]) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      persist(lines);
    }
  }, [lines, hydrated]);

  const addItem = useCallback(
    (
      menuId: string,
      name: string,
      priceCents: number,
      toppingIds: string[],
      placement: ToppingPlacement = "full",
    ) => {
      const lineId = makeLineId(menuId, toppingIds, placement);
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.lineId === lineId);
        if (idx === -1) {
          return [
            ...prev,
            {
              lineId,
              menuId,
              name,
              priceCents,
              quantity: 1,
              toppingIds: [...toppingIds],
              placement,
            },
          ];
        }
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + 1,
        };
        return next;
      });
    },
    [],
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    const q = Math.floor(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.lineId !== lineId));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, quantity: q } : l)),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const safeLines = Array.isArray(lines) ? lines : [];
    const itemCount = safeLines.reduce((acc, l) => {
      const q =
        typeof l.quantity === "number" && Number.isFinite(l.quantity)
          ? Math.max(0, Math.floor(l.quantity))
          : 0;
      return acc + q;
    }, 0);
    const totalCents = safeLines.reduce((acc, l) => {
      const q =
        typeof l.quantity === "number" && Number.isFinite(l.quantity)
          ? Math.max(0, Math.floor(l.quantity))
          : 0;
      const cents =
        typeof l.priceCents === "number" && Number.isFinite(l.priceCents)
          ? l.priceCents
          : 0;
      return acc + cents * q;
    }, 0);
    return {
      lines,
      itemCount,
      totalCents,
      addItem,
      setQuantity,
      removeLine,
      clearCart,
    };
  }, [lines, addItem, setQuantity, removeLine, clearCart]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
