"use client";

import Image from "next/image";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { socialHref } from "@/data/socials";
import type { Release } from "@/data/releases";
import { usePlayer, type Platform } from "@/store/player";
import { cn } from "@/lib/utils";
import { GeneratedCover } from "./GeneratedCover";
import { Visualizer } from "./Visualizer";

export function ReleaseCard({ release, priority }: { release: Release; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const { current, play, stop } = usePlayer();
  const isPlaying = current?.release.slug === release.slug;
  const defaultPlatform: Platform | null = release.spotify ? "spotify" : release.soundcloud ? "soundcloud" : null;

  const toggle = () => {
    if (isPlaying) stop();
    else if (defaultPlatform) play(release, defaultPlatform);
  };

  return (
    <article
      className="group relative"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      style={{ "--accent": release.accent } as React.CSSProperties}
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl border border-line bg-bg-raised transition-[box-shadow,border-color] duration-500",
          "group-hover:border-[var(--accent)]/50 group-hover:shadow-[0_0_60px_-12px_var(--accent)]",
          isPlaying && "border-[var(--accent)]/60 shadow-[0_0_60px_-12px_var(--accent)]",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          {release.cover ? (
            <Image
              src={release.cover}
              alt={`${release.title} cover art`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <GeneratedCover release={release} />
          )}
        </div>

        {/* Darken + visualizer on hover / while playing */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            isPlaying && "opacity-100",
          )}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2">
          <Visualizer active={hover || isPlaying} bpm={release.bpm} color={release.accent} />
        </div>

        {defaultPlatform ? (
          <button
            onClick={toggle}
            aria-label={isPlaying ? `Stop ${release.title}` : `Play ${release.title}`}
            className={cn(
              "absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-black",
              "scale-75 opacity-0 transition-[transform,opacity] duration-300 group-hover:scale-100 group-hover:opacity-100 focus-visible:scale-100 focus-visible:opacity-100",
              isPlaying && "scale-100 opacity-100",
            )}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
          </button>
        ) : (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Out soon
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
            {release.type} · {release.year} · {release.genre}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight">{release.title}</h3>
        </div>
        <div className="flex shrink-0 gap-1">
          {(["spotify", "soundcloud"] as const).map((p) =>
            release[p] ? (
              <button
                key={p}
                onClick={() => play(release, p)}
                aria-label={`Play ${release.title} on ${p}`}
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <SocialIcon name={p} className="h-4 w-4" />
              </button>
            ) : (
              <a
                key={p}
                href={socialHref(p)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`RYM on ${p}`}
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <SocialIcon name={p} className="h-4 w-4" />
              </a>
            ),
          )}
        </div>
      </div>
    </article>
  );
}
