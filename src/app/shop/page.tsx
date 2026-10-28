import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import { COMMERCE_ENABLED, commerce } from "@/lib/commerce";

export const metadata: Metadata = { title: "Merch", description: "Official RYM merchandise — coming soon." };

export default async function ShopPage() {
  const products = await commerce.getProducts();
  return (
    <div className="container-x pb-12 pt-32 md:pt-44">
      <header className="mb-16 max-w-3xl">
        <Reveal className="eyebrow mb-5 flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-lime shadow-[0_0_8px_var(--color-lime)]" />
          {COMMERCE_ENABLED ? "Official store" : "Merch · coming soon"}
        </Reveal>
        <h1 className="font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl md:text-8xl">
          <RevealText text="Wear the" />
          <br />
          <RevealText text="frequency." className="text-cyan" delay={0.15} />
        </h1>
        {!COMMERCE_ENABLED && (
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg text-muted">
              The first RYM drop is being printed. Here&apos;s a preview of what&apos;s coming — follow on Instagram to catch the release.
            </p>
          </Reveal>
        )}
      </header>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
