"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScaledPreviewProps {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  /** Caption under the box; defaults to "W×H · shown at N%". */
  caption?: ReactNode;
}

/**
 * Renders `children` inside a box of exactly width×height CSS pixels, then
 * scales the whole box down to fit its container. The creative is laid out
 * at its real slot size, so what you see is what the site renders.
 */
export function ScaledPreview({ width, height, children, className, caption }: ScaledPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<number>(width);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setAvailable(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = Math.min(1, available / width);
  return (
    <div ref={ref} className={cn("w-full", className)}>
      <div className="relative overflow-hidden" style={{ height: Math.round(height * scale) }}>
        <div
          style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="absolute left-0 top-0 border border-rule bg-paper-2"
        >
          {children}
        </div>
      </div>
      <p className="mt-1.5 font-sans text-[0.72rem] text-muted">
        {caption ?? (
          <>
            {width}×{height}
            {scale < 1 && <> · shown at {Math.round(scale * 100)}%</>}
          </>
        )}
      </p>
    </div>
  );
}
