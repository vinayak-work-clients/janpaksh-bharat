"use client";

import { forwardRef, useCallback, useEffect, useRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/components/admin/ui/Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content instead of scrolling. */
  autoGrow?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, autoGrow = false, onInput, rows = 3, ...rest },
  ref,
) {
  const inner = useRef<HTMLTextAreaElement | null>(null);

  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      inner.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  const resize = useCallback(() => {
    const el = inner.current;
    if (!el || !autoGrow) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [autoGrow]);

  useEffect(() => {
    resize();
  });

  return (
    <textarea
      ref={setRefs}
      rows={rows}
      onInput={(e) => {
        resize();
        onInput?.(e);
      }}
      className={cn(fieldClass, "py-2.5 leading-relaxed", autoGrow ? "resize-none overflow-hidden" : "resize-y", className)}
      {...rest}
    />
  );
});
