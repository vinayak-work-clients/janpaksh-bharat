import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertOctagon, ArrowRight, Inbox, Newspaper } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { STORAGE_FREE_TIER_BYTES, getOverview, getStorageUsage } from "@/lib/admin/queries";
import { formatBytes } from "@/lib/admin/storage";
import { TOPIC_TONE, firstLine } from "@/lib/admin/messages";
import { formatDate, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/admin/ui/Badge";
import { Card, StatCard } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Button } from "@/components/admin/ui/Button";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ExpiryBadge, StatusBadge } from "@/components/admin/posts/badges";
import { newPostHref, POST_TYPE_OPTIONS } from "@/components/admin/post-types";
import { PostsPerDay } from "@/components/admin/overview/PostsPerDay";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();
  const [o, storage] = await Promise.all([getOverview(supabase), getStorageUsage()]);
  const storagePct = Math.min(100, Math.round((storage.bytes / STORAGE_FREE_TIER_BYTES) * 100));

  return (
    <div className="grid gap-6">
      {/* Counts — every card links to the list it counts */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Live posts" value={o.live} href="/admin/posts?status=published" />
        <StatCard label="Drafts" value={o.drafts} tone="muted" href="/admin/posts?status=draft" />
        <StatCard label="Expiring in 7 days" value={o.expiringSoon} tone={o.expiringSoon ? "saffron" : "ink"} href="/admin/posts?status=published&sort=expires" />
        <StatCard label="Breaking now" value={o.breakingNow} tone={o.breakingNow ? "breaking" : "ink"} href="/admin/posts?status=published&breaking=1" />
        <StatCard label="Unread messages" value={o.unread} tone={o.unread ? "saffron" : "ink"} href="/admin/messages?unread=1" />
        <StatCard
          label="Storage used"
          value={storage.error ? "—" : formatBytes(storage.bytes)}
          tone={storagePct >= 80 ? "breaking" : "ink"}
          hint={
            storage.error ? (
              <span title={storage.error}>Couldn&rsquo;t read the media bucket</span>
            ) : (
              <>
                {storagePct}% of the 1 GB free tier · {storage.files} file{storage.files === 1 ? "" : "s"} · refreshed every 5 min
              </>
            )
          }
          href="/admin/settings?tab=site"
        />
      </div>

      {o.expiringUrgent.length > 0 && (
        <Card
          as="section"
          flush
          className="border-breaking"
          title={
            <span className="inline-flex items-center gap-2 text-breaking">
              <AlertOctagon className="h-4 w-4" aria-hidden="true" /> Expiring in 48 hours
            </span>
          }
          action={
            <Link href="/admin/posts?status=published&sort=expires" className="inline-flex items-center gap-1 font-sans text-[0.8rem] font-medium text-ink hover:text-saffron-dark">
              All expiring <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          }
        >
          <ul className="divide-y divide-rule">
            {o.expiringUrgent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-paper-2/60 sm:px-5">
                  <span className="relative h-10 w-14 shrink-0 overflow-hidden bg-paper-2">
                    <Image src={p.coverImage} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="clamp-1 block font-sans text-[0.9rem] font-medium text-ink">{p.title}</span>
                    <span className="mt-0.5 block font-sans text-[0.75rem] text-muted">Auto-deletes {formatDate(p.expiresAt, "d MMM, HH:mm")}</span>
                  </span>
                  <span className="whitespace-nowrap font-sans text-[0.85rem] font-semibold text-breaking">
                    {p.hoursLeft <= 1 ? "under an hour" : `${p.hoursLeft} h left`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

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

        <div className="grid content-start gap-6">
          <Card title="Posts per day · last 7 days">
            <PostsPerDay days={o.perDay} />
          </Card>

          <Card
            title="Expiring soon"
            flush
            action={
              <Link href="/admin/posts?status=published&sort=expires" className="inline-flex items-center gap-1 font-sans text-[0.8rem] font-medium text-ink hover:text-saffron-dark">
                By expiry <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          >
            {o.expiring.length === 0 ? (
              <EmptyState title="Nothing expiring this week" description="Live posts auto-delete 30 days after upload. Anything within 7 days shows here." className="py-10" />
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

      <Card
        title="Unread messages"
        flush
        action={
          <Link href="/admin/messages?unread=1" className="inline-flex items-center gap-1 font-sans text-[0.8rem] font-medium text-ink hover:text-saffron-dark">
            Open inbox <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      >
        {o.latestUnread.length === 0 ? (
          <EmptyState icon={<Inbox />} title="Inbox zero" description="New contact-form messages will show up here." className="py-10" />
        ) : (
          <ul className="divide-y divide-rule">
            {o.latestUnread.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages?id=${m.id}`} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-paper-2/60 sm:px-5">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-saffron" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate font-sans text-[0.9rem] font-semibold text-ink">{m.name}</span>
                      <span className="shrink-0 font-sans text-[0.72rem] text-muted">{timeAgo(m.createdAt)}</span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <Badge tone={TOPIC_TONE[m.topic] ?? "muted"}>{m.topic}</Badge>
                    </span>
                    <span className="clamp-1 mt-1 block font-sans text-[0.82rem] text-ink">{firstLine(m.message)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
