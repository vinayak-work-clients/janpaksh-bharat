import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getLivePostsByType } from "@/lib/posts";
import { formatDate, formatDuration } from "@/lib/utils";
import { AdRail, AdSlot } from "@/components/ads/AdSlot";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EpisodePlayer } from "@/components/audio/EpisodePlayer";
import { EpisodeList } from "@/components/audio/EpisodeList";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: `${siteConfig.podcast.showName} — Podcast`,
  description: siteConfig.podcast.blurb,
};

const HERO = "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=2400&q=80";

export default function PodcastsPage() {
  const episodes = getLivePostsByType("podcast");
  const [latest] = episodes;

  return (
    <>
      <PageHero
        variant="image"
        image={HERO}
        eyebrow="Podcast"
        title={siteConfig.podcast.showName}
        titleHindi={siteConfig.podcast.showNameHindi}
        description={siteConfig.podcast.blurb}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-sans text-kicker uppercase text-paper/60">Listen on</span>
          {Object.entries(siteConfig.listenOn).map(([k, v]) => (
            <a key={k} href={v} className="rounded-full border border-paper/30 px-4 py-1.5 font-sans text-[0.8rem] font-medium capitalize text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink">
              {k}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="container-editorial pt-8">
        <AdSlot slot="listing.top" priority />
      </div>

      {latest && (
        <section aria-labelledby="latest-episode" className="container-editorial py-16 md:py-24">
          <SectionHeading kicker="Latest episode" title="This week" />
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-square w-full overflow-hidden bg-paper-2">
                <Image src={latest.coverImage} alt="" fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <Kicker dot>Episode {String(episodes.length).padStart(2, "0")}<span aria-hidden="true" className="text-rule">·</span>{formatDate(latest.publishedAt, "d MMM yyyy")}</Kicker>
              <h2 id="latest-episode" className="mt-4 max-w-[22ch] font-serif text-h1 text-ink">{latest.title}</h2>
              {latest.standfirst && <p className="mt-5 max-w-2xl font-sans text-[1.1rem] leading-relaxed text-muted">{latest.standfirst}</p>}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <EpisodePlayer post={latest} />
                <Link href={`/news/${latest.slug}`} className="group inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink hover:text-saffron-dark">
                  Episode notes
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
              {latest.durationSec && (
                <p className="mt-4 font-sans text-[0.8rem] text-muted">Runtime {formatDuration(latest.durationSec)} · Hosted by {latest.author.name}</p>
              )}
            </Reveal>
          </div>
        </section>
      )}

      <section aria-labelledby="all-episodes" className="bg-paper-2 py-16 md:py-24">
        <div className="container-editorial">
          <SectionHeading id="all-episodes" kicker="Archive" title="All episodes" />
          <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <Reveal>
                {episodes.length > 0 ? <EpisodeList episodes={episodes} /> : <p className="font-serif text-h3 text-ink">No episodes live right now.</p>}
              </Reveal>
              {episodes.length < 4 && (
                <p className="mt-6 font-sans text-[0.9rem] text-muted">
                  New episodes every week. Older episodes archive 30 days after release — subscribe on your player to keep them.
                </p>
              )}
            </div>
            <aside className="lg:col-span-4">
              <AdRail slot="podcast.rail" />
            </aside>
          </div>
        </div>
      </section>

      <section className="container-editorial py-16 md:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border border-rule p-8 md:flex-row md:items-center md:p-10">
            <div>
              <Kicker dot>Suggest a topic</Kicker>
              <h2 className="mt-3 font-serif text-h2 text-ink">Who should we sit down with next?</h2>
              <p className="mt-3 max-w-xl font-sans text-muted">Tell us the person, the place or the question. The best suggestions become episodes — and we credit you.</p>
            </div>
            <Button href="/contact" variant="ghost" size="lg" className="shrink-0">
              Suggest a topic
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
