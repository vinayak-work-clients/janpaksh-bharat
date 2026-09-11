"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/components/icons/SocialIcons";

interface ShareBarProps {
  title: string;
  /** Absolute or path; resolved against window.location on the client. */
  url: string;
  className?: string;
}

export function ShareBar({ title, url, className }: ShareBarProps) {
  const [href, setHref] = useState(url);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setHref(new URL(url, window.location.origin).toString());
    } catch {
      setHref(url);
    }
  }, [url]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const enc = encodeURIComponent;
  const items = [
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${href}`)}`, Icon: WhatsAppIcon },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(href)}`, Icon: XIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(href)}`, Icon: FacebookIcon },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
    } catch {
      // Clipboard unavailable — fall back to selecting nothing; the URL is in the address bar.
      setCopied(true);
    }
  };

  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper";

  return (
    <div
      className={cn("flex items-center gap-2 lg:sticky lg:top-28 lg:flex-col lg:items-start", className)}
      aria-label="Share this story"
      role="group"
    >
      <span className="mr-1 font-sans text-kicker uppercase text-muted lg:mb-2 lg:mr-0">Share</span>
      {items.map(({ label, href: h, Icon }) => (
        <a key={label} href={h} target="_blank" rel="noopener noreferrer" aria-label={label} className={btn}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} className={cn(btn, "relative", copied && "border-saffron bg-saffron text-ink hover:bg-saffron")}>
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <LinkIcon className="h-4 w-4" aria-hidden="true" />}
        <span
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-sans text-[0.7rem] font-medium text-paper transition-opacity lg:left-full lg:top-1/2 lg:-translate-y-1/2",
            copied ? "opacity-100" : "opacity-0",
          )}
        >
          {copied ? "Copied" : ""}
        </span>
      </button>
    </div>
  );
}
