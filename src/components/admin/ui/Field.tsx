import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  /** Id of the control; the label points at it. */
  htmlFor: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  /** Right-aligned extra (a character counter, a button). */
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint/error. The control should carry `aria-describedby={hintId(htmlFor)}`. */
export function Field({ htmlFor, label, hint, error, optional, trailing, children, className }: FieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
          {optional && <span className="ml-1.5 font-normal normal-case tracking-normal text-muted/70">(optional)</span>}
        </label>
        {trailing && <span className="font-sans text-[0.75rem] text-muted">{trailing}</span>}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 font-sans text-[0.8rem] text-breaking">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 font-sans text-[0.8rem] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(htmlFor: string, error?: string, hint?: ReactNode): string | undefined {
  return error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
}
