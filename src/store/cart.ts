"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "@/lib/commerce/types";

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (line, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.variantId === line.variantId);
          const lines = existing
            ? s.lines.map((l) =>
                l.variantId === line.variantId ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l,
              )
            : [...s.lines, { ...line, quantity: Math.min(MAX_QTY, quantity) }];
          return { lines, isOpen: true };
        }),
      setQuantity: (variantId, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.variantId !== variantId)
              : s.lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "rym-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      // Hydrate manually after mount to avoid SSR/client markup mismatch.
      skipHydration: true,
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.price.amount * l.quantity, 0);
