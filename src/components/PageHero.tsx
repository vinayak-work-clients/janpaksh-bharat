import Image from "next/image";
import type { ReactNode } from "react";
import { Kicker } from "@/components/ui/Kicker";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  /** @deprecated use eyebrow */
  kicker?: string;
  title: string;
  titleHindi?: string;
  description?: string;
  variant?: "light" | "dark" | "image";
  image?: string;
  imageAlt?: string;
  className?: string;
  children?: ReactNode;
}

/** Hero band shared by every inner page. */
export function PageHero({
  eyebrow,
  kicker,
  title,
  titleHindi,
  description,
  variant = "light",
  image,
  imageAlt = "",
  className,
  children,
}: PageHeroProps) {
  const dark = variant === "dark" || variant === "image";
  const label = eyebrow ?? kicker;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        variant === "light" && "hairline-b bg-paper-2",
        variant === "dark" && "bg-ink text-paper",
        variant === "image" && "flex min-h-[56svh] flex-col justify-end bg-ink text-paper",
        // Sit under the transparent-capable navbar on image heroes.
        variant === "image" && "-mt-[var(--header-height)] pt-[var(--header-height)]",
        className,
      )}
    >
      {variant === "image" && image && (
        <div aria-hidden="true" className="absolute inset-0">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.96)_0%,rgba(11,11,15,0.7)_35%,rgba(11,11,15,0.15)_70%,rgba(11,11,15,0.45)_100%)]" />
          <div className="grain absolute inset-0 opacity-[0.05]" />
        </div>
      )}

      <div
        className={cn(
          "container-editorial relative",
          variant === "image" ? "pb-12 pt-24 sm:pb-16" : "py-14 sm:py-20 lg:py-24",
        )}
      >
        {label && (
          <Kicker dot tone={dark ? "saffron" : "muted"} className={dark ? "text-saffron" : undefined}>
            {label}
          </Kicker>
        )}
        <h1 className={cn("mt-4 max-w-[18ch] font-serif text-h1", dark ? "text-paper" : "text-ink")}>{title}</h1>
        {titleHindi && (
          <p className={cn("hindi mt-2 text-[clamp(1.1rem,2vw,1.5rem)]", dark ? "text-saffron-light" : "text-saffron-dark")}>
            {titleHindi}
          </p>
        )}
        {description && (
          <p
            className={cn(
              "mt-6 max-w-2xl font-sans text-[1.05rem] leading-relaxed",
              dark ? "text-paper/70" : "text-muted",
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
