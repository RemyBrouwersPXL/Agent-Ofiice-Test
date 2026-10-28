"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { socials } from "@/data/socials";
import { useUI } from "@/store/ui";
import { selectCount, useCart } from "@/store/cart";
import { COMMERCE_ENABLED } from "@/lib/commerce";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/#music", id: "music", label: "Music" },
  { href: "/#tour", id: "tour", label: "Tour" },
  { href: "/#media", id: "media", label: "Media" },
];

function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids, enabled]);
  return enabled ? active : null;
}

export function Navbar() {
  const pathname = usePathname();
  const { navOpen, setNavOpen, openBooking } = useUI();
  const cartCount = useCart(selectCount);
  const openCart = useCart((s) => s.open);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(
    links.map((l) => l.id),
    pathname === "/",
  );

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev && !navOpen);
  });

  useEffect(() => {
    document.documentElement.style.overflow = navOpen ? "hidden" : "";
  }, [navOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent",
          )}
        >
          <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Main">
            <Logo />

            <ul className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "relative font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:text-ink",
                      active === l.id ? "text-ink" : "text-muted",
                    )}
                  >
                    {l.label}
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-2 left-0 right-0 h-px bg-cyan shadow-[0_0_8px_var(--color-cyan)]"
                      />
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className={cn(
                    "flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:text-ink",
                    pathname.startsWith("/shop") ? "text-ink" : "text-muted",
                  )}
                >
                  Merch
                  <span className="rounded-full border border-lime/40 px-2 py-0.5 text-[9px] tracking-[0.15em] text-lime">
                    Soon
                  </span>
                </Link>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              {COMMERCE_ENABLED && (
                <button
                  onClick={openCart}
                  className="relative grid h-10 w-10 place-items-center rounded-full text-muted hover:text-ink"
                  aria-label={`Open cart (${cartCount} items)`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-magenta px-1 text-[10px] font-bold text-black">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              <span className="hidden sm:block">
                <Button variant="outline" className="px-5 py-2.5" onClick={() => openBooking()}>
                  Book RYM
                </Button>
              </span>
              <button
                className="grid h-10 w-10 place-items-center md:hidden"
                onClick={() => setNavOpen(!navOpen)}
                aria-expanded={navOpen}
                aria-controls="mobile-nav"
                aria-label={navOpen ? "Close menu" : "Open menu"}
              >
                {navOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {navOpen && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pb-10 pt-24 backdrop-blur-2xl md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-1 flex-col justify-center gap-2">
              {[...links, { href: "/shop", id: "shop", label: "Merch" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setNavOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-4xl font-black uppercase"
                  >
                    <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                    {l.label}
                    {l.id === "shop" && <span className="font-mono text-xs text-lime">SOON</span>}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Button pulse onClick={() => openBooking()} className="w-full">
              Request booking
            </Button>
            <div className="mt-8 flex justify-center gap-6">
              {socials.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-muted hover:text-ink">
                  <SocialIcon name={s.key} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
