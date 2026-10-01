"use client";

import * as React from "react";
import { productBySlug, storeTotals, type StoreLine } from "@/lib/store";

type CartContext = {
  lines: StoreLine[];
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  totals: ReturnType<typeof storeTotals>;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  ready: boolean;
};

const Ctx = React.createContext<CartContext | null>(null);
const KEY = "bmu-store-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<StoreLine[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  // Restore after mount, never during render — otherwise the server HTML and
  // the first client render disagree and React throws a hydration error.
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setLines(JSON.parse(saved));
    } catch {
      /* corrupted or unavailable storage — start empty */
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* private mode or quota — the cart just won't survive a reload */
    }
  }, [lines, ready]);

  const add = React.useCallback((slug: string, quantity = 1) => {
    const product = productBySlug(slug);
    if (!product) return;

    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        return prev.map((l) => (l.slug === slug ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { slug, name: product.name, price: product.price, quantity }];
    });
    setOpen(true);
  }, []);

  const setQuantity = React.useCallback((slug: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, quantity } : l))
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const value = React.useMemo(
    () => ({ lines, add, setQuantity, clear, totals: storeTotals(lines), isOpen, setOpen, ready }),
    [lines, add, setQuantity, clear, isOpen, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
