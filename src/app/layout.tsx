import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter,
  Noto_Sans_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import { siteConfig } from "@/config/site";
import { SITE_URL } from "@/lib/site-url";
import { Preloader } from "@/components/Preloader";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PreloaderProvider } from "@/components/PreloaderProvider";
import { PlayerProvider } from "@/components/audio/PlayerProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-hindi-serif",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-hindi-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${tiroHindi.variable} ${notoHindi.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <PreloaderProvider>
          <PlayerProvider>
            <Preloader />
            <BreakingTicker />
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <MiniPlayer />
            <MobileCtaBar />
          </PlayerProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
