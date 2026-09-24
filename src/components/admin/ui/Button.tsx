"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dashboard button: the site's primary/secondary/ghost variants plus a
 * `danger` tone, a loading state and an icon-only size. Min tap target 44px
 * on touch via `size="md"` (default).
 */
export type AdminButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
export type AdminButtonSize = "sm" | "md" | "lg" | "icon";

interface BaseProps {
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
  href?: string;
  external?: boolean;
}

export type AdminButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

// Mirrors src/components/ui/Button.tsx so the tool feels like the site.
const variants: Record<AdminButtonVariant, string> = {
  primary: "bg-saffron text-ink border border-saffron hover:bg-saffron-dark hover:border-saffron-dark hover:text-paper",
  secondary: "bg-ink text-paper border border-ink hover:bg-paper hover:text-ink",
  ghost: "bg-transparent text-current border border-rule hover:border-ink",
  subtle: "bg-transparent text-ink border border-transparent hover:bg-ink/5",
  danger: "bg-transparent text-breaking border border-breaking/40 hover:bg-breaking hover:text-paper hover:border-breaking",
};

const sizes: Record<AdminButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8rem]",
  md: "h-11 px-5 text-[0.875rem]",
  lg: "h-[3.25rem] px-7 text-[0.95rem]",
  icon: "h-11 w-11 px-0",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ease-out select-none disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef<HTMLButtonElement, AdminButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className, children, href, external, type = "button", disabled, ...rest },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} className={classes} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
