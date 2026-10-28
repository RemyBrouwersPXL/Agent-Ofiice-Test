import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { artist } from "@/data/artist";

const chipColors = ["hover:border-magenta hover:text-magenta", "hover:border-cyan hover:text-cyan", "hover:border-lime hover:text-lime"];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading index="01" eyebrow="About" title="A decade deep. Twenty years young." />

        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Big outlined "10" as a graphic anchor */}
          <Reveal className="relative">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-bg-raised">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_43_214/0.25),transparent_50%),radial-gradient(circle_at_80%_90%,rgb(0_240_255/0.2),transparent_55%)]" />
              <div aria-hidden className="scanlines absolute inset-0" />
              <p
                aria-hidden
                className="absolute -bottom-[0.12em] -left-[0.04em] font-display text-[clamp(10rem,38vw,26rem)] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgb(255_255_255/0.18)]"
              >
                10
              </p>
              <div className="absolute left-6 top-6 right-6 flex items-start justify-between">
                <span className="eyebrow">Since age {artist.startedAtAge}</span>
                <span className="font-mono text-xs text-cyan">EST. {new Date().getFullYear() - artist.yearsActive}</span>
              </div>
              <p className="absolute bottom-6 right-6 max-w-[14rem] text-right text-sm text-muted">
                Started at {artist.startedAtAge}. Still only {artist.age}. Exactly {artist.yearsActive} years of reading rooms.
              </p>
            </div>
          </Reveal>

          <div>
            <div className="space-y-6 text-lg leading-relaxed text-ink/80 md:text-xl">
              {artist.bio.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-12">
              <p className="eyebrow mb-4">Genres</p>
              <ul className="flex flex-wrap gap-2">
                {artist.genres.map((g, i) => (
                  <li
                    key={g}
                    className={`cursor-default rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors duration-300 ${chipColors[i % 3]}`}
                  >
                    {g}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25} className="mt-10">
              <p className="eyebrow mb-4">Played at</p>
              <ul className="divide-y divide-line border-y border-line">
                {artist.venues.map((v) => (
                  <li key={v.name} className="group flex items-center justify-between py-4">
                    <span className="font-display text-lg font-bold uppercase transition-transform duration-500 group-hover:translate-x-2">
                      {v.name}
                    </span>
                    {v.city && (
                      <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted">
                        <MapPin className="h-3 w-3" />
                        {v.city}
                      </span>
                    )}
                  </li>
                ))}
                <li className="py-4 font-mono text-xs uppercase tracking-widest text-muted">+ festivals &amp; student events across Belgium</li>
              </ul>
            </Reveal>
          </div>
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {artist.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="flex flex-col-reverse bg-bg p-6 md:p-8">
              <dt className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{s.label}</dt>
              <dd className="font-display text-5xl font-black md:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
