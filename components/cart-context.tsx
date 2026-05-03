"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/cart-types";
import { makeLineId } from "@/lib/cart-line-id";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  totalCents: number;
  addItem: (
    menuId: string,
    name: string,
    priceCents: number,
    toppingIds: string[],
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "firestone-pizza:cart-v4";

function normalizeLine(row: unknown): CartLine | null {
  if (typeof row !== "object" || row === null) {
    return null;
  }
  const r = row as Record<string, unknown>;
  if (
    typeof r.menuId !== "string" ||
    typeof r.name !== "string" ||
    typeof r.priceCents !== "number" ||
    typeof r.quantity !== "number"
  ) {
    return null;
  }
  let toppingIds: string[] = [];
  if (
    Array.isArray(r.toppingIds) &&
    r.toppingIds.every((x): x is string => typeof x === "string")
  ) {
    toppingIds = r.toppingIds;
  }
  const lineId =
    typeof r.lineId === "string"
      ? r.lineId
      : makeLineId(r.menuId, toppingIds);
  return {
    lineId,
    menuId: r.menuId,
    name: r.name,
    priceCents: r.priceCents,
    quantity: r.quantity,
    toppingIds,
  };
}

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
      .map(normalizeLine)
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
    ) => {
      const lineId = makeLineId(menuId, toppingIds);
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
    const itemCount = lines.reduce((acc, l) => acc + l.quantity, 0);
    const totalCents = lines.reduce(
      (acc, l) => acc + l.priceCents * l.quantity,
      0,
    );
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
