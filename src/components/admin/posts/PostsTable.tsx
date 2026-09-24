"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Copy, ExternalLink, MoreHorizontal, Newspaper, Pencil, Search, Siren, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { PostType } from "@/types/content";
import { sections } from "@/config/sections";
import { cn, formatDate } from "@/lib/utils";
import { adminStatus, type AdminStatus } from "@/lib/admin/expiry";
import type { AdminPost } from "@/lib/admin/mappers";
import { deletePost, duplicatePost, toggleBreaking } from "@/lib/admin/actions/posts";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Input } from "@/components/admin/ui/Input";
import { Select } from "@/components/admin/ui/Select";
import { ConfirmDialog } from "@/components/admin/ui/Dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/admin/ui/DropdownMenu";
import { ExpiryBadge, StatusBadge } from "@/components/admin/posts/badges";
import { newPostHref, POST_TYPE_OPTIONS } from "@/components/admin/NewPostMenu";

export interface PostsFilters {
  q: string;
  type?: string;
  section?: string;
  status?: AdminStatus;
  breaking: boolean;
  sort: "published" | "expires";
}

const ALL = "__all";

const TYPE_LABEL: Record<PostType, string> = { image: "Photo", blog: "Blog", video: "Video", podcast: "Podcast", breaking: "Breaking" };

