import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { ReleaseCard } from "@/components/music/ReleaseCard";
import { releases } from "@/data/releases";
import { socialHref } from "@/data/socials";

export function Music() {
  return (
    <section id="music" className="relative py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-magenta/50 to-transparent" />
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading index="02" eyebrow="Music & Releases" title="Heavy rotation." intro="Original productions and mixes. Hover a cover to feel the tempo, hit play to stream." />
          <Reveal className="mb-12 flex gap-3 md:mb-16">
            <ButtonLink href={socialHref("spotify")} external variant="outline">
              <SocialIcon name="spotify" className="h-4 w-4" /> Spotify
            </ButtonLink>
            <ButtonLink href={socialHref("soundcloud")} external variant="outline">
              <SocialIcon name="soundcloud" className="h-4 w-4" /> SoundCloud
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.1}>
              <ReleaseCard release={r} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
