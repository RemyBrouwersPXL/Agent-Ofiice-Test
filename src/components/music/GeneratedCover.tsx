import type { Release } from "@/data/releases";

/** Deterministic placeholder artwork until real covers are supplied. Pure SVG, scales without layout shift. */
export function GeneratedCover({ release }: { release: Release }) {
  const { accent, title, bpm, slug } = release;
  const seed = [...slug].reduce((n, c) => n + c.charCodeAt(0), 0);
  const rings = 9 + (seed % 5);
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label={`${title} cover art`}>
      <defs>
        <radialGradient id={`g-${slug}`} cx="50%" cy="45%" r="65%">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="0.5" stopColor={accent} stopOpacity="0.08" />
          <stop offset="1" stopColor="#05050a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#08080f" />
      <rect width="400" height="400" fill={`url(#g-${slug})`} />
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="180"
          r={18 + i * (14 + (seed % 7))}
          fill="none"
          stroke={accent}
          strokeOpacity={0.6 - i * 0.05}
          strokeWidth={i % 3 === 0 ? 2 : 0.75}
          strokeDasharray={i % 2 ? `${2 + (seed % 4)} ${4 + i}` : undefined}
        />
      ))}
      <text x="24" y="360" fill="#f4f4f8" fontFamily="var(--font-unbounded)" fontWeight="900" fontSize="40" letterSpacing="-1">
        RYM
      </text>
      <text x="24" y="382" fill={accent} fontFamily="var(--font-jetbrains)" fontSize="11" letterSpacing="3">
        {title.toUpperCase().slice(0, 30)}
      </text>
      <text x="376" y="382" textAnchor="end" fill="#8a8a9e" fontFamily="var(--font-jetbrains)" fontSize="11" letterSpacing="2">
        {bpm} BPM
      </text>
    </svg>
  );
}
