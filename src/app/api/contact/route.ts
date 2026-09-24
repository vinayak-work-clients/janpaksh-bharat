import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/data/settings";
import { notifyContactMessage } from "@/lib/contact-email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const LIMIT = 5;
const WINDOW_MS = 60_000;
/** Hard cap before parsing so oversized bodies never reach zod. */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const gate = rateLimit(`contact:${ip}`, LIMIT, WINDOW_MS);
  if (!gate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages from this connection. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "That message is too long." }, { status: 413 });
  }

  let json: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "That message is too long." }, { status: 413 });
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot tripped → pretend success, do nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, topic, message } = parsed.data;

  // Persist with the service role: contact_messages has no anon policy, so
  // the browser can never read or write it directly.
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, phone: phone || null, topic, message });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[contact] failed to persist submission", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your message just now. Please try again or email us directly." },
      { status: 503 },
    );
  }
  // The dashboard's unread badge and inbox.
  revalidatePath("/admin", "layout");

  // Email is best effort: the row is stored, so a mail failure never fails the request.
  let fallbackTo = "";
  try {
    fallbackTo = (await getSiteSettings()).contact.email;
  } catch {
    /* settings unavailable: CONTACT_NOTIFY_EMAIL may still be set */
  }
  const mail = await notifyContactMessage({ name, email, phone, topic, message }, fallbackTo);

  return NextResponse.json({ ok: true, emailed: mail.sent });
}
