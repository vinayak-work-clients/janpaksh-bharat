"use client";

import * as Radix from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DropdownMenu = Radix.Root;
export const DropdownMenuTrigger = Radix.Trigger;
export const DropdownMenuSeparator = () => <Radix.Separator className="my-1 h-px bg-rule" />;
export const DropdownMenuLabel = ({ children }: { children: ReactNode }) => (
  <Radix.Label className="px-3 py-1.5 font-sans text-kicker uppercase text-muted">{children}</Radix.Label>
);

export function DropdownMenuContent({ children, className, align = "end", ...rest }: Radix.DropdownMenuContentProps) {
  return (
    <Radix.Portal>
      <Radix.Content
        align={align}
        sideOffset={6}
        className={cn("z-[100] min-w-[12rem] border border-rule bg-paper p-1 shadow-xl", className)}
        {...rest}
      >
        {children}
      </Radix.Content>
    </Radix.Portal>
  );
}

interface ItemProps extends Radix.DropdownMenuItemProps {
  icon?: ReactNode;
  tone?: "default" | "danger";
}

export function DropdownMenuItem({ children, className, icon, tone = "default", ...rest }: ItemProps) {
  return (
    <Radix.Item
      className={cn(
        "flex min-h-[2.75rem] cursor-pointer select-none items-center gap-3 px-3 py-2 font-sans text-[0.9rem] outline-none transition-colors data-[highlighted]:bg-paper-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
        tone === "danger" ? "text-breaking" : "text-ink",
        className,
      )}
      {...rest}
    >
      {icon && <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </Radix.Item>
  );
}
