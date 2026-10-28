export type Release = {
  slug: string;
  title: string;
  type: "Single" | "EP" | "Mix";
  year: number;
  bpm: number;
  genre: string;
  /** Path under /public or a remote URL. Falls back to a generated cover when null. */
  cover: string | null;
  /** Neon accent used by the generated cover + visualizer. */
  accent: string;
  /**
   * Embed sources. Paste the share link of the track:
   *  - spotify: "https://open.spotify.com/track/<id>"
   *  - soundcloud: "https://soundcloud.com/<user>/<track>"
   * Leave null until the track is live; the card then links out to the platform profile.
   */
  spotify: string | null;
  soundcloud: string | null;
};

// TODO: fill in real Spotify/SoundCloud links, years and BPMs once confirmed by RYM.
export const releases: Release[] = [
  {
    slug: "saturday-night",
    title: "Saturday Night",
    type: "Single",
    year: 2025,
    bpm: 150,
    genre: "Hard Trance",
    cover: null,
    accent: "#ff2bd6",
    spotify: null,
    soundcloud: null,
  },
  {
    slug: "cold-static-prayer",
    title: "Cold Static Prayer",
    type: "Single",
    year: 2025,
    bpm: 145,
    genre: "Hard Techno",
    cover: null,
    accent: "#00f0ff",
    spotify: null,
    soundcloud: null,
  },
  {
    slug: "techno-heavy-rotation-vol-1",
    title: "Techno Heavy Rotation Vol. 1",
    type: "Mix",
    year: 2026,
    bpm: 140,
    genre: "Techno",
    cover: null,
    accent: "#b4ff39",
    spotify: null,
    soundcloud: null,
  },
];
