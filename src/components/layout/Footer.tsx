import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { BookingTrigger } from "@/components/booking/BookingTrigger";
import { socials } from "@/data/socials";
import { artist } from "@/data/artist";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="eyebrow mb-4">Bookings &amp; press</p>
          <BookingTrigger className="group flex items-center gap-3 text-left font-display text-3xl font-black uppercase leading-none sm:text-5xl">
            Let&apos;s talk
            <ArrowUpRight className="h-8 w-8 text-cyan transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-12 sm:w-12" />
          </BookingTrigger>
          <a href={`mailto:${artist.bookingEmail}`} className="mt-4 inline-block font-mono text-sm text-muted hover:text-ink">
            {artist.bookingEmail}
          </a>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-muted">
            {[
              ["About", "/#about"],
              ["Music", "/#music"],
              ["Tour", "/#tour"],
              ["Media", "/#media"],
              ["Merch (coming soon)", "/shop"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Follow</p>
          <ul className="grid grid-cols-2 gap-3">
            {socials.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-muted transition-colors hover:border-cyan/50 hover:text-ink"
                >
                  <SocialIcon name={s.key} className="h-4 w-4" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="translate-y-[18%] text-center font-display text-[34vw] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.08)]">
          {artist.name}
        </p>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} {artist.displayName}</span>
          <span>Belgium · Hard Techno · Hard Trance</span>
        </div>
      </div>
    </footer>
  );
}
