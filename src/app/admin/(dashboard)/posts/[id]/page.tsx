import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminPostRow, getCategories } from "@/lib/admin/queries";
import { rowToForm } from "@/lib/admin/mappers";
import { PostEditor } from "@/components/admin/posts/PostEditor";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { supabase } = await requireAdmin();
  const row = await getAdminPostRow(supabase, params.id);
  return { title: row ? `Edit: ${row.title}` : "Edit post" };
}

export default async function EditPostPage({ params }: Props) {
  const { supabase } = await requireAdmin();
  const [row, categories] = await Promise.all([getAdminPostRow(supabase, params.id), getCategories(supabase)]);
  if (!row) notFound();

  return (
    <PostEditor
      key={row.id + (row.updated_at ?? "")}
      mode="edit"
      postId={row.id}
      initial={rowToForm(row)}
      categories={categories}
      meta={{ createdAt: row.created_at, expiresAt: row.expires_at, updatedAt: row.updated_at }}
    />
  );
}
