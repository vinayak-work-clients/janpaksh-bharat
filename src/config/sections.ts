export type SectionKind = "region" | "topic";

export interface Section {
  slug: string;
  name: string;
  nameHindi: string;
  kind: SectionKind;
  description: string;
  /** Optional accent colour token for future section theming. */
  accent?: string;
}

/**
 * News sections. Regions first (they lead the section bar), then topics.
 * `Post.section` holds one of these slugs; `Post.category` stays the finer
 * topical label ("Environment", "Economy") shown as a kicker.
 */
export const sections: readonly Section[] = [
  {
    slug: "national",
    name: "National",
    nameHindi: "राष्ट्रीय",
    kind: "region",
    description:
      "Stories that cross state lines — Union policy, courts, institutions and the reporting that connects a district to Delhi.",
  },
  {
    slug: "uttar-pradesh",
    name: "Uttar Pradesh",
    nameHindi: "उत्तर प्रदेश",
    kind: "region",
    description:
      "Ground reporting from Lucknow, Varanasi, Kanpur, Noida and the districts in between — the country's largest state, up close.",
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    nameHindi: "उत्तराखंड",
    kind: "region",
    description:
      "Our home state: Dehradun, Haridwar, Nainital and the Char Dham valleys — mountains, rivers, pilgrims and the people who live year-round among them.",
  },
  {
    slug: "delhi-ncr",
    name: "Delhi-NCR",
    nameHindi: "दिल्ली-एनसीआर",
    kind: "region",
    description:
      "The capital region — Delhi, Gurugram, Ghaziabad and Faridabad — its air, transport, housing and the decisions made on its behalf.",
  },
  {
    slug: "international",
    name: "International",
    nameHindi: "अंतर्राष्ट्रीय",
    kind: "region",
    description:
      "The neighbourhood and the wider world as they touch India — trade, migration, the Gulf, South Asia and the diaspora.",
  },
  {
    slug: "politics",
    name: "Politics",
    nameHindi: "राजनीति",
    kind: "topic",
    description:
      "Parties, Parliament, elections and the machinery of power — reported from the constituency, not the studio.",
  },
  {
    slug: "business",
    name: "Business",
    nameHindi: "व्यापार",
    kind: "topic",
    description:
      "Markets, money, work and the economy as people actually experience it — from the RBI to the roadside stall.",
  },
  {
    slug: "sports",
    name: "Sports",
    nameHindi: "खेल",
    kind: "topic",
    description:
      "Cricket and everything the cricket coverage crowds out — kabaddi, athletics, the leagues and the grounds behind them.",
  },
] as const;

export const sectionSlugs = sections.map((s) => s.slug);

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export const sectionsByKind: Record<SectionKind, Section[]> = {
  region: sections.filter((s) => s.kind === "region"),
  topic: sections.filter((s) => s.kind === "topic"),
};

export const sectionHref = (slug: string) => `/section/${slug}`;
