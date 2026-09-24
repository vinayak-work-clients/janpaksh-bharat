import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getCategories } from "@/lib/admin/queries";
import { POST_TYPES } from "@/lib/admin/schemas";
import { emptyForm } from "@/lib/admin/mappers";
import type { PostType } from "@/types/content";
import { PostEditor } from "@/components/admin/posts/PostEditor";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage({ searchParams }: { searchParams: { type?: string } }) {
  const { supabase } = await requireAdmin();
  const type = (POST_TYPES as readonly string[]).includes(searchParams.type ?? "") ? (searchParams.type as PostType) : "image";
  const categories = await getCategories(supabase);
  // key forces a fresh editor when switching type via the New post menu.
  return <PostEditor key={type} mode="new" initial={emptyForm(type)} categories={categories} />;
}
