import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  action?: ReactNode;
  /** Remove padding (tables). */
  flush?: boolean;
  as?: "div" | "section";
}

/** Bordered panel on paper. Headed variant when `title` is given. */
export function Card({ children, className, title, action, flush = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag className={cn("border border-rule bg-paper", className)}>
      {(title || action) && (
        <div className="flex min-h-[3.25rem] items-center justify-between gap-4 border-b border-rule px-4 sm:px-5">
          {title && <h2 className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>}
          {action}
        </div>
      )}
      <div className={flush ? undefined : "p-4 sm:p-5"}>{children}</div>
    </Tag>
  );
}

export function StatCard({ label, value, hint, tone = "ink", href }: { label: ReactNode; value: ReactNode; hint?: ReactNode; tone?: "ink" | "saffron" | "breaking" | "muted"; href?: string }) {
  const color = { ink: "text-ink", saffron: "text-saffron-dark", breaking: "text-breaking", muted: "text-muted" }[tone];
  const body = (
    <>
      <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className={cn("mt-2 font-serif text-[2.25rem] font-semibold leading-none", color)}>{value}</p>
      {hint && <p className="mt-2 font-sans text-[0.8rem] text-muted">{hint}</p>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block border border-rule bg-paper p-4 transition-colors hover:border-ink sm:p-5">
        {body}
      </Link>
    );
  }
  return <div className="border border-rule bg-paper p-4 sm:p-5">{body}</div>;
}
