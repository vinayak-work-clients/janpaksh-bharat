"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Archive, ArchiveRestore, ArrowLeft, Inbox, Mail, MailOpen, Trash2 } from "lucide-react";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { TOPIC_TONE, firstLine, mailtoFor, whatsappFor, type AdminMessage } from "@/lib/admin/messages";
import { archiveMessage, deleteMessage, markRead, markUnread, restoreMessage } from "@/lib/admin/actions/messages";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { Badge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { ConfirmDialog } from "@/components/admin/ui/Dialog";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/Tabs";

export type InboxTab = "inbox" | "archived";

export interface InboxInitial {
  tab: InboxTab;
  unreadOnly: boolean;
  id?: string;
}

interface MessagesInboxProps {
  messages: AdminMessage[];
  initial: InboxInitial;
}

/** Keep ?tab, ?unread and ?id in the address bar without a navigation. */
function syncUrl(tab: InboxTab, unreadOnly: boolean, id: string | null) {
  const params = new URLSearchParams();
  if (tab === "archived") params.set("tab", "archived");
  if (unreadOnly) params.set("unread", "1");
  if (id) params.set("id", id);
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", `/admin/messages${qs ? `?${qs}` : ""}`);
}

export function MessagesInbox({ messages, initial }: MessagesInboxProps) {
  const router = useRouter();
  const [items, setItems] = useState(messages);
  const [tab, setTab] = useState<InboxTab>(initial.tab);
  const [unreadOnly, setUnreadOnly] = useState(initial.unreadOnly);
  const [selectedId, setSelectedId] = useState<string | null>(initial.id ?? null);
  const [toDelete, setToDelete] = useState<AdminMessage | null>(null);
  const [pending, startTransition] = useTransition();

  // Server refreshes win over optimistic state.
  useEffect(() => setItems(messages), [messages]);

  useEffect(() => syncUrl(tab, unreadOnly, selectedId), [tab, unreadOnly, selectedId]);

  const counts = useMemo(
    () => ({
      inbox: items.filter((m) => !m.archived).length,
      inboxUnread: items.filter((m) => !m.archived && !m.read).length,
      archived: items.filter((m) => m.archived).length,
    }),
    [items],
  );

  const visible = useMemo(
    () => items.filter((m) => (tab === "archived" ? m.archived : !m.archived)).filter((m) => !unreadOnly || !m.read),
    [items, tab, unreadOnly],
  );

  const selected = items.find((m) => m.id === selectedId) ?? null;

  const patchLocal = (id: string, patch: Partial<AdminMessage>) => setItems((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const run = (label: string | null, id: string, patch: Partial<AdminMessage>, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    patchLocal(id, patch);
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        if (label) toast.success(label);
        router.refresh();
      } else {
        toast.error("That didn't work", { description: r.error });
        router.refresh();
      }
    });
  };

  const open = (m: AdminMessage) => {
    setSelectedId(m.id);
    if (!m.read) run(null, m.id, { read: true }, () => markRead(m.id));
  };

  const onDelete = async () => {
    if (!toDelete) return;
    const id = toDelete.id;
    const r = await deleteMessage(id);
    if (r.ok) {
      setItems((list) => list.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
      toast.success("Message deleted");
      router.refresh();
    } else toast.error("Couldn't delete", { description: r.error });
  };

  if (messages.length === 0) {
    return (
      <Card>
        <EmptyState icon={<Inbox />} title="No messages yet" description="Everything sent through the contact form lands here. Unread messages show a badge in the sidebar." />
      </Card>
    );
  }

  const list = (
    <Card flush className={cn("min-w-0", pending && "opacity-70")}>
      <Tabs value={tab} onValueChange={(v) => { setTab(v as InboxTab); setSelectedId(null); }}>
        <div className="px-3 pt-2 sm:px-4">
          <TabsList>
            <TabsTrigger value="inbox">
              Inbox
              {counts.inboxUnread > 0 && <span className="inline-flex min-w-[1.4rem] items-center justify-center rounded-full bg-saffron px-1.5 py-0.5 text-[0.68rem] font-semibold text-ink">{counts.inboxUnread}</span>}
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
              {counts.archived > 0 && <span className="text-[0.75rem] text-muted">{counts.archived}</span>}
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2 sm:px-5">
          <label className="inline-flex min-h-[2.75rem] cursor-pointer items-center gap-2 font-sans text-[0.85rem] text-ink">
            <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="h-4 w-4 accent-[#E8862A]" />
            Unread only
          </label>
          <span className="font-sans text-[0.78rem] text-muted">{visible.length} of {tab === "inbox" ? counts.inbox : counts.archived}</span>
        </div>
        <TabsContent value="inbox">
          <MessageList items={visible} selectedId={selectedId} onOpen={open} empty={unreadOnly ? "Nothing unread" : "Inbox is empty"} />
        </TabsContent>
        <TabsContent value="archived">
          <MessageList items={visible} selectedId={selectedId} onOpen={open} empty={unreadOnly ? "Nothing unread in the archive" : "Nothing archived"} />
        </TabsContent>
      </Tabs>
    </Card>
  );

  const detail = selected ? (
    <MessageDetail
      message={selected}
      onBack={() => setSelectedId(null)}
      onToggleRead={() => (selected.read ? run("Marked as unread", selected.id, { read: false }, () => markUnread(selected.id)) : run("Marked as read", selected.id, { read: true }, () => markRead(selected.id)))}
      onArchive={() => (selected.archived ? run("Restored to the inbox", selected.id, { archived: false }, () => restoreMessage(selected.id)) : run("Archived", selected.id, { archived: true, read: true }, () => archiveMessage(selected.id)))}
      onDelete={() => setToDelete(selected)}
    />
  ) : (
    <Card className="hidden lg:block">
      <EmptyState icon={<Mail />} title="Pick a message" description="Choose a message on the left to read it and reply." />
    </Card>
  );

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
        <div className={cn(selected && "hidden lg:block")}>{list}</div>
        <div className={cn(!selected && "hidden lg:block")}>{detail}</div>
      </div>
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this message?"
        description={
          <>
            The message from <strong className="text-ink">{toDelete?.name}</strong> will be removed for good. Archive it instead if you might need it later.
          </>
        }
        confirmLabel="Delete message"
        onConfirm={onDelete}
      />
    </>
  );
}

