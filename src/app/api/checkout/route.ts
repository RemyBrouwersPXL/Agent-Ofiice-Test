import { NextResponse } from "next/server";
import { COMMERCE_ENABLED, commerce } from "@/lib/commerce";

type CheckoutBody = { lines?: { variantId: string; quantity: number }[] };

/**
 * Phase 2 — Stripe Checkout.
 *
 * Prices are always resolved server-side from the catalogue; the client only
 * sends variant IDs + quantities. To go live:
 *   1. npm i stripe
 *   2. Fill `stripePriceId` on each variant (Supabase `product_variants.stripe_price_id`).
 *   3. Replace the 501 below with:
 *        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *        const session = await stripe.checkout.sessions.create({
 *          mode: "payment",
 *          line_items: items.map((i) => ({ price: i.variant.stripePriceId!, quantity: i.quantity })),
 *          shipping_address_collection: { allowed_countries: ["BE", "NL", "FR", "DE", "LU"] },
 *          success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart?status=success`,
 *          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
 *        });
 *        return NextResponse.json({ url: session.url });
 *   4. Add /api/webhooks/stripe to write paid orders into Supabase `orders`.
 */
export async function POST(req: Request) {
  if (!COMMERCE_ENABLED) {
    return NextResponse.json({ error: "The store opens soon." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as CheckoutBody;
  const products = await commerce.getProducts();
  const variants = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, v] as const)));

  const items = (body.lines ?? [])
    .filter((l) => variants.has(l.variantId) && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 10)
    .map((l) => ({ variant: variants.get(l.variantId)!, quantity: l.quantity }));

  if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  return NextResponse.json({ error: "Checkout is not connected yet." }, { status: 501 });
}
