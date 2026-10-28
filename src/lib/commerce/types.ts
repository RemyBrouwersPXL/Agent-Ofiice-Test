/**
 * Commerce domain types. These mirror the Supabase schema in /supabase/schema.sql
 * and map 1:1 onto Stripe Checkout line items, so swapping the data source
 * never touches UI components.
 */

/** Amounts are integer minor units (cents), as Stripe expects. */
export type Money = { amount: number; currency: "EUR" };

export type ProductVariant = {
  id: string;
  /** e.g. "M", "L", "Black / XL" */
  title: string;
  sku: string;
  price: Money;
  inStock: boolean;
  /** Stripe Price ID, filled in once products are synced to Stripe. */
  stripePriceId?: string | null;
};

export type ProductImage = { src: string; alt: string; width: number; height: number };

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "apparel" | "accessories" | "music";
  images: ProductImage[];
  variants: ProductVariant[];
  /** Hex accent for placeholder art and UI glow. */
  accent: string;
  status: "draft" | "coming_soon" | "active";
};

export type CartLine = {
  variantId: string;
  productId: string;
  slug: string;
  title: string;
  variantTitle: string;
  price: Money;
  image: ProductImage | null;
  quantity: number;
};

/** Anything that can serve products: the mock today, Supabase or a headless CMS later. */
export interface CommerceProvider {
  getProducts(): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
}
