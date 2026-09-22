import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import type { Block } from "@/types/content";
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
  blocks: Block[];
  className?: string;
  /** Drop cap on the first paragraph (default true). */
  dropCap?: boolean;
  /** Content (e.g. an ad slot) rendered after the block at `insertAfter` (1-based). */
  insert?: ReactNode;
  insertAfter?: number;
}

function renderBlock(block: Block, dropCap: boolean): ReactNode {
  switch (block.type) {
    case "p":
      return (
        <p
          className={cn(
            "mb-6 font-sans text-[1.125rem] leading-[1.75] text-ink",
            dropCap &&
              "first-letter:float-left first-letter:mr-3 first-letter:mt-[0.08em] first-letter:font-serif first-letter:text-[4.6rem] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-saffron",
          )}
        >
          {block.text}
        </p>
      );
    case "h2":
      return <h2 className="mb-5 mt-12 font-serif text-h2 text-ink">{block.text}</h2>;
    case "quote":
      return (
        <figure className="my-10 xl:-mx-16">
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
        <figure className="my-10">
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
        <ul className="mb-8 mt-2 space-y-3 font-sans text-[1.05rem] leading-relaxed text-ink">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

export function ArticleBody({ blocks, className, dropCap = true, insert, insertAfter = 3 }: ArticleBodyProps) {
  // Only insert when there is body left to read after it.
  const insertIndex = insert && blocks.length > insertAfter ? insertAfter - 1 : -1;
  const firstParagraph = blocks.findIndex((b) => b.type === "p");

  return (
    <div className={cn("article-body max-w-[68ch]", className)}>
      {blocks.map((block, i) => (
        <Fragment key={i}>
          {renderBlock(block, dropCap && i === firstParagraph)}
          {i === insertIndex && <div className="my-10">{insert}</div>}
        </Fragment>
      ))}
    </div>
  );
}
