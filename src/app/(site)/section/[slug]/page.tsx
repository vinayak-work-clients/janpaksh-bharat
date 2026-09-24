import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getSection, sections, sectionsByKind, sectionHref } from "@/config/sections";
import { getLiveBreaking, getPostsBySection } from "@/lib/posts";
import { PageHero } from "@/components/PageHero";
import { AdRail, AdSlot } from "@/components/ads/AdSlot";
import { PostCard } from "@/components/cards/PostCard";
import { StoryRow } from "@/components/cards/StoryRow";
import { LoadMore } from "@/components/LoadMore";
import { Reveal } from "@/components/motion/Reveal";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const section = getSection(params.slug);
  if (!section) return { title: "Section not found" };
  const title = `${section.name} · ${section.nameHindi}`;
  return {
    title,
    description: section.description,
    alternates: { canonical: sectionHref(section.slug) },
    openGraph: { title: `${title} | ${siteConfig.name}`, description: section.description },
  };
}

const IN_FEED_EVERY = 6;

export default function SectionPage({ params }: Props) {
  const section = getSection(params.slug);
  if (!section) notFound();

  const posts = getPostsBySection(section.slug);
  // Lead with a picture story; breaking alerts read better in the rail and list.
  const leadIdx = Math.max(0, posts.findIndex((p) => !p.isBreaking && (p.type === "image" || p.type === "video")));
  const lead = posts[leadIdx];
  const afterLead = posts.filter((_, i) => i !== leadIdx);
  const secondary = afterLead.slice(0, 2);
  const list = afterLead.slice(2);
  const breaking = getLiveBreaking().slice(0, 4);
  const others = sectionsByKind[section.kind].filter((s) => s.slug !== section.slug);
  const otherKind = section.kind === "region" ? sectionsByKind.topic : sectionsByKind.region;

  // StoryRows with an in-feed ad after every six.
  const feed: ReactNode[] = [];
  list.forEach((post, i) => {
    feed.push(<StoryRow key={post.id} post={post} />);
    if ((i + 1) % IN_FEED_EVERY === 0 && i + 1 < list.length) {
      feed.push(<AdSlot key={`ad-${i}`} slot="section.inFeed" className="py-8" />);
    }
  });

  return (
    <>
      <PageHero
        variant="light"
        eyebrow={section.kind === "region" ? "Region" : "Topic"}
        title={section.name}
        titleHindi={section.nameHindi}
        description={section.description}
      />

      <div className="container-editorial pt-8">
        <AdSlot slot="section.topLeaderboard" priority />
      </div>

      <section className="container-editorial py-12 md:py-16" aria-label={`${section.name} stories`}>
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-h2 text-ink">No stories in {section.name} this week yet.</p>
            <p className="mt-3 font-sans text-muted">
              Try another section — everything live on the site is listed under{" "}
              <Link href="/blogs" className="text-ink underline underline-offset-4 hover:text-saffron-dark">
                Stories
              </Link>
              .
            </p>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {sections
                .filter((s) => s.slug !== section.slug)
                .map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={sectionHref(s.slug)}
                      className="inline-flex h-10 items-center rounded-full border border-rule px-4 font-sans text-[0.85rem] font-medium text-ink transition-colors hover:border-ink"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Main column */}
            <div className="lg:col-span-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Reveal className="md:col-span-2">
                  <PostCard post={lead} span={6} className="h-full" />
                </Reveal>
                {secondary.map((p, i) => (
                  <Reveal key={p.id} delay={0.08 + i * 0.05}>
                    <PostCard post={p} span={3} className="h-full" />
                  </Reveal>
                ))}
              </div>

              {list.length > 0 && (
                <div className="mt-14">
                  <div className="hairline pt-4">
                    <Kicker dot>More from {section.name}</Kicker>
                  </div>
                  <LoadMore pageSize={IN_FEED_EVERY * 2 + 2} className="flex flex-col">
                    {feed}
                  </LoadMore>
                </div>
              )}
            </div>

            {/* Rail */}
            <aside className="lg:col-span-4">
              <AdRail slot="section.rail">
                {breaking.length > 0 && (
                  <div>
                    <Kicker tone="breaking" dot>
                      Breaking
                    </Kicker>
                    <ol className="hairline mt-3 divide-y divide-rule">
                      {breaking.map((p) => (
                        <li key={p.id} className="group py-3.5">
                          <Link href={`/news/${p.slug}`} className="block">
                            <h3 className="font-serif text-[1rem] font-semibold leading-snug text-ink">
                              <span className="headline-link">{p.title}</span>
                            </h3>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className={breaking.length > 0 ? "mt-8 bg-ink p-6 text-paper" : "bg-ink p-6 text-paper"}>
                  <Kicker tone="saffron">WhatsApp</Kicker>
                  <p className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug">
                    Get {section.name} updates on WhatsApp.
                  </p>
                  <p className="mt-2 font-sans text-[0.85rem] leading-relaxed text-paper/70">
                    Verified alerts and ground reports from {section.name}, a few times a day.
                  </p>
                  <Button href={siteConfig.socials.whatsapp} external variant="primary" size="sm" className="mt-4">
                    <WhatsAppIcon className="h-4 w-4" />
                    {siteConfig.cta.whatsappLabel}
                  </Button>
                </div>

                <div className="mt-8">
                  <Kicker dot>Other {section.kind === "region" ? "regions" : "topics"}</Kicker>
                  <ul className="hairline mt-3 divide-y divide-rule">
                    {others.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={sectionHref(s.slug)}
                          className="group flex items-center justify-between py-3 font-sans text-[0.95rem] font-medium text-ink hover:text-saffron-dark"
                        >
                          <span>
                            {s.name}
                            <span lang="hi" className="hindi-sans ml-2 text-[0.75rem] font-normal text-muted">
                              {s.nameHindi}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-sans text-[0.8rem] text-muted">
                    {otherKind.map((s) => (
                      <Link key={s.slug} href={sectionHref(s.slug)} className="hover:text-ink">
                        {s.name}
                      </Link>
                    ))}
                  </p>
                </div>
              </AdRail>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
