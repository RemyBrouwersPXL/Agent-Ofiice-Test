"use client";

import { motion } from "framer-motion";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { socials } from "@/data/socials";

/** Sticky vertical social rail — desktop only. */
export function SocialBar() {
  return (
    <motion.aside
      aria-label="Social links"
      className="fixed bottom-0 left-6 z-30 hidden flex-col items-center gap-5 lg:flex xl:left-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {socials.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="group relative grid h-9 w-9 place-items-center text-muted transition-colors hover:text-cyan"
        >
          <SocialIcon name={s.key} className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-cyan opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
        </a>
      ))}
      <span className="h-24 w-px bg-gradient-to-b from-muted/60 to-transparent" />
    </motion.aside>
  );
}
