"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMMERCE_ENABLED, formatMoney, type Product } from "@/lib/commerce";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const add = useCart((s) => s.add);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const purchasable = COMMERCE_ENABLED && product.status === "active" && variant?.inStock;

  return (
    <div>
      <p className="font-mono text-2xl">{variant && formatMoney(variant.price)}</p>

      {product.variants.length > 1 && (
        <fieldset className="mt-8">
          <legend className="eyebrow mb-3">Size</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={v.id === variantId}
                disabled={!v.inStock}
                onClick={() => setVariantId(v.id)}
                className={cn(
                  "h-12 min-w-12 rounded-xl border px-4 font-mono text-sm transition-colors disabled:opacity-30",
                  v.id === variantId ? "border-cyan text-cyan" : "border-line text-muted hover:text-ink",
                )}
              >
                {v.title}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-8">
        {purchasable && variant ? (
          <Button
            className="w-full"
            onClick={() =>
              add({
                variantId: variant.id,
                productId: product.id,
                slug: product.slug,
                title: product.title,
                variantTitle: variant.title,
                price: variant.price,
                image: product.images[0] ?? null,
              })
            }
          >
            Add to cart
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            <Bell className="h-4 w-4" /> Dropping soon
          </Button>
        )}
      </div>
    </div>
  );
}
