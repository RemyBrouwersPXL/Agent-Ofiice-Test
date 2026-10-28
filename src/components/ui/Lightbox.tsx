"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "@/data/gallery";

const subscribeNoop = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

type Props = { items: MediaItem[]; index: number | null; onChange: (index: number | null) => void };

export function Lightbox({ items, index, onChange }: Props) {
  const isClient = useIsClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  // Focus + scroll lock: only on open/close.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
      prevFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onChange]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
        >
          <div className="absolute left-5 top-5 font-mono text-xs tracking-[0.2em] text-muted">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
          <button
            ref={closeRef}
            onClick={() => onChange(null)}
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-line text-ink hover:border-cyan hover:text-cyan"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => (e.stopPropagation(), go(-1))}
            className="absolute left-4 z-10 hidden h-12 w-12 place-items-center rounded-full border border-line hover:border-cyan hover:text-cyan sm:grid"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => (e.stopPropagation(), go(1))}
            className="absolute right-4 z-10 hidden h-12 w-12 place-items-center rounded-full border border-line hover:border-cyan hover:text-cyan sm:grid"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={item.id}
              className="relative flex max-h-[85vh] w-[min(92vw,1400px)] cursor-grab flex-col items-center active:cursor-grabbing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={onDragEnd}
              onClick={(e) => e.stopPropagation()}
            >
              {item.kind === "video" && item.video ? (
                <video
                  src={item.video}
                  poster={item.src}
                  className="max-h-[78vh] w-auto rounded-lg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <div className="relative">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="92vw"
                    quality={90}
                    draggable={false}
                    className="max-h-[78vh] w-auto rounded-lg object-contain"
                  />
                  {item.kind === "video" && (
                    <span className="absolute inset-x-0 bottom-4 text-center font-mono text-xs uppercase tracking-[0.25em] text-muted">
                      Clip coming soon
                    </span>
                  )}
                </div>
              )}
              {item.caption && (
                <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">{item.caption}</figcaption>
              )}
            </motion.figure>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
