import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { SITE_URL } from "@/lib/site-url";
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

// Brand lockup face: "जनपक्ष भारत" in the logo, preloader and footer wordmark.
const notoSerifHindi = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: "700",
  display: "swap",
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
      className={`${fraunces.variable} ${inter.variable} ${tiroHindi.variable} ${notoHindi.variable} ${notoSerifHindi.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
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
