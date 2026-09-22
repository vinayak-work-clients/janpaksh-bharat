import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { adSizes, adSlots, type AdSizeKey, type AdSlotKey } from "@/config/ads";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot: AdSlotKey;
  className?: string;
  /** Horizontal alignment of the creative inside its container. */
  align?: "center" | "start";
  /** Above-the-fold slots load eagerly; everything else is lazy. */
  priority?: boolean;
}

/**
 * One rendered size. The frame reserves the creative's exact aspect ratio and
 * caps at its natural width, so the height is known before the image loads
 * and nothing shifts. Fluid sizes (in-feed square) fill their column.
 */
function Frame({
  size,
  src,
  alt,
  sizes,
  priority,
  visibility,
  align,
}: {
  size: AdSizeKey;
  src: string;
  alt: string;
  sizes: string;
  priority: boolean;
  visibility: string;
  align: "center" | "start";
}) {
  const s = adSizes[size];
  const style: CSSProperties = {
    aspectRatio: `${s.width} / ${s.height}`,
    maxWidth: s.fluid ? undefined : s.width,
  };
  return (
    <span
      data-ad-size={size}
      className={cn(
        "relative w-full overflow-hidden border border-rule bg-paper-2",
        align === "center" && "mx-auto",
        visibility,
      )}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
      />
    </span>
  );
}

/**
 * Renders an advertisement slot by key. Disabled slots render nothing (and
 * reserve no space). A slot with `mobileSize` / `tabletSize` swaps creatives
 * by breakpoint; each breakpoint's frame is present in the DOM but only one
 * is displayed, so the reserved height is always correct.
 */
export function AdSlot({ slot, className, align = "center", priority = false }: AdSlotProps) {
  const config = adSlots[slot];
  if (!config?.enabled) return null;

  const { size, tabletSize, mobileSize, creative } = config;
  const srcFor = (s: AdSizeKey) => (s === size ? creative.src : (creative.srcBySize?.[s] ?? creative.src));

  // Visibility classes per breakpoint so exactly one frame is displayed.
  const primaryVisibility = tabletSize
    ? "hidden lg:block"
    : mobileSize
      ? "hidden md:block"
      : "block";

  const frames: Array<{ size: AdSizeKey; visibility: string; sizes: string }> = [];
  if (mobileSize) {
    frames.push({ size: mobileSize, visibility: "block md:hidden", sizes: "100vw" });
  }
  if (tabletSize) {
    frames.push({ size: tabletSize, visibility: "hidden md:block lg:hidden", sizes: `${adSizes[tabletSize].width}px` });
  }
  frames.push({
    size,
    visibility: primaryVisibility,
    sizes: adSizes[size].fluid ? "(min-width: 1024px) 60vw, 100vw" : `${adSizes[size].width}px`,
  });

  return (
    <div
      data-ad-slot={slot}
      className={cn("ad-slot", align === "center" ? "text-center" : "text-left", className)}
    >
      <span className="mb-2 block font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted">
        Advertisement
      </span>
      <a
        href={creative.href}
        target="_blank"
        rel="sponsored noopener"
        aria-label={`${creative.sponsorName} (sponsored, opens in a new tab)`}
        className="block"
      >
        {frames.map((f) => (
          <Frame
            key={f.size}
            size={f.size}
            src={srcFor(f.size)}
            alt={creative.alt}
            sizes={f.sizes}
            priority={priority}
            visibility={f.visibility}
            align={align}
          />
        ))}
      </a>
    </div>
  );
}

interface AdRailProps {
  slot: AdSlotKey;
  className?: string;
  /** Rail content rendered under the ad inside the same sticky block. */
  children?: ReactNode;
}

/**
 * Sticky right-rail wrapper (top-28) for a 300×600 or 300×250 slot. Rail ads
 * are desktop-only; below lg they are not rendered at all, so no space is
 * reserved. Pass the rest of the rail as children to keep one sticky block.
 */
export function AdRail({ slot, className, children }: AdRailProps) {
  return (
    <div className={cn("lg:sticky lg:top-28", className)}>
      <div className="hidden lg:block">
        <AdSlot slot={slot} align="start" />
      </div>
      {children && <div className={cn(adSlots[slot]?.enabled && "lg:mt-8")}>{children}</div>}
    </div>
  );
}
