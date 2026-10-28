"use client";

import { formatMoney } from "@/lib/commerce";
import { selectSubtotal, useCart } from "@/store/cart";
import { CheckoutButton } from "./CheckoutButton";

export function CartSummary() {
  const subtotal = useCart(selectSubtotal);
  return (
    <aside className="h-fit rounded-2xl border border-line bg-bg-raised p-6">
      <div className="mb-2 flex justify-between font-mono text-sm">
        <span className="text-muted">Subtotal</span>
        <span>{formatMoney({ amount: subtotal, currency: "EUR" })}</span>
      </div>
      <p className="mb-6 text-xs text-muted">Shipping and VAT calculated at checkout.</p>
      <CheckoutButton />
    </aside>
  );
}
