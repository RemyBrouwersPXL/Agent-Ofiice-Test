import Image from "next/image";
import type { Product } from "@/lib/commerce/types";
import { ARTIST_NAME } from "@/data/artist";

/** Product image, or a branded placeholder until photography exists. */
export function ProductMedia({ product, sizes, priority }: { product: Product; sizes: string; priority?: boolean }) {
  const img = product.images[0];
  if (img) {
    return <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 40%, ${product.accent}33, transparent 60%)` }}>
      <div aria-hidden className="scanlines absolute inset-0" />
      <span className="font-display text-7xl font-black tracking-tighter" style={{ color: product.accent, textShadow: `0 0 40px ${product.accent}` }}>
        {ARTIST_NAME}
      </span>
      <span className="absolute bottom-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">{product.category}</span>
    </div>
  );
}
