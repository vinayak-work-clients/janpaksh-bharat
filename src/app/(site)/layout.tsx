import { Preloader } from "@/components/Preloader";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PreloaderProvider } from "@/components/PreloaderProvider";
import { PlayerProvider } from "@/components/audio/PlayerProvider";
import { MiniPlayer } from "@/components/audio/MiniPlayer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";

/**
 * Public site chrome. URLs are unchanged: the (site) group adds no segment.
 * SectionNav is rendered by Navbar (it needs the header's scroll state).
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
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
    </>
  );
}
