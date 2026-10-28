"use client";

import { useUI, type BookingPrefill } from "@/store/ui";

/** Lets server components open the booking modal without becoming client components. */
export function BookingTrigger({
  prefill,
  className,
  children,
}: {
  prefill?: BookingPrefill;
  className?: string;
  children: React.ReactNode;
}) {
  const openBooking = useUI((s) => s.openBooking);
  return (
    <button type="button" className={className} onClick={() => openBooking(prefill)}>
      {children}
    </button>
  );
}
