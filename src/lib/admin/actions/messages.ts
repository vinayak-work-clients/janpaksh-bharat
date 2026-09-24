"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { getMessageRow } from "@/lib/admin/queries";

export type MessageActionResult = { ok: true; id: string } | { ok: false; error: string };

/** The sidebar badge lives in the dashboard layout, so the whole /admin layout re-renders. */
function revalidateInbox() {
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/messages");
}

async function patch(id: string, values: { read?: boolean; archived?: boolean }): Promise<MessageActionResult> {
  const { supabase } = await requireAdmin();
  const row = await getMessageRow(supabase, id);
  if (!row) return { ok: false, error: "This message no longer exists." };
  const { error } = await supabase.from("contact_messages").update(values).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateInbox();
  return { ok: true, id };
}

export async function markRead(id: string) {
  return patch(id, { read: true });
}

export async function markUnread(id: string) {
  return patch(id, { read: false });
}

export async function archiveMessage(id: string) {
  return patch(id, { archived: true, read: true });
}

export async function restoreMessage(id: string) {
  return patch(id, { archived: false });
}

export async function deleteMessage(id: string): Promise<MessageActionResult> {
  const { supabase } = await requireAdmin();
  const row = await getMessageRow(supabase, id);
  if (!row) return { ok: false, error: "This message no longer exists." };
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateInbox();
  return { ok: true, id };
}
