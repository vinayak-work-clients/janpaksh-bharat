import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { team } from "@/data/team";
import type { TeamMember } from "@/types/content";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon, LinkedInIcon, XIcon } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Team",
  description: "The reporters, producers and editors behind Janpaksh Bharat.",
};

function Socials({ m, tone = "light" }: { m: TeamMember; tone?: "light" | "dark" }) {
  const links = [
    m.socials?.x && { label: `${m.name} on X`, href: m.socials.x, Icon: XIcon },
    m.socials?.instagram && { label: `${m.name} on Instagram`, href: m.socials.instagram, Icon: InstagramIcon },
    m.socials?.linkedin && { label: `${m.name} on LinkedIn`, href: m.socials.linkedin, Icon: LinkedInIcon },
  ].filter(Boolean) as { label: string; href: string; Icon: typeof XIcon }[];
  if (links.length === 0) return null;
  return (
    <ul className="flex items-center gap-2">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} aria-label={label} className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${tone === "light" ? "border-rule text-ink hover:border-ink hover:bg-ink hover:text-paper" : "border-paper/20 text-paper hover:border-saffron hover:text-saffron"}`}>
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function TeamPage() {
  const [lead, ...rest] = team;

  return (
    <>
      <PageHero variant="light" eyebrow="Team" title="The people behind Janpaksh" titleHindi="हमारी टीम" description="A small newsroom by design: reporters who live where they report, and editors who know the difference between a rumour and a source." />

      <section className="container-editorial py-16 md:py-24">
        {/* Spotlight */}
        <Reveal>
          <article className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2 lg:col-span-5">
              <Image src={lead.photo} alt={lead.name} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
            <div className="lg:col-span-7 lg:pl-8">
              <Kicker dot>{lead.role}</Kicker>
              <h2 className="mt-3 font-serif text-h1 text-ink">{lead.name}</h2>
              <p className="mt-5 max-w-xl font-sans text-[1.05rem] leading-relaxed text-muted">{lead.bio}</p>
              <ul className="mt-6 flex flex-col gap-2 font-sans text-[0.95rem]">
                {lead.email && (
                  <li>
                    <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-ink hover:text-saffron-dark">
                      <Mail className="h-4 w-4" aria-hidden="true" /> {lead.email}
                    </a>
                  </li>
                )}
                {lead.phone && (
                  <li>
                    <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-ink hover:text-saffron-dark">
                      <Phone className="h-4 w-4" aria-hidden="true" /> {lead.phone}
                    </a>
                  </li>
                )}
              </ul>
              <div className="mt-6"><Socials m={lead} /></div>
            </div>
          </article>
        </Reveal>

        {/* Grid */}
        <div className="hairline mt-16 grid gap-x-8 gap-y-14 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((m, i) => (
            <Reveal as="article" key={m.slug} delay={(i % 3) * 0.06} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
                <Image src={m.photo} alt={m.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale transition-all duration-500 ease-expo-out group-hover:scale-[1.02] group-hover:grayscale-0" />
              </div>
              <h3 className="mt-5 font-serif text-h3 text-ink">{m.name}</h3>
              <Kicker className="mt-1">{m.role}</Kicker>
              <p className="clamp-2 mt-3 font-sans text-[0.95rem] leading-relaxed text-muted">{m.bio}</p>
              <div className="mt-4"><Socials m={m} /></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="container-editorial flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Kicker dot>Careers</Kicker>
            <h2 className="mt-3 font-serif text-h2 text-ink">Want to report with us?</h2>
            <p className="mt-3 max-w-xl font-sans text-muted">We hire from Tier-2 and Tier-3 cities first. Send three pieces of your work — no CV needed.</p>
          </div>
          <Button href="/contact" variant="secondary" size="lg">Get in touch</Button>
        </div>
      </section>
    </>
  );
}
