import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { getOverview } from "@/lib/admin/queries";
import { formatDate } from "@/lib/utils";
import { Card, StatCard } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Button } from "@/components/admin/ui/Button";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ExpiryBadge, StatusBadge } from "@/components/admin/posts/badges";
import { newPostHref, POST_TYPE_OPTIONS } from "@/components/admin/NewPostMenu";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();
  const o = await getOverview(supabase);

  return (
    <div className="grid gap-6">
      {/* Counts */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Live posts" value={o.live} href="/admin/posts?status=published" />
        <StatCard label="Drafts" value={o.drafts} tone="muted" href="/admin/posts?status=draft" />
        <StatCard label="Expiring in 7 days" value={o.expiringSoon} tone={o.expiringSoon ? "saffron" : "ink"} href="/admin/posts?sort=expires" />
        <StatCard label="Breaking now" value={o.breakingNow} tone={o.breakingNow ? "breaking" : "ink"} href="/admin/posts?breaking=1" />
        <StatCard label="Unread messages" value={o.unread} tone={o.unread ? "saffron" : "ink"} href="/admin/messages" />
      </div>

      {/* Quick create */}
      <Card title="Quick create">
        <div className="flex flex-wrap gap-2">
          {POST_TYPE_OPTIONS.map(({ type, label, Icon }) => (
            <Button key={type} href={newPostHref(type)} variant={type === "breaking" ? "danger" : "ghost"} size="md">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Recent posts"
          flush
          action={
            <Link href="/admin/posts" className="inline-flex items-center gap-1 font-sans text-[0.8rem] font-medium text-ink hover:text-saffron-dark">
              All posts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        >
          {o.recent.length === 0 ? (
            <EmptyState icon={<Newspaper />} title="No posts yet" description="Your first story will show up here." action={<Button href={newPostHref("image")}>Create your first post</Button>} />
          ) : (
            <ul className="divide-y divide-rule">
              {o.recent.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-2/60 sm:px-5">
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-paper-2">
                      <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="clamp-1 block font-sans text-[0.9rem] font-medium text-ink">{p.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <TypeBadge type={p.type} />
                        <StatusBadge status={p.status} expiresAt={p.expiresAt} />
                        <span className="font-sans text-[0.75rem] text-muted">{formatDate(p.updatedAt ?? p.createdAt, "d MMM, HH:mm")}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Expiring soon" flush>
          {o.expiring.length === 0 ? (
            <EmptyState title="Nothing expiring this week" description="Live posts auto-delete 30 days after upload. Anything within 7 days shows here." />
          ) : (
            <ul className="divide-y divide-rule">
              {o.expiring.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-2/60 sm:px-5">
                    <span className="min-w-0 flex-1">
                      <span className="clamp-1 block font-sans text-[0.9rem] font-medium text-ink">{p.title}</span>
                      <span className="mt-0.5 block font-sans text-[0.75rem] text-muted">Auto-deletes {formatDate(p.expiresAt, "d MMM yyyy")}</span>
                    </span>
                    <ExpiryBadge expiresAt={p.expiresAt} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
