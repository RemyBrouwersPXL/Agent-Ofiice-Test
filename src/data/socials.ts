export type SocialKey = "spotify" | "soundcloud" | "instagram" | "tiktok" | "youtube";

export type Social = { key: SocialKey; label: string; href: string };

// TODO: replace with RYM's real profile URLs (handles not confirmed yet).
export const socials: Social[] = [
  { key: "spotify", label: "Spotify", href: "https://open.spotify.com/" },
  { key: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
];

export const socialHref = (key: SocialKey) => socials.find((s) => s.key === key)?.href ?? "#";
