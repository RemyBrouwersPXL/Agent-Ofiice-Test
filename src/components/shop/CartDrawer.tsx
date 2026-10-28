"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { COMMERCE_ENABLED, formatMoney } from "@/lib/commerce";
import { selectSubtotal, useCart } from "@/store/cart";
import { CartLines } from "./CartLines";
import { CheckoutButton } from "./CheckoutButton";

export function CartDrawer() {
  const { isOpen, close } = useCart();
  const subtotal = useCart(selectSubtotal);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!COMMERCE_ENABLED) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-bg p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-black uppercase">Cart</h2>
              <button onClick={close} aria-label="Close cart" className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-cyan">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">
              <CartLines onNavigate={close} />
            </div>
            <div className="border-t border-line pt-5">
              <div className="mb-4 flex justify-between font-mono text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{formatMoney({ amount: subtotal, currency: "EUR" })}</span>
              </div>
              <CheckoutButton />
              <Link href="/cart" onClick={close} className="mt-3 block text-center font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
                View cart
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
