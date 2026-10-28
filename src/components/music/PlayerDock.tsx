"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { embedUrl, usePlayer } from "@/store/player";

/**
 * Persistent mini-player. Lives in the root layout, so the iframe (and the
 * audio) survives scrolling and route changes. Fixed height = no layout shift.
 */
export function PlayerDock() {
  const { current, stop } = usePlayer();
  const src = current ? embedUrl(current.release, current.platform) : null;

  return (
    <AnimatePresence>
      {current && src && (
        <motion.div
          key={`${current.release.slug}-${current.platform}`}
          role="region"
          aria-label="Now playing"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl overflow-hidden rounded-2xl border border-line bg-bg-raised/90 shadow-[0_20px_80px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl sm:inset-x-6"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between px-4 pt-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              Now playing · <span style={{ color: current.release.accent }}>{current.release.title}</span>
            </p>
            <button onClick={stop} aria-label="Close player" className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <iframe
            title={`${current.release.title} player`}
            src={src}
            className="block h-[152px] w-full"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
