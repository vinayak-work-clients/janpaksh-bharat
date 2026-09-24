import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllMessages } from "@/lib/admin/queries";
import { MessagesInbox, type InboxInitial } from "@/components/admin/messages/MessagesInbox";

export const metadata: Metadata = { title: "Messages" };

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function MessagesPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const messages = await getAllMessages(supabase);
  const id = one(searchParams.id);
  const initial: InboxInitial = {
    tab: one(searchParams.tab) === "archived" ? "archived" : "inbox",
    unreadOnly: one(searchParams.unread) === "1",
    id: id && messages.some((m) => m.id === id) ? id : undefined,
  };
  // A deep link to an archived message opens the right tab.
  if (initial.id && messages.find((m) => m.id === initial.id)?.archived) initial.tab = "archived";
  return <MessagesInbox messages={messages} initial={initial} />;
}
