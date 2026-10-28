import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Unbounded } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SocialBar } from "@/components/layout/SocialBar";
import { BookingModal } from "@/components/booking/BookingModal";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { StoreHydrator } from "@/components/layout/StoreHydrator";
import { PlayerDock } from "@/components/music/PlayerDock";
import { artist } from "@/data/artist";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-unbounded" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${artist.name} — DJ · Hard Techno · Hard Trance`, template: `%s — ${artist.name}` },
  description: `${artist.name} is a ${artist.age}-year-old Belgian DJ with ${artist.yearsActive} years behind the decks. Hard trance, hard techno, house, 90s dance and jumpstyle. Bookings open.`,
  keywords: ["RYM", "DJ RYM", "hard techno", "hard trance", "techno DJ Belgium", "jumpstyle", "DJ booking"],
  openGraph: { type: "website", siteName: artist.displayName, title: artist.displayName, locale: "en_BE" },
};

export const viewport: Viewport = {
  themeColor: "#05050a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${grotesk.variable} ${jetbrains.variable}`}>
      <body className="grain min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cyan focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <StoreHydrator />
        <Navbar />
        <SocialBar />
        <main id="main">{children}</main>
        <Footer />
        <BookingModal />
        <CartDrawer />
        <PlayerDock />
      </body>
    </html>
  );
}