export function PostsTable({ posts, initial }: { posts: AdminPost[]; initial?: Partial<PostsFilters> }) {
  const router = useRouter();
  const [q, setQ] = useState(initial?.q ?? "");
  const [type, setType] = useState(initial?.type ?? ALL);
  const [section, setSection] = useState(initial?.section ?? ALL);
  const [status, setStatus] = useState<string>(initial?.status ?? ALL);
  const [breaking, setBreaking] = useState(initial?.breaking ?? false);
  const [sort, setSort] = useState<PostsFilters["sort"]>(initial?.sort ?? "published");
  const [toDelete, setToDelete] = useState<AdminPost | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const now = new Date();
    const list = posts.filter((p) => {
      if (needle && !p.title.toLowerCase().includes(needle) && !p.slug.includes(needle) && !(p.titleHindi ?? "").includes(q.trim())) return false;
      if (type !== ALL && p.type !== type) return false;
      if (section !== ALL && p.section !== section) return false;
      if (status !== ALL && adminStatus(p.status, p.expiresAt, now) !== status) return false;
      if (breaking && !p.isBreaking) return false;
      return true;
    });
    return list.sort((a, b) =>
      sort === "expires" ? a.expiresAt.localeCompare(b.expiresAt) : b.publishedAt.localeCompare(a.publishedAt),
    );
  }, [posts, q, type, section, status, breaking, sort]);

  const hasFilters = q || type !== ALL || section !== ALL || status !== ALL || breaking;
  const reset = () => {
    setQ("");
    setType(ALL);
    setSection(ALL);
    setStatus(ALL);
    setBreaking(false);
  };

  const run = (label: string, fn: () => Promise<{ ok: boolean; error?: string; warning?: string }>) =>
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        toast.success(label, r.warning ? { description: r.warning } : undefined);
        router.refresh();
      } else toast.error("That didn't work", { description: r.error });
    });

  const onDuplicate = (p: AdminPost) =>
    startTransition(async () => {
      const r = await duplicatePost(p.id);
      if (r.ok) {
        toast.success("Duplicated as a draft", { description: "Opening the copy so you can edit it." });
        router.push(`/admin/posts/${r.id}`);
      } else toast.error("Couldn't duplicate", { description: r.error });
    });

  const onToggleBreaking = (p: AdminPost) =>
    run(p.isBreaking ? "Removed from Breaking" : "Marked as Breaking", () => toggleBreaking(p.id));

  const onDelete = async () => {
    if (!toDelete) return;
    const r = await deletePost(toDelete.id);
    if (r.ok) {
      toast.success("Post deleted", r.warning ? { description: r.warning } : undefined);
      router.refresh();
    } else toast.error("Couldn't delete", { description: r.error });
  };

  if (posts.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Newspaper />}
          title="No posts yet"
          description="Everything you publish appears here, with its 30-day countdown. Start with a photo story or a blog."
          action={<Button href={newPostHref("image")}>Create your first post</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Toolbar */}
      <div className="grid gap-3 md:grid-cols-12">
        <div className="relative md:col-span-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or slug"
            aria-label="Search posts"
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-4">
          <Select
            value={type}
            onValueChange={setType}
            options={[{ value: ALL, label: "All types" }, ...POST_TYPE_OPTIONS.map((t) => ({ value: t.type, label: t.label }))]}
          />
          <Select
            value={section}
            onValueChange={setSection}
            options={[{ value: ALL, label: "All sections" }, ...sections.map((s) => ({ value: s.slug, label: s.name, hint: s.nameHindi }))]}
          />
          <Select
            value={status}
            onValueChange={setStatus}
            options={[
              { value: ALL, label: "Any status" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
              { value: "expired", label: "Expired" },
            ]}
          />
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as PostsFilters["sort"])}
            options={[
              { value: "published", label: "Newest first" },
              { value: "expires", label: "Expiring soonest" },
            ]}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-[2.75rem] cursor-pointer items-center gap-2 font-sans text-[0.85rem] text-ink">
          <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} className="h-4 w-4 accent-[#C8102E]" />
          Breaking only
        </label>
        <span className="font-sans text-[0.8rem] text-muted">
          {filtered.length} of {posts.length}
        </span>
        {hasFilters && (
          <button type="button" onClick={reset} className="inline-flex min-h-[2.75rem] items-center gap-1 font-sans text-[0.8rem] font-medium text-muted hover:text-ink">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="Nothing matches" description="Try a different search or clear the filters." action={<Button variant="ghost" onClick={reset}>Clear filters</Button>} />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card flush className={cn("hidden md:block", pending && "opacity-60")}>
            <table className="w-full border-collapse font-sans text-[0.875rem]">
              <thead>
                <tr className="border-b border-rule text-left text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  <th scope="col" className="px-4 py-3 font-semibold">Post</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Type</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Section</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Published</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Expires</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {filtered.map((p) => (
                  <tr key={p.id} className="group transition-colors hover:bg-paper-2/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/posts/${p.id}`} className="relative h-12 w-[4.5rem] shrink-0 overflow-hidden bg-paper-2">
                          <Image src={p.coverImage} alt="" fill sizes="72px" className="object-cover" />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/admin/posts/${p.id}`} className="clamp-1 block font-medium text-ink hover:text-saffron-dark">
                            {p.isBreaking && <Siren className="mr-1 inline h-3.5 w-3.5 text-breaking" aria-label="Breaking" />}
                            {p.title}
                          </Link>
                          <p className="clamp-1 mt-0.5 text-[0.75rem] text-muted">/news/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><TypeBadge type={p.type} /></td>
                    <td className="px-3 py-3 text-ink">{sections.find((s) => s.slug === p.section)?.name ?? p.section}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} expiresAt={p.expiresAt} /></td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDate(p.publishedAt, "d MMM yyyy")}</td>
                    <td className="px-3 py-3"><ExpiryBadge expiresAt={p.expiresAt} /></td>
                    <td className="px-3 py-3 text-right">
                      <RowActions post={p} onDelete={() => setToDelete(p)} onDuplicate={() => onDuplicate(p)} onToggleBreaking={() => onToggleBreaking(p)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <ul className={cn("grid gap-3 md:hidden", pending && "opacity-60")}>
            {filtered.map((p) => (
              <li key={p.id} className="border border-rule bg-paper p-3">
                <div className="flex gap-3">
                  <Link href={`/admin/posts/${p.id}`} className="relative h-20 w-24 shrink-0 overflow-hidden bg-paper-2">
                    <Image src={p.coverImage} alt="" fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/posts/${p.id}`} className="clamp-2 block font-sans text-[0.95rem] font-medium leading-snug text-ink">
                      {p.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <TypeBadge type={p.type} />
                      <StatusBadge status={p.status} expiresAt={p.expiresAt} />
                    </div>
                  </div>
                  <RowActions post={p} onDelete={() => setToDelete(p)} onDuplicate={() => onDuplicate(p)} onToggleBreaking={() => onToggleBreaking(p)} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-rule pt-2 font-sans text-[0.78rem] text-muted">
                  <span>{sections.find((s) => s.slug === p.section)?.name ?? p.section} · {formatDate(p.publishedAt, "d MMM")}</span>
                  <span className="inline-flex items-center gap-1">Expires <ExpiryBadge expiresAt={p.expiresAt} /></span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this post?"
        description={
          <>
            <strong className="text-ink">“{toDelete?.title}”</strong> will be removed from the site immediately, along with its uploaded files. This cannot be undone.
          </>
        }
        confirmLabel="Delete post"
        onConfirm={onDelete}
      />
    </div>
  );
}

function RowActions({ post, onDelete, onDuplicate, onToggleBreaking }: { post: AdminPost; onDelete: () => void; onDuplicate: () => void; onToggleBreaking: () => void }) {
  const router = useRouter();
  const live = adminStatus(post.status, post.expiresAt) === "published";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={`Actions for ${post.title}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink">
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<Pencil />} onSelect={() => router.push(`/admin/posts/${post.id}`)}>Edit</DropdownMenuItem>
        <DropdownMenuItem icon={<ExternalLink />} disabled={!live} onSelect={() => window.open(`/news/${post.slug}`, "_blank", "noopener")}>
          View on site
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Copy />} onSelect={onDuplicate}>Duplicate</DropdownMenuItem>
        <DropdownMenuItem icon={<Siren />} onSelect={onToggleBreaking}>{post.isBreaking ? "Remove from Breaking" : "Mark as Breaking"}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 />} tone="danger" onSelect={onDelete}>Delete…</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { TYPE_LABEL };
