import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {icon && (
        <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-paper-2 text-muted [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </span>
      )}
      <h3 className="font-serif text-[1.35rem] font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm font-sans text-[0.9rem] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
