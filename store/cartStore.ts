import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItem } from "@/types";
import { getDisplayPrice } from "@/lib/utils";

interface CartStore {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, metal: string) => void;
  updateQuantity: (productId: string, metal: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product === newItem.product && item.metal === newItem.metal
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product === newItem.product && item.metal === newItem.metal
                  ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stock) }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId, metal) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product === productId && item.metal === metal)
          ),
        }));
      },

      updateQuantity: (productId, metal, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product === productId && item.metal === metal
              ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          const price = getDisplayPrice(item.price, item.salePrice);
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
