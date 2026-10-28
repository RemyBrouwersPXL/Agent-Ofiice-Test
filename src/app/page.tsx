import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Music } from "@/components/sections/Music";
import { Tour } from "@/components/sections/Tour";
import { Gallery } from "@/components/sections/Gallery";

// Re-render daily so gigs move from "upcoming" to "past" without a redeploy.
export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Music />
      <Tour />
      <Gallery />
    </>
  );
}
