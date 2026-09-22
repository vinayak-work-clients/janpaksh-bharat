import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/content";
import { sectionHref, type Section } from "@/config/sections";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Kicker } from "@/components/ui/Kicker";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { Byline } from "@/components/cards/Byline";
import { Reveal } from "@/components/motion/Reveal";

export interface RegionColumnData {
  section: Section;
  posts: Post[];
}

interface RegionsBlockProps {
  /** Ordered: the first three show at lg; the rest only at xl. */
  columns: RegionColumnData[];
}

function RegionLead({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-2">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type={post.isBreaking ? "breaking" : post.type} variant="onDark" className="absolute left-3 top-3" />
        </div>
        <div className="pt-4">
          <Kicker tone={post.isBreaking ? "breaking" : "muted"}>{post.isBreaking ? "Breaking" : post.category}</Kicker>
          <h4 className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug text-ink">
            <span className="headline-link">{post.title}</span>
          </h4>
          <Byline post={post} className="mt-3" />
        </div>
      </Link>
    </article>
  );
}

function RegionColumn({ section, posts, className }: RegionColumnData & { className?: string }) {
  const [lead, ...rest] = posts;
  const headlines = rest.slice(0, 3);

  return (
    <div className={cn("flex flex-col", className)}>
      <h3 className="font-serif text-h3 font-semibold text-ink">
        <Link href={sectionHref(section.slug)} className="group inline-block">
          <span className="headline-link">{section.name}</span>
          <span lang="hi" className="hindi mt-0.5 block text-[0.85rem] font-normal text-saffron-dark">
            {section.nameHindi}
          </span>
        </Link>
      </h3>

      {lead ? (
        <>
          <div className="mt-5">
            <RegionLead post={lead} />
          </div>
          {headlines.length > 0 && (
            <ol className="mt-4 divide-y divide-rule border-t border-rule">
              {headlines.map((p) => (
                <li key={p.id} className="group py-3.5">
                  <Link href={`/news/${p.slug}`} className="block">
                    <h4 className="font-serif text-[1rem] font-semibold leading-snug text-ink">
                      <span className="headline-link">{p.title}</span>
                    </h4>
                    <Kicker className="mt-1.5">
                      {p.isBreaking ? <span className="text-breaking">Breaking</span> : p.type}
                      <span aria-hidden="true" className="text-rule">·</span>
                      {p.category}
                    </Kicker>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <p className="mt-5 font-sans text-[0.9rem] text-muted">No stories this week yet.</p>
      )}

      <Link
        href={sectionHref(section.slug)}
        className="group mt-auto inline-flex items-center gap-1.5 pt-5 font-sans text-sm font-medium text-ink hover:text-saffron-dark"
      >
        More from {section.name}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** "Closer to home": regional columns, three at lg, five at xl. */
export function RegionsBlock({ columns }: RegionsBlockProps) {
  const withPosts = columns.filter((c) => c.posts.length > 0);
  if (withPosts.length === 0) return null;

  return (
    <section aria-labelledby="regions-heading" className="border-t border-rule bg-paper py-16 md:py-24">
      <div className="container-editorial">
        <SectionHeading
          id="regions-heading"
          kicker="By region"
          title="Closer to home"
          viewAllHref={sectionHref("national")}
          viewAllLabel="All sections"
        />

        <div className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 lg:gap-x-0">
          {columns.map((col, i) => (
            <Reveal
              key={col.section.slug}
              delay={(i % 3) * 0.06}
              className={cn(
                // Vertical hairlines between columns, like TopStories.
                "lg:px-8 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:nth-child(3n)]:pr-0",
                "lg:border-l lg:border-rule lg:[&:nth-child(3n+1)]:border-l-0",
                // Second row (National + International) only on wide screens.
                i >= 3 && "hidden xl:block xl:mt-12 xl:border-t xl:pt-12",
                i >= 3 && "xl:[&:nth-child(3n+1)]:border-l-0",
              )}
            >
              <RegionColumn section={col.section} posts={col.posts} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
