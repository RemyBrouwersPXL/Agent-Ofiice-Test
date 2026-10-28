"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "@/components/ui/Lightbox";
import { gallery, type MediaItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

const filters = [
  { key: "all", label: "All" },
  { key: "image", label: "Photos" },
  { key: "video", label: "Video" },
] as const;

type Filter = (typeof filters)[number]["key"];

function Tile({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-line bg-bg-raised text-left [break-inside:avoid]"
      aria-label={`Open ${item.kind === "video" ? "video" : "photo"}: ${item.alt}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        // Lazy-loaded by default; width/height reserve space so nothing shifts.
      />
      {item.kind === "video" && item.video && (
        <video
          src={item.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {item.kind === "video" && (
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur">
          <Play className="ml-0.5 h-4 w-4" />
        </span>
      )}
      {item.caption && (
        <span className="absolute bottom-3 left-4 translate-y-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.caption}
        </span>
      )}
    </button>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => (filter === "all" ? gallery : gallery.filter((g) => g.kind === filter)), [filter]);

  return (
    <section id="media" className="relative py-28 md:py-40">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading index="04" eyebrow="Media" title="Lasers, sweat & bass." />
          <div role="tablist" aria-label="Filter media" className="glass mb-12 flex w-fit gap-1 rounded-full p-1 md:mb-16">
            {filters.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "relative rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
                  filter === f.key ? "text-black" : "text-muted hover:text-ink",
                )}
              >
                {filter === f.key && (
                  <motion.span layoutId="media-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          {items.map((item, i) => (
            <Tile key={item.id} item={item} onOpen={() => setOpen(i)} />
          ))}
        </motion.div>
      </div>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </section>
  );
}
