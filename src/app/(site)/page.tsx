import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getSection } from "@/config/sections";
import { getSiteSettings } from "@/lib/data/settings";
import { getHeroDeck, getHomeFeed, getLatestPosts, getLivePostsBySection } from "@/lib/data/posts";
import { AdSlot } from "@/components/ads/AdSlot";
import { Hero } from "@/components/home/Hero";
import { RegionsBlock, type RegionColumnData } from "@/components/home/RegionsBlock";
import { TopStories } from "@/components/home/TopStories";
import { BreakingBand } from "@/components/home/BreakingBand";
import { Mosaic } from "@/components/home/Mosaic";
import { ConnectBand } from "@/components/home/ConnectBand";

// Below the fold and interactive: split their JS out of the initial bundle.
const WatchStrip = dynamic(() => import("@/components/home/WatchStrip").then((m) => m.WatchStrip), { ssr: true });
const ListenBand = dynamic(() => import("@/components/home/ListenBand").then((m) => m.ListenBand), { ssr: true });

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { absolute: `${s.name} – ${s.tagline}` },
    description: s.description,
    alternates: { canonical: "/" },
  };
}

// Regional columns: the first three show at lg, all five at xl.
const REGION_COLUMNS = ["uttar-pradesh", "uttarakhand", "delhi-ncr", "national", "international"];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const [feed, latest, deck, regionPosts] = await Promise.all([
    getHomeFeed(),
    getLatestPosts(3),
    getHeroDeck(settings.hero.deckSize),
    Promise.all(REGION_COLUMNS.map((slug) => getLivePostsBySection(slug))),
  ]);
  const regions: RegionColumnData[] = REGION_COLUMNS.flatMap((slug, i) => {
    const section = getSection(slug);
    return section ? [{ section, posts: regionPosts[i].slice(0, 4) }] : [];
  });

  return (
    <>
      <Hero deck={deck} />
      <div className="container-editorial pt-10 md:pt-14">
        <AdSlot slot="home.belowHero" />
      </div>
      <TopStories lead={feed.lead} secondary={feed.secondary} headlines={feed.headlines} />
      <BreakingBand posts={feed.breaking} />
      <Mosaic posts={feed.mosaic} />
      <RegionsBlock columns={regions} />
      <div className="container-editorial border-t border-rule py-10 md:py-12">
        <AdSlot slot="home.midMosaic" />
      </div>
      <WatchStrip videos={feed.videos} />
      <div className="container-editorial py-10 md:py-12">
        <AdSlot slot="home.beforeListen" />
      </div>
      <ListenBand podcasts={feed.podcasts} />
      <ConnectBand samples={feed.breaking.length ? feed.breaking.concat(latest) : latest} />
    </>
  );
}
