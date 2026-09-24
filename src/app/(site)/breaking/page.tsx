import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import { getBreakingPosts, getLivePosts } from "@/lib/data/posts";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon, socialLinksFor } from "@/components/icons/SocialIcons";
import type { Post } from "@/types/content";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Breaking News",
  description: "Developing stories from across India, updated as they happen.",
};

function TimelineEntry({ post, red, index }: { post: Post; red: boolean; index: number }) {
  return (
    <Reveal as="li" delay={Math.min(index, 4) * 0.05} className="relative pl-10">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center`}
      >
        {red && index === 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-breaking opacity-60" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${red ? "bg-breaking" : "bg-rule"}`} />
      </span>
      <Link href={`/news/${post.slug}`} className="group block pb-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <time dateTime={post.publishedAt} className={`font-sans text-kicker uppercase tabular-nums ${red ? "text-breaking" : "text-muted"}`}>
            {formatDate(post.publishedAt, "HH:mm")}
          </time>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-rule" />
          <Kicker>{formatDate(post.publishedAt, "d MMM")}<span aria-hidden="true" className="text-rule">·</span>{post.category}</Kicker>
        </div>
        <h2 className="mt-3 font-serif text-[1.35rem] font-semibold leading-snug text-ink sm:text-[1.6rem]">
          <span className="headline-link">{post.title}</span>
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
        <span className={`mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-medium ${red ? "text-breaking" : "text-ink"}`}>
          Read update
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

export default async function BreakingPage() {
  const [settings, breaking, all] = await Promise.all([getSiteSettings(), getBreakingPosts(), getLivePosts()]);
  const socialLinks = socialLinksFor(settings.socials);
  const breakingIds = new Set(breaking.map((p) => p.id));
  const earlier = all.filter((p) => !breakingIds.has(p.id)).slice(0, 6);

  return (
    <>
      <PageHero
        variant="dark"
        eyebrow={
          <span className="inline-flex items-center gap-2 text-breaking">
            <span className="relative flex h-2 w-2">
              <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-breaking opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-breaking" />
            </span>
            Live
          </span>
        }
        title="Breaking News"
        titleHindi="ताज़ा ख़बर"
        description="Developing stories, updated as they happen. Every entry is verified by the desk before it appears here."
      />

      <div className="container-editorial pt-8">
        <AdSlot slot="listing.top" priority />
      </div>

      <section className="container-editorial py-12 md:py-16">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <ol className="relative border-l border-rule pl-0 [&>li]:-ml-px">
              {breaking.map((post, i) => (
                <TimelineEntry key={post.id} post={post} red index={i} />
              ))}
              {earlier.length > 0 && (
                <li className="relative mb-8 pl-10">
                  <span aria-hidden="true" className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-rule bg-paper" />
                  <Kicker dot className="text-muted">Earlier today</Kicker>
                </li>
              )}
              {earlier.map((post, i) => (
                <TimelineEntry key={post.id} post={post} red={false} index={breaking.length + i} />
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="bg-ink p-7 text-paper sm:p-8">
                  <Kicker tone="saffron">Get Breaking Alerts</Kicker>
                  <h2 className="mt-3 font-serif text-h3 text-paper">The update, before the headline.</h2>
                  <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-paper/70">
                    Our WhatsApp community receives every verified breaking update the moment the desk clears it — two to four
                    messages a day, never spam.
                  </p>
                  <Button href={settings.socials.whatsapp} external variant="primary" className="mt-6 w-full sm:w-auto">
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                    {settings.cta.whatsappLabel}
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="hairline mt-8 pt-6">
                  <Kicker dot>Follow the Story</Kicker>
                  <ul className="mt-4 flex items-center gap-2">
                    {socialLinks.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <a href={href} aria-label={label} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                          <Icon className="h-[17px] w-[17px]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
