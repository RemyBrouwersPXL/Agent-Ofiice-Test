"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/commerce";
import { useCart } from "@/store/cart";

/** Shared by the cart drawer and the /cart page. */
export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, setQuantity, remove } = useCart();

  if (!lines.length) return <p className="py-16 text-center text-muted">Your cart is empty.</p>;

  return (
    <ul className="divide-y divide-line">
      {lines.map((l) => (
        <li key={l.variantId} className="flex items-center gap-4 py-5">
          <div className="grid h-20 w-16 shrink-0 place-items-center rounded-lg border border-line bg-bg-raised font-display text-xs font-black">RYM</div>
          <div className="min-w-0 flex-1">
            <Link href={`/shop/${l.slug}`} onClick={onNavigate} className="block truncate font-display text-sm font-bold uppercase hover:text-cyan">
              {l.title}
            </Link>
            <p className="font-mono text-xs text-muted">{l.variantTitle}</p>
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => setQuantity(l.variantId, l.quantity - 1)} aria-label="Decrease quantity" className="grid h-7 w-7 place-items-center rounded-full border border-line hover:border-cyan">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center font-mono text-sm tabular-nums">{l.quantity}</span>
              <button onClick={() => setQuantity(l.variantId, l.quantity + 1)} aria-label="Increase quantity" className="grid h-7 w-7 place-items-center rounded-full border border-line hover:border-cyan">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-mono text-sm">{formatMoney({ amount: l.price.amount * l.quantity, currency: l.price.currency })}</span>
            <button onClick={() => remove(l.variantId)} aria-label={`Remove ${l.title}`} className="text-muted hover:text-magenta">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
