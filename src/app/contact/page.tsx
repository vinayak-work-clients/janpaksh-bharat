import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/faq";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon, socialLinks } from "@/components/icons/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Story tips, partnerships, corrections or just to say hello — talk to the Janpaksh Bharat desk.",
};

export default function ContactPage() {
  const { contact, about } = siteConfig;

  return (
    <>
      <PageHero variant="light" eyebrow="Contact" title="Talk to us" titleHindi="संपर्क करें" description="Tips are confidential. Partnerships get a reply within two working days. Everything else, we read." />

      <section className="container-editorial py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="border border-rule p-7 sm:p-8">
                <Kicker dot>Reach the desk</Kicker>
                <h2 className="mt-3 font-serif text-h2 text-ink">{contact.name}</h2>
                <p className="mt-1 font-sans text-[0.9rem] text-muted">{contact.role}</p>
                <ul className="mt-6 flex flex-col gap-3 font-sans text-[0.95rem]">
                  <li>
                    <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-3 text-ink hover:text-saffron-dark">
                      <Mail className="h-4 w-4 text-muted" aria-hidden="true" /> {contact.email}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-3 text-ink hover:text-saffron-dark">
                      <Phone className="h-4 w-4 text-muted" aria-hidden="true" /> {contact.phone}
                    </a>
                  </li>
                  <li className="inline-flex items-center gap-3 text-ink">
                    <MapPin className="h-4 w-4 text-muted" aria-hidden="true" /> {about.location}
                  </li>
                </ul>
                <Button href={siteConfig.socials.whatsapp} external variant="primary" className="mt-7">
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  WhatsApp the desk
                </Button>
                <ul className="hairline mt-7 flex items-center gap-2 pt-6" aria-label="Social media">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a href={href} aria-label={label} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                        <Icon className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-8 bg-paper-2 p-7 sm:p-8">
                <Kicker dot>Story tips</Kicker>
                <h3 className="mt-3 font-serif text-h3 text-ink">Know something we should?</h3>
                <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-muted">
                  Use the form and choose &ldquo;Story tip&rdquo;, or message us on WhatsApp. Tell us what happened, where and when.
                  We never publish a tipster&rsquo;s identity without written consent, and we&rsquo;ll delete your details on request.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-12">
              <Kicker dot>Frequently asked</Kicker>
              <FaqAccordion items={faqs} className="mt-4" />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <Kicker dot>Send a message</Kicker>
              <h2 className="mt-3 font-serif text-h2 text-ink">Write to the newsroom</h2>
              <p className="mt-3 mb-8 font-sans text-muted">Pick a topic so it lands on the right desk.</p>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