function MessageList({ items, selectedId, onOpen, empty }: { items: AdminMessage[]; selectedId: string | null; onOpen: (m: AdminMessage) => void; empty: string }) {
  if (items.length === 0) return <EmptyState title={empty} className="py-10" />;
  return (
    <ul className="divide-y divide-rule">
      {items.map((m) => {
        const active = m.id === selectedId;
        return (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onOpen(m)}
              aria-current={active ? "true" : undefined}
              className={cn("flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2/60 sm:px-5", active && "bg-paper-2")}
            >
              <span aria-label={m.read ? undefined : "Unread"} className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-saffron")} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className={cn("truncate font-sans text-[0.9rem] text-ink", m.read ? "font-medium" : "font-semibold")}>{m.name}</span>
                  <time dateTime={m.createdAt} suppressHydrationWarning className="shrink-0 font-sans text-[0.72rem] text-muted">
                    {timeAgo(m.createdAt)}
                  </time>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <Badge tone={TOPIC_TONE[m.topic] ?? "muted"}>{m.topic}</Badge>
                </span>
                <span className={cn("clamp-1 mt-1 block font-sans text-[0.82rem]", m.read ? "text-muted" : "text-ink")}>{firstLine(m.message)}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MessageDetail({ message: m, onBack, onToggleRead, onArchive, onDelete }: { message: AdminMessage; onBack: () => void; onToggleRead: () => void; onArchive: () => void; onDelete: () => void }) {
  const wa = whatsappFor(m.phone);
  return (
    <Card flush as="section" className="min-w-0">
      <div className="border-b border-rule px-4 py-4 sm:px-5">
        <button type="button" onClick={onBack} className="mb-3 inline-flex min-h-[2.75rem] items-center gap-1.5 font-sans text-[0.85rem] font-medium text-muted hover:text-ink lg:hidden">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to inbox
        </button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-[1.35rem] font-semibold leading-tight text-ink">{m.name}</h2>
            <dl className="mt-2 grid gap-1 font-sans text-[0.85rem] text-muted">
              <div className="flex gap-2">
                <dt className="w-14 shrink-0">Email</dt>
                <dd className="break-all">
                  <a href={mailtoFor(m)} className="text-ink underline-offset-4 hover:underline">{m.email}</a>
                </dd>
              </div>
              {m.phone && (
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0">Phone</dt>
                  <dd>
                    <a href={`tel:${m.phone.replace(/\s+/g, "")}`} className="text-ink underline-offset-4 hover:underline">{m.phone}</a>
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="w-14 shrink-0">Topic</dt>
                <dd><Badge tone={TOPIC_TONE[m.topic] ?? "muted"}>{m.topic}</Badge></dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-14 shrink-0">Sent</dt>
                <dd className="text-ink">
                  <time dateTime={m.createdAt}>{formatDate(m.createdAt, "EEE d MMM yyyy, HH:mm")}</time>{" "}
                  <span suppressHydrationWarning className="text-muted">({timeAgo(m.createdAt)})</span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Badge tone={m.archived ? "outline" : m.read ? "muted" : "saffron"}>{m.archived ? "Archived" : m.read ? "Read" : "Unread"}</Badge>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-5">
        <p className="whitespace-pre-wrap font-sans text-[0.95rem] leading-relaxed text-ink">{m.message}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-rule px-4 py-3 sm:px-5">
        <Button href={mailtoFor(m)} external size="sm">
          <Mail className="h-4 w-4" aria-hidden="true" /> Reply by email
        </Button>
        {wa && (
          <Button href={wa} external size="sm" variant="secondary">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </Button>
        )}
        <span className="flex-1" />
        <Button variant="ghost" size="sm" onClick={onToggleRead}>
          {m.read ? <Mail className="h-4 w-4" aria-hidden="true" /> : <MailOpen className="h-4 w-4" aria-hidden="true" />}
          {m.read ? "Mark unread" : "Mark read"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onArchive}>
          {m.archived ? <ArchiveRestore className="h-4 w-4" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
          {m.archived ? "Restore" : "Archive"}
        </Button>
        <Button variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
        </Button>
      </div>
    </Card>
  );
}
