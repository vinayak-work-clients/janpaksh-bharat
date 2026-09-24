"use client";

import * as RadixSwitch from "@radix-ui/react-switch";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
  id?: string;
  name?: string;
  disabled?: boolean;
  tone?: "saffron" | "breaking";
  className?: string;
}

/** Labelled toggle with a 44px tall hit area. */
export function Switch({ checked, onCheckedChange, label, hint, id, name, disabled, tone = "saffron", className }: SwitchProps) {
  return (
    <label className={cn("flex min-h-[2.75rem] cursor-pointer items-start justify-between gap-4 py-1", disabled && "cursor-not-allowed opacity-60", className)}>
      <span className="flex-1">
        <span className="block font-sans text-[0.9rem] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block font-sans text-[0.8rem] leading-snug text-muted">{hint}</span>}
      </span>
      <RadixSwitch.Root
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-full border border-rule bg-paper-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/50",
          tone === "saffron" ? "data-[state=checked]:border-saffron data-[state=checked]:bg-saffron" : "data-[state=checked]:border-breaking data-[state=checked]:bg-breaking",
        )}
      >
        <RadixSwitch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-paper shadow transition-transform data-[state=checked]:translate-x-[1.45rem] data-[state=checked]:bg-paper" />
      </RadixSwitch.Root>
    </label>
  );
}
