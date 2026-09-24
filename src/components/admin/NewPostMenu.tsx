"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronDown, Headphones, PenLine, Play, Plus, Siren } from "lucide-react";
import type { PostType } from "@/types/content";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/admin/ui/DropdownMenu";

export const POST_TYPE_OPTIONS: Array<{ type: PostType; label: string; hint: string; Icon: typeof Camera }> = [
  { type: "image", label: "Photo news", hint: "A story led by a photograph", Icon: Camera },
  { type: "blog", label: "Blog", hint: "Long-form writing", Icon: PenLine },
  { type: "video", label: "Video", hint: "Upload or embed a video", Icon: Play },
  { type: "podcast", label: "Podcast", hint: "Upload audio or embed an episode", Icon: Headphones },
  { type: "breaking", label: "Breaking", hint: "Goes into the ticker immediately", Icon: Siren },
];

export const newPostHref = (type: PostType) => `/admin/posts/new?type=${type}`;

interface NewPostMenuProps {
  /** "split" = button + chevron (top bar); "fab" = floating round button (mobile). */
  variant?: "split" | "fab";
  className?: string;
}

export function NewPostMenu({ variant = "split", className }: NewPostMenuProps) {
  const router = useRouter();

  const items = (
    <DropdownMenuContent align={variant === "fab" ? "end" : "end"} side={variant === "fab" ? "top" : "bottom"} className="min-w-[14rem]">
      <DropdownMenuLabel>New post</DropdownMenuLabel>
      {POST_TYPE_OPTIONS.map(({ type, label, hint, Icon }) => (
        <DropdownMenuItem key={type} icon={<Icon />} onSelect={() => router.push(newPostHref(type))}>
          <span className="flex flex-col">
            <span className={cn(type === "breaking" && "text-breaking")}>{label}</span>
            <span className="text-[0.75rem] text-muted">{hint}</span>
          </span>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );

  if (variant === "fab") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="New post"
            className={cn(
              "fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-ink shadow-xl transition-colors hover:bg-saffron-dark hover:text-paper lg:hidden",
              className,
            )}
          >
            <Plus className="h-7 w-7" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        {items}
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("inline-flex items-stretch overflow-hidden rounded-full border border-saffron bg-saffron text-ink", className)}>
      <Link
        href={newPostHref("image")}
        className="inline-flex h-11 items-center gap-2 pl-4 pr-3 font-sans text-[0.875rem] font-medium transition-colors hover:bg-saffron-dark hover:text-paper"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        <span>New post</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Choose post type"
            className="inline-flex w-11 items-center justify-center border-l border-ink/15 transition-colors hover:bg-saffron-dark hover:text-paper"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        {items}
      </DropdownMenu>
    </div>
  );
}
