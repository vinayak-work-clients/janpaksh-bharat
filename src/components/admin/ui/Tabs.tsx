"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Tabs = RadixTabs.Root;
export const TabsContent = RadixTabs.Content;

export function TabsList({ children, className, ...rest }: RadixTabs.TabsListProps) {
  return (
    <RadixTabs.List className={cn("inline-flex w-full border-b border-rule", className)} {...rest}>
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({ children, className, ...rest }: RadixTabs.TabsTriggerProps & { children: ReactNode }) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "-mb-px flex h-11 flex-1 items-center justify-center gap-2 border-b-2 border-transparent px-3 font-sans text-[0.85rem] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/50 data-[state=active]:border-saffron data-[state=active]:text-ink",
        className,
      )}
      {...rest}
    >
      {children}
    </RadixTabs.Trigger>
  );
}
