import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BookingTrigger } from "@/components/booking/BookingTrigger";
import { events, splitEvents, type GigEvent } from "@/data/events";
import { cn, formatEventDate } from "@/lib/utils";

const kindColor: Record<GigEvent["kind"], string> = {
  Club: "text-magenta border-magenta/30",
  Festival: "text-lime border-lime/30",
  Student: "text-cyan border-cyan/30",
  Bar: "text-violet border-violet/30",
};

function EventRow({ event, past }: { event: GigEvent; past?: boolean }) {
  const d = formatEventDate(event.date);
  return (
    <li
      className={cn(
        "group relative grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-3 border-b border-line py-6 sm:grid-cols-[6rem_1fr_auto] md:gap-x-10",
        past && "opacity-60 hover:opacity-100",
      )}
    >
      {/* Hover sweep — transform only */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.04] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <time dateTime={event.date} className="relative font-mono leading-none">
        <span className="block font-display text-4xl font-black md:text-5xl">{d.day}</span>
        <span className="mt-1 block text-[11px] tracking-[0.2em] text-muted">
          {d.month} {d.year}
        </span>
      </time>
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-lg font-bold uppercase leading-tight transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
            {event.name}
          </h3>
          <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]", kindColor[event.kind])}>
            {event.kind}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {d.weekday} · {event.venue} · {event.city}
        </p>
      </div>
      {!past && (
        <div className="relative col-span-2 sm:col-span-1 sm:justify-self-end">
          {event.soldOut ? (
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-magenta line-through decoration-2">Sold out</span>
          ) : event.ticketUrl ? (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-cyan hover:text-cyan"
            >
              Tickets <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Tickets soon</span>
          )}
        </div>
      )}
    </li>
  );
}

export function Tour() {
  const { upcoming, past } = splitEvents(events);
  return (
    <section id="tour" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading index="03" eyebrow="Tour & Gigs" title="Where to catch RYM." />

        <div className="mb-6 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-lime" /> Upcoming
          </p>
          <p className="font-mono text-xs text-muted">{upcoming.length} dates</p>
        </div>
        <Reveal>
          {upcoming.length > 0 ? (
            <ul className="border-t border-line">
              {upcoming.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </ul>
          ) : (
            <p className="border-y border-line py-10 text-center text-muted">New dates dropping soon. Want RYM at your event?</p>
          )}
        </Reveal>

        {past.length > 0 && (
          <details className="group/past mt-10">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
              <ChevronDown className="h-4 w-4 transition-transform group-open/past:rotate-180" />
              Past gigs ({past.length})
            </summary>
            <ul className="mt-4 border-t border-line">
              {past.map((e) => (
                <EventRow key={e.id} event={e} past />
              ))}
            </ul>
          </details>
        )}

        <Reveal className="relative mt-20 overflow-hidden rounded-3xl border border-line bg-bg-raised p-8 md:p-14">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-magenta/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan/15 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow mb-3">Clubs · Festivals · Student events · Private</p>
              <h3 className="font-display text-3xl font-black uppercase leading-none md:text-5xl">Bring RYM to your floor.</h3>
            </div>
            <BookingTrigger className="group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-ink px-8 py-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-black transition-[background-color,box-shadow] duration-300 hover:bg-cyan hover:shadow-[0_0_40px_-4px_var(--color-cyan)]">
              <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full border border-cyan" />
              Request booking
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </BookingTrigger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
