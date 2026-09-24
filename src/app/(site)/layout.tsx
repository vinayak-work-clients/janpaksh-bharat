import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { organizationLd, webSiteLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { Preloader } from "@/components/Preloader";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PreloaderProvider } from "@/components/PreloaderProvider";
import { PlayerProvider } from "@/components/audio/PlayerProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";

/** Site-wide title/description/OG from the dashboard settings (siteConfig is the fallback). */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.name} – ${s.tagline}`;
  return {
    title: { default: title, template: `%s | ${s.name}` },
    description: s.description,
    applicationName: s.name,
    openGraph: { type: "website", siteName: `${s.nameHindi} · ${s.name}`, title, description: s.description, locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: s.description },
    alternates: { canonical: "/" },
  };
}

/**
 * Public site chrome. URLs are unchanged: the (site) group adds no segment.
 * Settings come from site_settings (cached, tag "settings"): server
 * components call getSiteSettings(), client components read the provider.
 */
export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return (
    <SiteSettingsProvider settings={settings}>
      <JsonLd data={[organizationLd(settings), webSiteLd(settings)]} />
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
    </SiteSettingsProvider>
  );
}
