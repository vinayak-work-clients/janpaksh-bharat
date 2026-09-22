"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sectionsByKind, sectionHref, type Section } from "@/config/sections";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  /**
   * On the home page the bar is fixed under the header and slides in once
   * the header turns solid; elsewhere it sits in normal flow under the header.
   */
  floating?: boolean;
  /** Only meaningful when floating: true once the page has scrolled. */
  shown?: boolean;
  /** Hidden while the mobile menu is open. */
  hidden?: boolean;
}

/** Guardian-style secondary bar: regions, a divider, then topics. */
export function SectionNav({ floating = false, shown = true, hidden = false }: SectionNavProps) {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/section/") ? pathname.split("/")[2] : null;

  // Flat list so every <li> is a direct child of the <ul>: regions, a
  // divider, then topics.
  const items: Array<{ kind: "divider" } | { kind: "section"; section: Section }> = [
    ...sectionsByKind.region.map((section) => ({ kind: "section" as const, section })),
    { kind: "divider" as const },
    ...sectionsByKind.topic.map((section) => ({ kind: "section" as const, section })),
  ];

  return (
    <nav
      aria-label="Sections"
      aria-hidden={hidden || (floating && !shown) ? true : undefined}
      className={cn(
        "section-nav w-full border-y border-rule bg-paper text-ink",
        floating &&
          "fixed inset-x-0 top-[var(--header-height)] z-40 transition-[transform,opacity] duration-300 ease-out",
        floating && !shown && "pointer-events-none -translate-y-full opacity-0",
        hidden && "invisible",
      )}
    >
      <div className="container-editorial">
        <ul className="no-scrollbar -mx-[clamp(1rem,4vw,3rem)] flex snap-x snap-mandatory items-stretch overflow-x-auto px-[clamp(1rem,4vw,3rem)] sm:mx-0 sm:px-0 lg:justify-start">
          {items.map((item, i) => {
            if (item.kind === "divider") {
              return <li key={`divider-${i}`} aria-hidden="true" className="mx-2 my-auto h-5 w-px shrink-0 bg-rule sm:mx-3" />;
            }
            const s = item.section;
            const active = activeSlug === s.slug;
            return (
              <li key={s.slug} className="shrink-0 snap-start">
                <Link
                  href={sectionHref(s.slug)}
                  title={s.nameHindi}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex h-11 flex-col justify-center px-3 font-sans text-[0.9rem] font-medium leading-none transition-colors lg:h-12",
                    i === 0 && "pl-0",
                    active ? "text-ink" : "text-ink/70 hover:text-ink",
                  )}
                >
                  <span className="whitespace-nowrap">{s.name}</span>
                  <span
                    lang="hi"
                    aria-hidden="true"
                    className="hindi-sans mt-0.5 hidden whitespace-nowrap text-[0.62rem] leading-none text-muted lg:block"
                  >
                    {s.nameHindi}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 right-3 h-[2px] bg-saffron transition-transform duration-300 ease-expo-out",
                      i === 0 ? "left-0" : "left-3",
                      active ? "scale-x-100" : "origin-left scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
