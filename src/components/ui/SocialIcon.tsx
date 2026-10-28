import { FaInstagram, FaSoundcloud, FaSpotify, FaTiktok, FaYoutube } from "react-icons/fa6";
import type { SocialKey } from "@/data/socials";

const icons = {
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
} satisfies Record<SocialKey, unknown>;

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden />;
}
