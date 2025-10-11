"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/hooks/queries";

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  isSyncing?: boolean;
};

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
};

// ✅ Local + Backend synced Cart Store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setItems: (items) => set({ items, isHydrated: true }),

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // temporary id for new item
          const tempId = Date.now();
          return {
            items: [
              ...state.items,
              { id: tempId, product, quantity, isSyncing: true },
            ],
          };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    }
  )
);
