"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Headphones } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { artist } from "@/data/artist";
import { useUI } from "@/store/ui";

// WebGL is client-only; the static gradient below is the SSR / no-WebGL / reduced-motion fallback.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const openBooking = useUI((s) => s.openBooking);
  const [canRender3D, setCanRender3D] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    setCanRender3D(!reduce && hasWebGL());
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  // Plateau at 1 so the title is fully opaque at rest, then fades as you scroll away.
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-label={`${artist.name} — intro`}>
      {/* Fallback / backdrop: always painted so there's no flash before WebGL boots */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgb(255_43_214/0.22),transparent_55%),radial-gradient(ellipse_at_50%_100%,rgb(0_240_255/0.18),transparent_60%)]" />

      {canRender3D && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{ scale: sceneScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneReady ? 1 : 0 }}
          transition={{ duration: 1.6 }}
        >
          <HeroScene active={inView} onReady={() => setSceneReady(true)} />
        </motion.div>
      )}

      {/* Legibility vignette + scanlines */}
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(5_5_10/0.85)_100%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-x pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-center"
      >
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3 !tracking-[0.18em] sm:!tracking-[0.3em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
        >
          <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-lime shadow-[0_0_8px_var(--color-lime)]" />
          {artist.origin} · {artist.yearsActive} years on the decks
        </motion.p>

        <h1 className="relative select-none font-display font-black uppercase leading-[0.8] tracking-[-0.04em] text-[clamp(7rem,30vw,24rem)]">
          <span className="sr-only">{artist.displayName}</span>
          <span aria-hidden className="relative block">
            {/* Chromatic split layers */}
            <span className="absolute inset-0 animate-glitch-a text-cyan mix-blend-screen">{artist.name}</span>
            <span className="absolute inset-0 animate-glitch-b text-magenta mix-blend-screen">{artist.name}</span>
            <span className="relative flex justify-center">
              {artist.name.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block text-ink"
                  initial={reduce ? false : { y: "40%", opacity: 0, filter: "blur(12px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 1.1, ease }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-md font-mono text-xs uppercase tracking-[0.35em] text-muted sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          {artist.tagline}
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease }}
        >
          <ButtonLink href="#music" pulse>
            <Headphones className="h-4 w-4" />
            Listen now
          </ButtonLink>
          <Button variant="outline" onClick={() => openBooking()}>
            Bookings
          </Button>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 text-muted hover:text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2 }, y: { repeat: Infinity, duration: 60 / 145 * 4, ease: "easeInOut" } }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>

      <GenreMarquee />
    </section>
  );
}

function GenreMarquee() {
  const items = [...artist.genres, ...artist.genres];
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-y border-line bg-bg/60 py-3 backdrop-blur-md">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {items.map((g, i) => (
          <span key={i} className="flex items-center gap-10">
            {g}
            <span className={i % 2 ? "text-magenta" : "text-cyan"}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
