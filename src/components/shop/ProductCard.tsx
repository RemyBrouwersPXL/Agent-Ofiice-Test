import Link from "next/link";
import { formatMoney, type Product } from "@/lib/commerce";
import { ProductMedia } from "./ProductMedia";

export function ProductCard({ product }: { product: Product }) {
  const from = Math.min(...product.variants.map((v) => v.price.amount));
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-bg-raised transition-[border-color,box-shadow] duration-500 group-hover:shadow-[0_0_60px_-16px_var(--accent)]"
        style={{ "--accent": product.accent } as React.CSSProperties}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <ProductMedia product={product} sizes="(min-width: 1024px) 25vw, 50vw" />
        </div>
        {product.status === "coming_soon" && (
          <span className="absolute left-3 top-3 rounded-full border border-lime/40 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-lime backdrop-blur">
            Coming soon
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-sm font-bold uppercase">{product.title}</h3>
        <span className="font-mono text-sm text-muted">{formatMoney({ amount: from, currency: "EUR" })}</span>
      </div>
    </Link>
  );
}
