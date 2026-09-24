import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Kicker } from "@/components/ui/Kicker";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PlayButton } from "@/components/ui/PlayButton";
import { Byline } from "@/components/cards/Byline";
import { Reveal } from "@/components/motion/Reveal";

interface TopStoriesProps {
  lead: Post | null;
  secondary: Post[];
  headlines: Post[];
}

function LeadStory({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type={post.type} variant="onDark" className="absolute left-4 top-4" />
          {post.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayButton size="lg" tone="paper" className="shadow-xl" />
            </div>
          )}
        </div>
        <div className="pt-5">
          <Kicker dot>{post.category}</Kicker>
          <h3 className="mt-3 font-serif text-h1 text-ink">
            <span className="headline-link">{post.title}</span>
          </h3>
          <p className="clamp-2 mt-4 max-w-2xl font-sans text-[1rem] leading-relaxed text-muted">{post.excerpt}</p>
          <Byline post={post} className="mt-4" />
        </div>
      </Link>
    </article>
  );
}

function SecondaryStory({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-paper-2">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type={post.type} variant="onDark" className="absolute left-3 top-3" />
        </div>
        <div className="pt-4">
          <Kicker>{post.category}</Kicker>
          <h3 className="mt-2 font-serif text-h3 text-ink">
            <span className="headline-link">{post.title}</span>
          </h3>
          <p className="clamp-1 mt-2 font-sans text-[0.9rem] text-muted">{post.excerpt}</p>
          <Byline post={post} className="mt-3" />
        </div>
      </Link>
    </article>
  );
}

function HeadlineItem({ post, index }: { post: Post; index: number }) {
  return (
    <li className="group">
      <Link href={`/news/${post.slug}`} className="flex gap-4 py-4">
        <span
          aria-hidden="true"
          className="w-8 shrink-0 font-serif text-[1.6rem] font-light italic leading-none text-saffron"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
            <span className="headline-link">{post.title}</span>
          </h3>
          <Kicker className="mt-2">
            {post.type === "breaking" ? (
              <span className="text-breaking">Breaking</span>
            ) : (
              <>{post.type}</>
            )}
            <span aria-hidden="true" className="text-rule">·</span>
            {post.category}
          </Kicker>
        </div>
      </Link>
    </li>
  );
}

export function TopStories({ lead, secondary, headlines }: TopStoriesProps) {
  if (!lead) return null;

  return (
    <section aria-labelledby="top-stories-heading" className="py-16 md:py-24">
      <div className="container-editorial">
        <SectionHeading id="top-stories-heading" kicker="Top Stories" title="What matters today" viewAllHref="/breaking" />

        <div className="mt-10 grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-0">
          {/* Lead */}
          <Reveal className="lg:col-span-7 lg:pr-8 xl:col-span-6">
            <LeadStory post={lead} />
          </Reveal>

          {/* Secondary */}
          <Reveal
            delay={0.08}
            className={cn(
              "flex flex-col gap-8 lg:col-span-5 lg:border-l lg:border-rule lg:pl-8 xl:col-span-3 xl:pr-8",
            )}
          >
            {secondary.map((post, i) => (
              <div key={post.id} className={cn(i > 0 && "hairline pt-8")}>
                <SecondaryStory post={post} />
              </div>
            ))}
          </Reveal>

          {/* Headlines */}
          <Reveal
            delay={0.16}
            className="lg:col-span-12 lg:border-t lg:border-rule lg:pt-8 xl:col-span-3 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0"
          >
            <Kicker dot className="mb-1">
              Headlines
            </Kicker>
            <ol className="divide-y divide-rule lg:grid lg:grid-cols-2 lg:gap-x-8 lg:divide-y-0 xl:block xl:divide-y">
              {headlines.map((post, i) => (
                <HeadlineItem key={post.id} post={post} index={i} />
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
