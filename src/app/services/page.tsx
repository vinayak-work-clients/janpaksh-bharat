import type { Metadata } from "next";
import { CalendarDays, Clapperboard, Handshake, Megaphone, Mic, Newspaper } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import type { Service } from "@/types/content";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Services",
  description: "Ground reporting, video, podcasts, partnerships, event coverage and public notices — journalism produced end to end.",
};

const icons: Record<Service["icon"], typeof Newspaper> = { Newspaper, Clapperboard, Mic, Handshake, CalendarDays, Megaphone };

const steps = [
  { title: "Brief", text: "A 30-minute call to understand the story, the audience and the deadline." },
  { title: "Proposal", text: "Scope, timeline and a fixed price within two working days. No surprises." },
  { title: "Produce", text: "A named editor runs the project. You see rough cuts and drafts, not a black box." },
  { title: "Deliver", text: "Files, rights and a distribution plan — plus a fortnightly performance note." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero variant="dark" eyebrow="Services" title="Journalism, produced end to end" titleHindi="हमारी सेवाएँ" description="We work with newsrooms, brands, institutions and communities that need stories told with the discipline of a news desk — and labelled honestly." />

      <section className="container-editorial py-16 md:py-24" aria-label="What we offer">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.slug} delay={(i % 2) * 0.06}>
                <article id={s.slug} className="group flex h-full flex-col border border-rule bg-paper p-7 transition-all duration-300 ease-expo-out hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_40px_-20px_rgba(11,11,15,0.35)] sm:p-9">
                  <Icon className="h-9 w-9 text-saffron" strokeWidth={1.5} aria-hidden="true" />
                  <h2 className="mt-6 font-serif text-h3 text-ink">{s.title}</h2>
                  <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-muted">{s.summary}</p>
                  <ul className="hairline mt-6 space-y-2.5 pt-5 font-sans text-[0.9rem] text-ink">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container-editorial pb-16 md:pb-24" aria-labelledby="engagements">
        <SectionHeading id="engagements" kicker="Process" title="How engagements work" />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, i) => (
            <Reveal as="li" key={st.title} delay={i * 0.06} className="relative border-t border-rule pt-6">
              <span aria-hidden="true" className="absolute -top-px left-0 h-px w-10 bg-saffron" />
              <span aria-hidden="true" className="font-serif text-[1.6rem] font-light italic leading-none text-saffron">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-serif text-[1.2rem] font-semibold text-ink">{st.title}</h3>
              <p className="mt-2 font-sans text-[0.9rem] leading-relaxed text-muted">{st.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-paper-2 py-16 md:py-24">
        <div className="container-editorial flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <Kicker dot>Work with us</Kicker>
            <h2 className="mt-3 max-w-[18ch] font-serif text-h1 text-ink">Have a story or a project?</h2>
            <p className="mt-4 max-w-xl font-sans text-muted">Tell us what you need and when. A named editor replies within two working days with a scope and a price.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" variant="primary" size="lg">Start a conversation</Button>
            <Button href={siteConfig.socials.whatsapp} external variant="ghost" size="lg">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
