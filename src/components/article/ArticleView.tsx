import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/content";
import { siteConfig } from "@/config/site";
import { getSection, sectionHref } from "@/config/sections";
import { cn, formatDate, formatDuration, timeAgo } from "@/lib/utils";
import { AdRail, AdSlot } from "@/components/ads/AdSlot";
import { ArticleBody } from "@/components/ArticleBody";
import { ShareBar } from "@/components/ShareBar";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ExpiryNote } from "@/components/ExpiryNote";
import { Kicker } from "@/components/ui/Kicker";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/cards/PostCard";
import { EpisodePlayer } from "@/components/audio/EpisodePlayer";
import { Reveal } from "@/components/motion/Reveal";
import { ConnectBand } from "@/components/home/ConnectBand";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

interface ArticleViewProps {
  post: Post;
  /** Other live posts, same category first. */
  related: Post[];
  /** Other live posts from the same section. */
  moreIn: Post[];
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function MediaBlock({ post }: { post: Post }) {
  if (post.type === "video") {
    return (
      <figure className="container-editorial">
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          {post.mediaUrl ? (
            <video controls playsInline preload="metadata" poster={post.coverImage} className="absolute inset-0 h-full w-full">
              <source src={post.mediaUrl} />
              Your browser does not support embedded video.
            </video>
          ) : post.embedUrl ? (
            <iframe
              title={post.title}
              src={post.embedUrl}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover" />
          )}
        </div>
        {post.durationSec && (
          <figcaption className="mt-3 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted">
            Video · {formatDuration(post.durationSec)} · {post.category}
          </figcaption>
        )}
      </figure>
    );
  }

  if (post.type === "podcast") {
    return (
      <div className="container-editorial">
        <div className="grid gap-8 border border-rule bg-paper-2 p-6 md:grid-cols-12 md:items-center md:p-8">
          <div className="relative aspect-square w-full overflow-hidden bg-paper md:col-span-4">
            <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-8">
            <Kicker dot>{siteConfig.podcast.showName}</Kicker>
            <h2 className="mt-3 font-serif text-h3 text-ink">Listen to this episode</h2>
            {post.mediaUrl ? (
              <EpisodePlayer post={post} className="mt-6" />
            ) : post.embedUrl ? (
              <div className="relative mt-6 h-40 w-full overflow-hidden">
                <iframe title={post.title} src={post.embedUrl} loading="lazy" allow="autoplay; encrypted-media" className="absolute inset-0 h-full w-full border-0" />
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="font-sans text-kicker uppercase text-muted">Listen on</span>
              {Object.entries(siteConfig.listenOn).map(([k, v]) => (
                <a key={k} href={v} className="rounded-full border border-rule px-3 py-1 font-sans text-[0.78rem] font-medium capitalize text-ink transition-colors hover:border-ink">
                  {k}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <figure className="container-editorial">
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-paper-2">
        <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 1320px) 1320px, 100vw" className="object-cover" />
      </div>
      <figcaption className="mt-3 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted">
        {post.category}
      </figcaption>
    </figure>
  );
}

/** The public article layout; used by /news/[slug] and the admin preview. */
export function ArticleView({ post, related, moreIn }: ArticleViewProps) {
  const section = getSection(post.section);
  const rail = moreIn.length >= 2 ? moreIn : related;
  const railLabel = moreIn.length >= 2 && section ? `More in ${section.name}` : "Read next";
  const tone = post.isBreaking ? "breaking" : "saffron";

  return (
    <>
      <ReadingProgress targetId="article-body" tone={tone} />

      <article id="article">
        {/* Header */}
        <header className="container-editorial pb-10 pt-12 sm:pt-16 lg:pb-14">
          <div className="flex flex-wrap items-center gap-3">
            <TypeBadge type={post.type} />
            <Kicker tone={post.isBreaking ? "breaking" : "muted"}>
              {section && (
                <>
                  <Link href={sectionHref(section.slug)} className="text-ink transition-colors hover:text-saffron-dark">
                    {section.name}
                  </Link>
                  <span aria-hidden="true" className="text-rule">·</span>
                </>
              )}
              {post.category}
            </Kicker>
          </div>
          <h1
            className={cn(
              "mt-5 max-w-[20ch] font-serif text-h1 text-ink",
              post.featured && "xl:text-display",
            )}
          >
            {post.title}
          </h1>
          {post.titleHindi && (
            <p className="hindi mt-3 max-w-[40ch] text-[clamp(1.1rem,1.8vw,1.4rem)] text-saffron-dark">{post.titleHindi}</p>
          )}
          {post.standfirst && (
            <p className="mt-6 max-w-3xl font-sans text-xl leading-relaxed text-muted">{post.standfirst}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink font-sans text-[0.7rem] font-semibold tracking-wide text-paper">
                {initials(post.author.name)}
              </span>
              <div className="font-sans text-[0.85rem]">
                <p className="font-medium text-ink">{post.author.name}</p>
                <p className="text-muted">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "d MMMM yyyy")}</time>
                  {post.readTimeMin && post.type !== "video" && post.type !== "podcast" && (
                    <>
                      <span aria-hidden="true"> · </span>
                      {post.readTimeMin} min read
                    </>
                  )}
                </p>
              </div>
            </div>
            <ExpiryNote post={post} />
          </div>

          {post.isBreaking && (
            <p className="mt-5 inline-flex items-center gap-2 border-l-2 border-breaking pl-3 font-sans text-[0.85rem] text-ink">
              <span className="relative flex h-2 w-2">
                <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-breaking opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-breaking" />
              </span>
              Developing story — last updated {timeAgo(post.publishedAt)}
            </p>
          )}
        </header>

        <MediaBlock post={post} />

        {/* Body grid */}
        <div className="container-editorial mt-12 lg:mt-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <aside className="order-2 lg:order-1 lg:col-span-1">
              <ShareBar title={post.title} url={`/news/${post.slug}`} />
            </aside>

            <div id="article-body" className="order-1 lg:order-2 lg:col-span-8">
              {post.body && post.body.length > 0 ? (
                <ArticleBody
                  blocks={post.body}
                  insert={<AdSlot slot="article.inBody" align="start" />}
                  insertAfter={3}
                />
              ) : (
                <p className="font-sans text-[1.125rem] leading-[1.75] text-ink">{post.excerpt}</p>
              )}

              {post.tags.length > 0 && (
                <div className="hairline mt-12 flex flex-wrap items-center gap-2 pt-6">
                  <span className="mr-2 font-sans text-kicker uppercase text-muted">Tags</span>
                  {post.tags.map((t) => (
                    <Link key={t} href={`/blogs?tag=${encodeURIComponent(t)}`} className="rounded-full border border-rule px-3 py-1 font-sans text-[0.78rem] font-medium text-ink transition-colors hover:border-ink">
                      #{t}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <aside className="order-3 lg:col-span-3">
              <AdRail slot="article.rail">
                <Kicker dot>{railLabel}</Kicker>
                <ol className="hairline mt-3 divide-y divide-rule">
                  {rail.map((p) => (
                    <li key={p.id} className="group py-4">
                      <Link href={`/news/${p.slug}`} className="block">
                        <h3 className="font-serif text-[1rem] font-semibold leading-snug text-ink">
                          <span className="headline-link">{p.title}</span>
                        </h3>
                        <Kicker className="mt-2">{p.type}<span aria-hidden="true" className="text-rule">·</span>{p.category}</Kicker>
                      </Link>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 bg-saffron p-5 text-ink">
                  <Kicker tone="ink" className="text-ink/70">{siteConfig.cta.whatsappLabel}</Kicker>
                  <p className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug">Get the next update before it&rsquo;s a headline.</p>
                  <Button href={siteConfig.socials.whatsapp} external variant="secondary" size="sm" className="mt-4">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </AdRail>
            </aside>
          </div>
        </div>

        <div className="container-editorial mt-16 lg:mt-20">
          <AdSlot slot="article.belowBody" />
        </div>

        {/* Read next */}
        {related.length > 0 && (
          <section aria-labelledby="read-next" className="container-editorial mt-16 lg:mt-20">
            <SectionHeading id="read-next" kicker="Read next" title="Keep going" viewAllHref="/blogs" viewAllLabel="All stories" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <PostCard post={p} span={4} className="h-full" />
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Link href="/blogs" className="group inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ink hover:text-saffron-dark">
                Browse every story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
      </article>

      <div className="mt-20 lg:mt-28">
        <ConnectBand samples={related} />
      </div>
    </>
  );
}
