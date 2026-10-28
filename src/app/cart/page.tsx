import type { Metadata } from "next";
import Link from "next/link";
import { CartLines } from "@/components/shop/CartLines";
import { CartSummary } from "@/components/shop/CartSummary";
import { COMMERCE_ENABLED } from "@/lib/commerce";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-x pb-12 pt-32 md:pt-40">
      <h1 className="mb-10 font-display text-5xl font-black uppercase md:text-7xl">Cart</h1>
      {COMMERCE_ENABLED ? (
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
          <CartLines />
          <CartSummary />
        </div>
      ) : (
        <p className="text-muted">
          The store isn&apos;t open yet.{" "}
          <Link href="/shop" className="text-cyan underline-offset-4 hover:underline">
            Preview the first drop
          </Link>
          .
        </p>
      )}
    </div>
  );
}
