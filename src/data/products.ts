import type { Product } from "@/lib/commerce/types";

const eur = (amount: number) => ({ amount, currency: "EUR" as const });

const sizes = (base: string, price: number) =>
  ["S", "M", "L", "XL"].map((s) => ({
    id: `${base}-${s.toLowerCase()}`,
    title: s,
    sku: `${base.toUpperCase()}-${s}`,
    price: eur(price),
    inStock: true,
  }));

// MOCK CATALOGUE — served by the mock provider until Supabase/CMS is connected.
export const mockProducts: Product[] = [
  {
    id: "p-tee-static",
    slug: "cold-static-tee",
    title: "Cold Static Tee",
    description: "Heavyweight black tee, cyan RYM print front, Cold Static Prayer tracklist on the back.",
    category: "apparel",
    images: [],
    variants: sizes("tee-static", 3500),
    accent: "#00f0ff",
    status: "coming_soon",
  },
  {
    id: "p-hoodie-rym",
    slug: "rym-hoodie",
    title: "RYM Logo Hoodie",
    description: "Oversized hoodie with puff-print RYM wordmark and neon magenta sleeve hit.",
    category: "apparel",
    images: [],
    variants: sizes("hoodie-rym", 6500),
    accent: "#ff2bd6",
    status: "coming_soon",
  },
  {
    id: "p-cap-hr",
    slug: "heavy-rotation-cap",
    title: "Heavy Rotation Cap",
    description: "Six-panel cap with embroidered Heavy Rotation logo.",
    category: "accessories",
    images: [],
    variants: [{ id: "cap-hr-os", title: "One size", sku: "CAP-HR-OS", price: eur(2800), inStock: true }],
    accent: "#b4ff39",
    status: "coming_soon",
  },
  {
    id: "p-slipmat",
    slug: "rym-slipmat",
    title: "RYM Slipmat",
    description: "12\" felt slipmat. For the vinyl heads.",
    category: "accessories",
    images: [],
    variants: [{ id: "slipmat-12", title: "12 inch", sku: "SLIP-12", price: eur(2000), inStock: true }],
    accent: "#8b5cf6",
    status: "coming_soon",
  },
];
