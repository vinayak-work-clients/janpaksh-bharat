import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** When provided the button renders as a next/link anchor. */
  href?: string;
  external?: boolean;
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const variants: Record<Variant, string> = {
  primary:
    "bg-saffron text-ink border border-saffron hover:bg-saffron-dark hover:border-saffron-dark hover:text-paper",
  secondary:
    "bg-ink text-paper border border-ink hover:bg-paper hover:text-ink",
  ghost:
    "bg-transparent text-current border border-rule hover:border-current",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-11 px-6 text-[0.875rem]",
  lg: "h-[3.25rem] px-8 text-[0.95rem]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide whitespace-nowrap transition-colors duration-200 ease-out select-none disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
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
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
