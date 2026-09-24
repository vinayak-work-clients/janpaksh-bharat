"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const fieldClass =
  "w-full border border-rule bg-paper px-3.5 font-sans text-[0.95rem] text-ink placeholder:text-muted/60 transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/40 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-breaking aria-[invalid=true]:focus:ring-breaking/30";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn(fieldClass, "h-11", className)} {...rest} />;
});
