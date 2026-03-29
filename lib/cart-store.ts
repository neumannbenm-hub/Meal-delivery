"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Meal, ServingSize } from "@/types";
import { getPriceByServing } from "@/lib/utils";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (meal: Meal, servingSize: ServingSize) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function makeItemId(mealId: string, servingSize: ServingSize): string {
  return `${mealId}-${servingSize}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (meal, servingSize) => {
        const id = makeItemId(meal.id, servingSize);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true,
          }));
        } else {
          set((state) => ({
            items: [...state.items, { id, meal, servingSize, quantity: 1 }],
            isOpen: true,
          }));
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () =>
        get().items.reduce((total, item) => {
          const price = getPriceByServing(item.meal.pricing, item.servingSize);
          return total + price * item.quantity;
        }, 0),

      getItemCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: "meal-delivery-cart" }
  )
);
