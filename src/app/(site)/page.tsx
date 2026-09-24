import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSection } from "@/config/sections";
import { getHeroDeck, getHomeFeed, getLivePosts, getPostsBySection } from "@/lib/posts";
import { AdSlot } from "@/components/ads/AdSlot";
import { Hero } from "@/components/home/Hero";
import { RegionsBlock, type RegionColumnData } from "@/components/home/RegionsBlock";
import { TopStories } from "@/components/home/TopStories";
import { BreakingBand } from "@/components/home/BreakingBand";
import { Mosaic } from "@/components/home/Mosaic";
import { WatchStrip } from "@/components/home/WatchStrip";
import { ListenBand } from "@/components/home/ListenBand";
import { ConnectBand } from "@/components/home/ConnectBand";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} – ${siteConfig.tagline}` },
  description: siteConfig.description,
};

// Regional columns: the first three show at lg, all five at xl.
const REGION_COLUMNS = ["uttar-pradesh", "uttarakhand", "delhi-ncr", "national", "international"];

export default function HomePage() {
  const feed = getHomeFeed();
  const latest = getLivePosts().slice(0, 3);
  const deck = getHeroDeck(siteConfig.hero.deckSize);
  const regions: RegionColumnData[] = REGION_COLUMNS.flatMap((slug) => {
    const section = getSection(slug);
    return section ? [{ section, posts: getPostsBySection(slug).slice(0, 4) }] : [];
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
