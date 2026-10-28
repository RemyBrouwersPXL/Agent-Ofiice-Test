# DJ RYM — official website

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion · React Three Fiber · Zustand · Supabase-ready.

```bash
npm install
cp .env.example .env.local   # optional — the site runs without any env vars
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Structure

```
src/
  app/
    page.tsx                 Home: Hero → About → Music → Tour → Media
    template.tsx             Route transition
    shop/  shop/[slug]/  cart/   Phase 2 webshop routes (live, "coming soon" mode)
    api/booking/route.ts     Booking form endpoint (→ Supabase `booking_requests`)
    api/checkout/route.ts    Stripe Checkout stub (instructions inline)
  components/
    hero/                    Hero + HeroScene (Three.js shaders, 145 BPM clock)
    sections/                About, Music, Tour, Gallery
    music/                   ReleaseCard, Visualizer (canvas), PlayerDock, GeneratedCover
    booking/                 BookingModal, BookingForm (3-step smart form), BookingTrigger
    shop/                    ProductCard, AddToCart, CartDrawer, CartLines, CheckoutButton
    layout/                  Navbar, SocialBar (sticky, desktop), Footer
    ui/                      Button, Reveal/RevealText, Counter, Lightbox, SectionHeading
  data/                      ← all client content lives here (artist, releases, events, gallery, socials, products)
  lib/commerce/              Commerce types + provider interface (mock today)
  lib/booking.ts             Shared client/server validation
  store/                     Zustand: cart (persisted), ui (booking modal/nav), player
supabase/schema.sql          Tables + RLS for bookings, events, releases, products, orders
```

## Content still to fill in (marked `TODO` / `PLACEHOLDER` in code)

| What | Where |
| --- | --- |
| Spotify / SoundCloud track links | `src/data/releases.ts` — paste share URLs; play buttons + player dock activate automatically |
| Social profile URLs | `src/data/socials.ts` |
| Booking email | `src/data/artist.ts` |
| Real gig dates | `src/data/events.ts` (venues are real, dates are illustrative) |
| Gig photos / video clips | `public/media/` + `src/data/gallery.ts` (keep `width`/`height` accurate) |
| Release cover art | set `cover` in `releases.ts` (falls back to generated art) |

## Phase 2 — webshop

Everything the UI needs already exists; going live is configuration, not restructuring:

1. Run `supabase/schema.sql`, add env vars from `.env.example`.
2. Implement a `supabaseProvider` against `CommerceProvider` in `src/lib/commerce/index.ts` and export it as `commerce`.
3. `npm i stripe`, fill in `/api/checkout` (code sketch in the file), add a `/api/webhooks/stripe` route writing to `orders`.
4. Set `NEXT_PUBLIC_COMMERCE_ENABLED=true` → cart icon, cart drawer and add-to-cart switch on.

## Performance notes

- The WebGL hero is lazy-loaded client-side, DPR-capped at 1.75, and its render loop stops when the hero leaves the viewport. Users with `prefers-reduced-motion` or no WebGL get a static gradient.
- All motion is transform/opacity; images have explicit dimensions. Measured in headless Edge: 60 fps with the scene running, CLS 0.
- Release visualizers only run their `requestAnimationFrame` loop while hovered or playing. Streaming embeds are cross-origin, so bars are BPM-driven, not true audio analysis.
