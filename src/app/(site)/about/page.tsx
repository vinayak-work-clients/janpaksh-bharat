import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search, Send, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { team } from "@/data/team";
import { getSiteSettings } from "@/lib/data/settings";
import { getBreakingPosts } from "@/lib/data/posts";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ConnectBand } from "@/components/home/ConnectBand";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: siteConfig.about.mission,
};

const HERO = "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=2400&q=80";

const steps = [
  { Icon: Send, title: "Tip", text: "A reader, a WhatsApp message, a document. Every story starts with someone who knows something." },
  { Icon: Search, title: "Verify", text: "Two sources minimum, one of them on the record. A reporter goes to the place before we write about it." },
  { Icon: ShieldCheck, title: "Publish", text: "Bilingual, labelled, live for thirty days. Corrections go at the top, with a date." },
];

export default async function AboutPage() {
  // The mission, story, values and stats stay in code (not dashboard-editable).
  const { about } = siteConfig;
  const [settings, breaking] = await Promise.all([getSiteSettings(), getBreakingPosts()]);
  const teaser = team.slice(0, 3);

  return (
    <>
      <PageHero variant="image" image={HERO} eyebrow="About" title={settings.taglineEn} titleHindi={settings.tagline} description={about.mission} />

      {/* Manifesto */}
      <section className="container-editorial py-16 md:py-24" aria-labelledby="manifesto">
        <Reveal>
          <Kicker dot>Why we exist</Kicker>
          <p id="manifesto" className="mt-5 max-w-[28ch] font-serif text-h2 font-normal leading-[1.2] text-ink">{about.mission}</p>
        </Reveal>
        <Reveal delay={0.1} className="hairline mt-12 grid gap-8 pt-10 md:grid-cols-2 md:gap-12">
          {about.storyParagraphs.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-sans text-[1.05rem] leading-[1.75] text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[0.08em] first-letter:font-serif first-letter:text-[4.2rem] first-letter:font-bold first-letter:leading-[0.78] first-letter:text-saffron md:col-span-1"
                  : "font-sans text-[1.05rem] leading-[1.75] text-ink"
              }
            >
              {p}
            </p>
          ))}
        </Reveal>
      </section>

      {/* Stats */}
      <section className="bg-paper-2 py-14 md:py-20" aria-label="By the numbers">
        <div className="container-editorial">
          <Reveal>
            <dl className="grid grid-cols-2 divide-rule md:grid-cols-4 md:divide-x">
              {about.stats.map((s, i) => (
                <div key={s.label} className={`px-2 py-6 md:px-8 ${i > 0 ? "md:pl-8" : "md:pl-0"} ${i % 2 === 1 ? "border-l border-rule md:border-l" : ""}`}>
                  <dd className="font-serif text-display font-light italic leading-none text-ink">{s.value}</dd>
                  <dt className="mt-3 font-sans text-kicker uppercase text-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-editorial py-16 md:py-24" aria-labelledby="values-heading">
        <SectionHeading id="values-heading" kicker="What we stand for" title="Four commitments" />
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <span aria-hidden="true" className="font-serif text-[2rem] font-light italic leading-none text-saffron">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-serif text-h3 text-ink">{v.title}</h3>
              <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-muted">{v.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="bg-ink py-16 text-paper md:py-24" aria-labelledby="how-heading">
        <div className="container-editorial">
          <SectionHeading id="how-heading" inverted kicker="How we work" title="Tip, verify, publish" />
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map(({ Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.08} className="relative border-t border-paper/15 pt-8">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-12 bg-saffron" />
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 text-saffron">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-sans text-kicker uppercase text-paper/50">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 font-serif text-h3 text-paper">{title}</h3>
                <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-paper/70">{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Team teaser */}
      <section className="container-editorial py-16 md:py-24" aria-labelledby="team-heading">
        <SectionHeading id="team-heading" kicker="Newsroom" title="The people behind it" viewAllHref="/team" viewAllLabel="Meet the team" />
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {teaser.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.06}>
              <Link href="/team" className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
                  <Image src={m.photo} alt={m.name} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0" />
                </div>
                <h3 className="mt-4 font-serif text-h3 text-ink"><span className="headline-link">{m.name}</span></h3>
                <Kicker className="mt-1">{m.role}</Kicker>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/team" variant="ghost">Meet the team</Button>
        </div>
      </section>

      <ConnectBand samples={breaking} />
    </>
  );
}
