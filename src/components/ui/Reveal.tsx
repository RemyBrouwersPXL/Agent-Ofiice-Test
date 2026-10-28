"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Scroll-triggered fade/slide. Animates opacity + transform only to stay at 60fps with no layout shift. */
export function Reveal({ delay = 0, y = 32, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const word = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const } }),
};

/**
 * Splits a heading into words that rise in from a mask, staggered. The
 * in-view trigger sits on the wrapper: the words themselves start clipped by
 * their mask, so observing them directly would never fire reliably.
 */
export function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ delayChildren: delay }}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span className="inline-block" variants={word} custom={i + delay / 0.06}>
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
