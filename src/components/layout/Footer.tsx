import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { sections, sectionHref } from "@/config/sections";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { socialLinks, WhatsAppIcon } from "@/components/icons/SocialIcons";

const linkClass =
  "font-sans text-[0.9rem] text-paper/70 transition-colors hover:text-saffron";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <Kicker tone="paper" className="mb-5 text-paper/50">
        {title}
      </Kicker>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const companyLinks = siteConfig.nav.filter((n) =>
    ["/about", "/team", "/services", "/contact"].includes(n.href),
  );
  const sectionLinks = sections.map((s) => ({ label: s.name, href: sectionHref(s.slug) }));

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Giant cropped Hindi wordmark */}
      <div
        aria-hidden="true"
        className="container-editorial pointer-events-none select-none overflow-hidden"
      >
        <p
          lang="hi"
          className="hindi-display -mb-[0.28em] mt-8 whitespace-nowrap leading-[1.1] text-paper/[0.06]"
          style={{ fontSize: "clamp(4.5rem, 17vw, 16rem)" }}
        >
          {siteConfig.nameHindi}
        </p>
      </div>

      <div className="container-editorial relative border-t border-paper/10">
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* 1. About */}
          <div className="lg:col-span-4">
            <Logo tone="paper" size="footer" />
            <Kicker as="p" tone="paper" className="mt-6 flex text-paper/50">
              {siteConfig.name}
            </Kicker>
            <p className="mt-3 max-w-sm font-sans text-[0.9rem] leading-relaxed text-paper/70">
              {siteConfig.description}
            </p>
            <p className="hindi mt-4 text-[1.05rem] text-saffron">
              {siteConfig.tagline}
            </p>
            <p className="mt-1 font-serif text-[0.95rem] italic text-paper/60">{siteConfig.taglineEn}</p>
          </div>

          {/* 2. Sections */}
          <div className="lg:col-span-2">
            <FooterColumn title="Sections" links={sectionLinks} />
          </div>

          {/* 3. Company */}
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={companyLinks} />
          </div>

          {/* 4. Join the conversation */}
          <div id="whatsapp" className="scroll-mt-24 lg:col-span-4">
            <Kicker tone="paper" className="mb-5 text-paper/50">
              {siteConfig.cta.whatsappLabel}
            </Kicker>
            <p className="mb-5 max-w-sm font-sans text-[0.9rem] leading-relaxed text-paper/70">
              Get breaking alerts, ground reports and podcast drops straight on
              WhatsApp. No spam, no noise — just the story.
            </p>
            <Button
              href={siteConfig.socials.whatsapp}
              variant="primary"
              size="md"
              className="hover:bg-saffron-light hover:border-saffron-light hover:text-ink"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              {siteConfig.cta.whatsappLabel}
            </Button>

            <ul className="mt-6 flex items-center gap-2" aria-label="Social media">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper/70 transition-colors hover:border-saffron hover:text-saffron"
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 font-sans text-[0.78rem] text-paper/55 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <span>
              © {year} {siteConfig.name}. All rights reserved.
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="hidden h-1 w-1 rounded-full bg-paper/30 sm:inline-block"
              />
              {siteConfig.archiveNotice}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-saffron"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-saffron"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
            <span className="flex items-center gap-4">
              {siteConfig.legal.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="transition-colors hover:text-saffron"
                >
                  {l.label}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
