"use client";

import { create } from "zustand";
import type { Release } from "@/data/releases";

export type Platform = "spotify" | "soundcloud";

type PlayerState = {
  current: { release: Release; platform: Platform } | null;
  play: (release: Release, platform: Platform) => void;
  stop: () => void;
};

export const usePlayer = create<PlayerState>()((set) => ({
  current: null,
  play: (release, platform) => set({ current: { release, platform } }),
  stop: () => set({ current: null }),
}));

export function embedUrl(release: Release, platform: Platform): string | null {
  if (platform === "spotify" && release.spotify) {
    // open.spotify.com/track/<id> -> open.spotify.com/embed/track/<id>
    const u = new URL(release.spotify);
    return `https://open.spotify.com/embed${u.pathname}?utm_source=generator&theme=0`;
  }
  if (platform === "soundcloud" && release.soundcloud) {
    const params = new URLSearchParams({
      url: release.soundcloud,
      color: release.accent,
      auto_play: "true",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      visual: "false",
    });
    return `https://w.soundcloud.com/player/?${params}`;
  }
  return null;
}
