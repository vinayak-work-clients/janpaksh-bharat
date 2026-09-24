import { Camera, Headphones, PenLine, Play, Siren } from "lucide-react";
import type { PostType } from "@/types/content";

/**
 * Post types for the "New post" menus and the overview's quick-create row.
 * Plain module (no "use client") so server components can iterate it.
 */
export const POST_TYPE_OPTIONS: Array<{ type: PostType; label: string; hint: string; Icon: typeof Camera }> = [
  { type: "image", label: "Photo news", hint: "A story led by a photograph", Icon: Camera },
  { type: "blog", label: "Blog", hint: "Long-form writing", Icon: PenLine },
  { type: "video", label: "Video", hint: "Upload or embed a video", Icon: Play },
  { type: "podcast", label: "Podcast", hint: "Upload audio or embed an episode", Icon: Headphones },
  { type: "breaking", label: "Breaking", hint: "Goes into the ticker immediately", Icon: Siren },
];

export const newPostHref = (type: PostType) => `/admin/posts/new?type=${type}`;
