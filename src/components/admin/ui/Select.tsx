"use client";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: ReactNode;
  /** Secondary text (e.g. the Hindi name). */
  hint?: ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  "aria-describedby"?: string;
}

export function Select({ value, onValueChange, options, placeholder = "Choose…", id, name, disabled, invalid, className, ...aria }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange} name={name} disabled={disabled}>
      <RadixSelect.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={aria["aria-describedby"]}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 border border-rule bg-paper px-3.5 text-left font-sans text-[0.95rem] text-ink transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/40 data-[placeholder]:text-muted/60 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-breaking",
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-[100] max-h-[min(20rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden border border-rule bg-paper shadow-xl"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((o) => (
              <RadixSelect.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="relative flex min-h-[2.75rem] cursor-pointer select-none items-center gap-3 px-3 py-2 font-sans text-[0.9rem] text-ink outline-none data-[highlighted]:bg-paper-2 data-[disabled]:opacity-40"
              >
                <span className="flex-1">
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                  {o.hint && <span className="ml-2 text-[0.8rem] text-muted">{o.hint}</span>}
                </span>
                <RadixSelect.ItemIndicator>
                  <Check className="h-4 w-4 text-saffron-dark" aria-hidden="true" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
