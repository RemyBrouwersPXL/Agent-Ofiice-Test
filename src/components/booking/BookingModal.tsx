"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUI } from "@/store/ui";
import { artist } from "@/data/artist";
import { BookingForm } from "./BookingForm";

export function BookingModal() {
  const { booking, closeBooking } = useUI();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!booking.open) return;
    const prev = document.activeElement as HTMLElement | null;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      prev?.focus();
    };
  }, [booking.open, closeBooking]);

  return (
    <AnimatePresence>
      {booking.open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeBooking} />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-line bg-bg px-6 pb-6 pt-6 outline-none sm:px-10 sm:pt-10"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-magenta/15 blur-3xl" />
            <div className="relative mb-8 flex items-start justify-between">
              <div>
                <p className="eyebrow mb-2">Booking request</p>
                <h2 id="booking-title" className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">
                  Book {artist.name}
                </h2>
              </div>
              <button onClick={closeBooking} aria-label="Close booking form" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-cyan hover:text-cyan">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <BookingForm prefill={booking.prefill} onDone={closeBooking} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
