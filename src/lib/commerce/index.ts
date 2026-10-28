import { mockProducts } from "@/data/products";
import type { CommerceProvider, Money } from "./types";

export * from "./types";

/** Flip NEXT_PUBLIC_COMMERCE_ENABLED=true when Stripe is wired up. */
export const COMMERCE_ENABLED = process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";

const mockProvider: CommerceProvider = {
  async getProducts() {
    return mockProducts;
  },
  async getProduct(slug) {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  },
};

/**
 * Phase 2: implement `supabaseProvider` (or a CMS provider) against the same
 * interface and return it here. Pages and components only ever call `commerce`.
 */
export const commerce: CommerceProvider = mockProvider;

export function formatMoney({ amount, currency }: Money) {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency }).format(amount / 100);
}
