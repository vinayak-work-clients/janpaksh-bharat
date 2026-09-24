import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllAdminPosts } from "@/lib/admin/queries";
import { PostsTable, type PostsFilters } from "@/components/admin/posts/PostsTable";

export const metadata: Metadata = { title: "Posts" };

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function PostsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const posts = await getAllAdminPosts(supabase);

  const initial: Partial<PostsFilters> = {
    status: (["published", "draft", "expired"] as const).find((s) => s === one(searchParams.status)),
    type: one(searchParams.type),
    section: one(searchParams.section),
    breaking: one(searchParams.breaking) === "1",
    sort: one(searchParams.sort) === "expires" ? "expires" : "published",
    q: one(searchParams.q) ?? "",
  };

  return <PostsTable posts={posts} initial={initial} />;
}
