/** Contact inbox helpers (client-safe). */
import type { ContactMessageRow } from "@/lib/supabase/types";
import type { BadgeTone } from "@/components/admin/ui/Badge";

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

export function rowToAdminMessage(row: ContactMessageRow): AdminMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    topic: row.topic,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
    archived: row.archived,
  };
}

export const TOPIC_TONE: Record<string, BadgeTone> = {
  "Story tip": "saffron",
  "Advertising & partnerships": "success",
  Podcast: "ink",
  Press: "outline",
  Other: "muted",
};

export const REPLY_SUBJECT = "Re: your message to Janpaksh Bharat";

export function mailtoFor(m: Pick<AdminMessage, "email" | "name">): string {
  return `mailto:${m.email}?subject=${encodeURIComponent(REPLY_SUBJECT)}`;
}

/** wa.me link from a free-form phone; Indian 10-digit numbers get +91. Null when unusable. */
export function whatsappFor(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10) digits = `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) digits = `91${digits.slice(1)}`;
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

/** First line of the message, trimmed for the list row. */
export function firstLine(text: string, max = 120): string {
  const line = text.split(/\r?\n/).find((l) => l.trim()) ?? "";
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}
