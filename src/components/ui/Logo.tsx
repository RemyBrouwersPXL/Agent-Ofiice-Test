import Link from "next/link";
import { ARTIST_NAME } from "@/data/artist";

export function Logo() {
  return (
    <Link href="/" aria-label={`${ARTIST_NAME} — home`} className="group flex items-center gap-2">
      <span className="relative font-display text-xl font-black tracking-tight">
        {ARTIST_NAME}
        <span className="absolute -right-2.5 top-0.5 h-1.5 w-1.5 rounded-full bg-magenta shadow-[0_0_10px_var(--color-magenta)] transition-colors group-hover:bg-cyan group-hover:shadow-[0_0_10px_var(--color-cyan)]" />
      </span>
    </Link>
  );
}
