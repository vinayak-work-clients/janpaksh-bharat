"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  placeholder?: string;
  describedBy?: string;
}

/** Chip input: Enter or comma adds, Backspace on empty removes the last chip. */
export function TagInput({ id, value, onChange, max = 12, placeholder = "Add a tag and press Enter", describedBy }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim().replace(/^#/, "").replace(/,+$/, "").trim();
    if (!tag) return;
    if (value.length >= max) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-[2.75rem] flex-wrap items-center gap-1.5 border border-rule bg-paper px-2 py-1.5 transition-colors focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/40",
      )}
      onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}
    >
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-paper-2 py-1 pl-2.5 pr-1 font-sans text-[0.8rem] font-medium text-ink">
          #{tag}
          <button
            type="button"
            aria-label={`Remove tag ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-ink/10 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={value.length ? "" : placeholder}
        aria-describedby={describedBy}
        disabled={value.length >= max}
        className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 font-sans text-[0.9rem] text-ink placeholder:text-muted/60 focus:outline-none"
      />
    </div>
  );
}
