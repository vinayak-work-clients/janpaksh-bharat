import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getHomeFeed, getLivePosts } from "@/lib/posts";
import { Hero } from "@/components/home/Hero";
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

export default function HomePage() {
  const feed = getHomeFeed();
  const latest = getLivePosts().slice(0, 3);

  return (
    <>
      <Hero latest={latest} />
      <TopStories lead={feed.lead} secondary={feed.secondary} headlines={feed.headlines} />
      <BreakingBand posts={feed.breaking} />
      <Mosaic posts={feed.mosaic} />
      <WatchStrip videos={feed.videos} />
      <ListenBand podcasts={feed.podcasts} />
      <ConnectBand samples={feed.breaking.length ? feed.breaking.concat(latest) : latest} />
    </>
  );
}
