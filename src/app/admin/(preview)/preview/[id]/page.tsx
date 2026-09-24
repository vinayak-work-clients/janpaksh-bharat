import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminPostRow } from "@/lib/admin/queries";
import { rowToPost } from "@/lib/data/mappers";
import { getMoreInSection, getRelatedPosts } from "@/lib/data/posts";
import { adminStatus } from "@/lib/admin/expiry";
import { ArticleView } from "@/components/article/ArticleView";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { supabase } = await requireAdmin();
  const row = await getAdminPostRow(supabase, params.id);
  return { title: row ? `Preview: ${row.title}` : "Preview" };
}

/** Renders any post, drafts included, exactly as the public article page would. */
export default async function PreviewPage({ params }: Props) {
  const { supabase } = await requireAdmin();
  const row = await getAdminPostRow(supabase, params.id);
  if (!row) notFound();

  const post = rowToPost(row);
  const [related, moreIn] = await Promise.all([getRelatedPosts(post, 3), getMoreInSection(post, 3)]);
  const status = adminStatus(row.status, row.expires_at);

  return (
    <>
      <div className="sticky top-0 z-[60] border-b border-paper/10 bg-ink text-paper">
        <div className="container-editorial flex min-h-[2.75rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5 font-sans text-[0.8rem]">
          <p className="inline-flex items-center gap-2">
            <Eye className="h-4 w-4 text-saffron" aria-hidden="true" />
            <span className="font-semibold uppercase tracking-[0.14em] text-saffron">Preview — not public</span>
            <span aria-hidden="true" className="text-paper/40">·</span>
            <span className="capitalize text-paper/80">{status}</span>
            {status === "published" && (
              <>
                <span aria-hidden="true" className="text-paper/40">·</span>
                <a href={`/news/${row.slug}`} target="_blank" rel="noopener noreferrer" className="text-paper/80 underline-offset-4 hover:underline">
                  Open live page
                </a>
              </>
            )}
          </p>
          <Link href={`/admin/posts/${row.id}`} className="inline-flex min-h-[2.25rem] items-center gap-1.5 font-medium text-paper hover:text-saffron-light">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to editor
          </Link>
        </div>
      </div>
      <ArticleView post={post} related={related} moreIn={moreIn} />
    </>
  );
}
