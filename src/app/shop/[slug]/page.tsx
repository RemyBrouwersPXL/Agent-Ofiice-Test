import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AddToCart } from "@/components/shop/AddToCart";
import { ProductMedia } from "@/components/shop/ProductMedia";
import { commerce } from "@/lib/commerce";

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  return product ? { title: product.title, description: product.description } : {};
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();

  return (
    <div className="container-x pb-12 pt-28 md:pt-36">
      <Link href="/shop" className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All merch
      </Link>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-bg-raised">
          <ProductMedia product={product} sizes="(min-width: 1024px) 50vw, 100vw" priority />
        </div>
        <div className="lg:pt-10">
          {product.status === "coming_soon" && <p className="eyebrow mb-4 text-lime">Coming soon</p>}
          <h1 className="font-display text-4xl font-black uppercase leading-none md:text-6xl">{product.title}</h1>
          <p className="mt-6 max-w-md text-lg text-muted">{product.description}</p>
          <div className="mt-10">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
