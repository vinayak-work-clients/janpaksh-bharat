import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Serif_Devanagari } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/config/site";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

/*
 * Font diet. Only two files are preloaded: the Hindi headline face (700) and
 * Inter, whose single variable file is the 400 weight the body text needs.
 * Everything else is fetched when first used. Fraunces ships as static 400
 * and 700 uprights plus a 400 italic (the opsz axis is dropped with the
 * variable file); `.font-serif.italic` maps to the italic family in
 * globals.css. Hindi text is one family, Noto Serif Devanagari, in 400 for
 * copy and 700 for the headline and lockup.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-serif",
});

// Italic is decorative (the hero's English tagline, quote marks, numerals).
// `optional`: not preloaded, and a late arrival must not swap in and shift the
// hero deck; it is cached for the next page view instead.
const frauncesItalic = Fraunces({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "optional",
  preload: false,
  variable: "--font-serif-italic",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Hindi copy: taglines, Hindi titles, small labels.
const notoSerifHindi = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-hindi-serif",
});

// Hindi headline + brand lockup face ("जनपक्ष भारत" in the hero, logo, preloader, footer).
// `optional`: preloaded, so it is normally in before first paint; on a slow first
// visit the size-adjusted fallback renders the headline at the same metrics
// (measured: 0% height delta, no layout shift) instead of swapping in late.
const notoSerifHindiDisplay = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: "700",
  display: "optional",
  variable: "--font-hindi-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: `${siteConfig.nameHindi} · ${siteConfig.name}`,
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

/**
 * Root layout: html/body, fonts, global CSS, metadata defaults and toasts.
 * The public chrome lives in (site)/layout.tsx; the dashboard shell in admin/layout.tsx.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${inter.variable} ${notoSerifHindi.variable} ${notoSerifHindiDisplay.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
        {/* The scripts are served by Vercel; elsewhere (local `next start`) they would 404. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <Toaster
          position="bottom-center"
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans !rounded-none !border-rule !bg-paper !text-ink !shadow-lg",
              title: "!font-medium",
              description: "!text-muted",
            },
          }}
        />
      </body>
    </html>
  );
}
