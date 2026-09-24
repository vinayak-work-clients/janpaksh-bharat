"use client";

import * as Radix from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export const TooltipProvider = Radix.Provider;

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

/** Wrap an icon button; the child must accept a ref (use a native element). */
export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <Radix.Root delayDuration={300}>
      <Radix.Trigger asChild>{children}</Radix.Trigger>
      <Radix.Portal>
        <Radix.Content
          side={side}
          sideOffset={6}
          className="z-[110] max-w-[16rem] rounded-sm bg-ink px-2.5 py-1.5 font-sans text-[0.75rem] font-medium text-paper shadow-lg"
        >
          {content}
          <Radix.Arrow className="fill-ink" />
        </Radix.Content>
      </Radix.Portal>
    </Radix.Root>
  );
}
