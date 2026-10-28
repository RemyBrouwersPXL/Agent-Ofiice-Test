export type MediaItem = {
  id: string;
  kind: "image" | "video";
  /** Image, or the poster frame for a video. */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** MP4/WebM for kind "video". Keep clips short (<10s), muted, ~1080p, H.264. */
  video?: string | null;
  caption?: string;
};

// PLACEHOLDER MEDIA — generated laser art. Replace with real gig photos
// (export at 2000px long edge, JPG/WebP) and keep width/height accurate to avoid layout shift.
export const gallery: MediaItem[] = [
  { id: "m1", kind: "image", src: "/media/gig-01.svg", width: 1200, height: 1600, alt: "RYM on the decks at Club Havana", caption: "Club Havana — Mol" },
  { id: "m2", kind: "video", src: "/media/gig-02.svg", width: 1600, height: 1067, alt: "Crowd under the lasers", video: null, caption: "Peak time clip" },
  { id: "m3", kind: "image", src: "/media/gig-03.svg", width: 1200, height: 1200, alt: "Laser show over the dancefloor", caption: "Huis de Rand — Leuven" },
  { id: "m4", kind: "image", src: "/media/gig-04.svg", width: 1200, height: 1800, alt: "Hands up during the drop" },
  { id: "m5", kind: "image", src: "/media/gig-05.svg", width: 1600, height: 900, alt: "Festival techno stage", caption: "Festival season" },
  { id: "m6", kind: "image", src: "/media/gig-06.svg", width: 1200, height: 1500, alt: "RYM mixing close-up" },
  { id: "m7", kind: "video", src: "/media/gig-07.svg", width: 1600, height: 1067, alt: "Strobe sequence", video: null, caption: "Hard trance closer" },
  { id: "m8", kind: "image", src: "/media/gig-08.svg", width: 1200, height: 1600, alt: "Cafe De Delirium late session", caption: "Cafe De Delirium — Gent" },
  { id: "m9", kind: "image", src: "/media/gig-09.svg", width: 1600, height: 1200, alt: "Student event crowd" },
  { id: "m10", kind: "image", src: "/media/gig-10.svg", width: 1200, height: 1200, alt: "Booth view" },
  { id: "m11", kind: "image", src: "/media/gig-11.svg", width: 1200, height: 1700, alt: "Smoke and green lasers", caption: "Jeugdhuis De Mans" },
  { id: "m12", kind: "image", src: "/media/gig-12.svg", width: 1600, height: 1000, alt: "Wide shot of the room" },
];
