import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Serif_Devanagari, Tiro_Devanagari_Hindi } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/config/site";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

// Kept lean on purpose: every file below is ~50–120 KB and mobile readers pay
// for all of them before the first headline settles.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

// One variable file instead of three static weights.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  variable: "--font-hindi-serif",
});

// Brand lockup face: "जनपक्ष भारत" in the logo, preloader and footer wordmark.
const notoSerifHindi = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: "700",
  display: "swap",
  preload: false,
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
      className={`${fraunces.variable} ${inter.variable} ${tiroHindi.variable} ${notoSerifHindi.variable}`}
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
