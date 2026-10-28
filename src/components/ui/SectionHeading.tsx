import { RevealText, Reveal } from "./Reveal";

export function SectionHeading({ index, eyebrow, title, intro }: { index: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="mb-12 md:mb-16">
      <Reveal className="mb-5 flex items-center gap-4">
        <span className="font-mono text-xs text-cyan">{index}</span>
        <span className="h-px w-12 bg-gradient-to-r from-cyan to-transparent" />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
        <RevealText text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-lg text-muted">{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
