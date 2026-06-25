import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IWishlistItem } from "@/types";

interface WishlistStore {
  items: IWishlistItem[];
  addItem: (item: IWishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const exists = state.items.some((item) => item.product === newItem.product);

          if (exists) {
            return state;
          }

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product !== productId),
        }));
      },

      isInWishlist: (productId) => {
        const items = get().items;
        return items.some((item) => item.product === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
