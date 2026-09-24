import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/data/settings";
import type { Post } from "@/types/content";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { Reveal } from "@/components/motion/Reveal";

function Bubble({ title, time, className, delay }: { title: string; time: string; className?: string; delay: string }) {
  return (
    <div
      className={`animate-float rounded-2xl rounded-bl-sm bg-paper px-4 py-3 shadow-[0_18px_40px_rgba(11,11,15,0.18)] ${className ?? ""}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-breaking" />
        <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-breaking">Breaking</span>
        <span className="ml-auto font-sans text-[0.65rem] text-muted">{time}</span>
      </div>
      <p className="mt-1.5 font-serif text-[0.95rem] font-semibold leading-snug text-ink">{title}</p>
    </div>
  );
}

export async function ConnectBand({ samples }: { samples: Post[] }) {
  const { cta, socials } = await getSiteSettings();
  const bubbles = samples.slice(0, 3);
  return (
    <section aria-labelledby="connect-heading" className="relative overflow-hidden bg-saffron py-16 text-ink md:py-24">
      <div aria-hidden="true" className="grain absolute inset-0 opacity-[0.06]" />
      <div className="container-editorial relative grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Kicker tone="ink" className="text-ink/70">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
            {cta.whatsappLabel}
          </Kicker>
          <h2 id="connect-heading" className="mt-4 max-w-[12ch] font-serif text-display text-ink">
            Don&rsquo;t just read the news. Be part of it.
          </h2>
          <p className="hindi mt-4 text-[clamp(1.2rem,2.2vw,1.75rem)] text-ink/80">खबर से जुड़िए, बदलाव से जुड़िए</p>
          <p className="mt-6 max-w-lg font-sans text-[1.05rem] leading-relaxed text-ink/80">
            Our WhatsApp community gets verified breaking alerts, ground reports and every new episode first — and tells us
            which stories to chase next.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={socials.whatsapp} external variant="secondary" size="lg" className="hover:bg-paper hover:border-paper">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              {cta.whatsappLabel}
            </Button>
            <Link
              href={cta.primary.href}
              className="group inline-flex items-center gap-1.5 font-sans text-[0.95rem] font-medium text-ink underline-offset-4 hover:underline"
            >
              {cta.primary.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        {/* Decorative floating alert stack */}
        <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
          <div className="relative mx-auto w-[320px] -rotate-3 xl:w-[360px]">
            {bubbles.map((b, i) => (
              <Bubble
                key={b.id}
                title={b.title}
                time={["Just now", "12 min", "1 hr"][i]}
                delay={`${i * -2}s`}
                className={["relative z-30", "relative z-20 -mt-2 ml-8 opacity-90", "relative z-10 -mt-2 ml-16 opacity-75"][i]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
