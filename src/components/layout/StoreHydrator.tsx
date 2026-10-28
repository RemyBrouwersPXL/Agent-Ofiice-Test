"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";

/** Rehydrates persisted stores after mount so server and first client render match. */
export function StoreHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
