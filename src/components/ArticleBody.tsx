import Image from "next/image";
import type { Block } from "@/types/content";
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
  blocks: Block[];
  className?: string;
  /** Drop cap on the first paragraph (default true). */
  dropCap?: boolean;
}

export function ArticleBody({ blocks, className, dropCap = true }: ArticleBodyProps) {
  let firstParagraphSeen = false;

  return (
    <div className={cn("article-body max-w-[68ch]", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p": {
            const isFirst = !firstParagraphSeen;
            firstParagraphSeen = true;
            return (
              <p
                key={i}
                className={cn(
                  "mb-6 font-sans text-[1.125rem] leading-[1.75] text-ink",
                  isFirst &&
                    dropCap &&
                    "first-letter:float-left first-letter:mr-3 first-letter:mt-[0.08em] first-letter:font-serif first-letter:text-[4.6rem] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-saffron",
                )}
              >
                {block.text}
              </p>
            );
          }
          case "h2":
            return (
              <h2 key={i} className="mb-5 mt-12 font-serif text-h2 text-ink">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <figure key={i} className="my-10 xl:-mx-16">
                <blockquote className="border-l-[3px] border-saffron pl-6 xl:pl-8">
                  <p className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] font-light italic leading-[1.3] text-ink">
                    &ldquo;{block.text}&rdquo;
                  </p>
                </blockquote>
                {block.cite && (
                  <figcaption className="mt-4 pl-6 font-sans text-kicker uppercase text-muted xl:pl-8">
                    — {block.cite}
                  </figcaption>
                )}
              </figure>
            );
          case "image":
            return (
              <figure key={i} className="my-10">
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-2">
                  <Image
                    src={block.src}
                    alt={block.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="hairline mt-3 pt-3 font-sans text-[0.75rem] uppercase leading-relaxed tracking-[0.12em] text-muted">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "list":
            return (
              <ul key={i} className="mb-8 mt-2 space-y-3 font-sans text-[1.05rem] leading-relaxed text-ink">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
