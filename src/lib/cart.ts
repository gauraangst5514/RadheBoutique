"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategorySlug } from "@/config/store";

export interface CartItem {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantName: string;
  category: CategorySlug;
  unitPrice: number; // display only; the server re-prices every order
  image?: string | null;
  qty: number;
  maxQty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.variantId === item.variantId ? { ...i, ...item, qty: Math.min(item.maxQty, i.qty + qty) } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, qty: Math.min(item.maxQty, qty) }] };
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.variantId === variantId ? { ...i, qty: Math.max(0, Math.min(i.maxQty, qty)) } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "rb-cart-v1" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0);
}
