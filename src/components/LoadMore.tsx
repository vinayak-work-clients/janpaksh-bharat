"use client";

import { Children, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface LoadMoreProps {
  /** Pre-rendered items (server components are fine); revealed `pageSize` at a time. */
  children: ReactNode;
  pageSize?: number;
  className?: string;
  /** Count label, e.g. "stories". */
  noun?: string;
}

export function LoadMore({ children, pageSize = 12, className, noun = "stories" }: LoadMoreProps) {
  const items = Children.toArray(children);
  const [shown, setShown] = useState(pageSize);
  const visible = items.slice(0, shown);
  const remaining = items.length - shown;

  return (
    <>
      <div className={className}>{visible}</div>
      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button variant="ghost" onClick={() => setShown((s) => s + pageSize)}>
            Load {Math.min(remaining, pageSize)} more
          </Button>
          <span className="font-sans text-[0.78rem] text-muted">
            Showing {visible.length} of {items.length} {noun}
          </span>
        </div>
      )}
    </>
  );
}
