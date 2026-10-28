"use client";

import { create } from "zustand";

export type BookingPrefill = { date?: string; city?: string; venue?: string; eventType?: string };

type UIState = {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  booking: { open: boolean; prefill: BookingPrefill };
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
};

export const useUI = create<UIState>()((set) => ({
  navOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
  booking: { open: false, prefill: {} },
  openBooking: (prefill = {}) => set({ booking: { open: true, prefill }, navOpen: false }),
  closeBooking: () => set((s) => ({ booking: { ...s.booking, open: false } })),
}));
