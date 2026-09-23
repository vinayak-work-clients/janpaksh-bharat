import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
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

  // TODO(Phase 6): deliver via email (Resend/SES) in addition to the database row.

  return NextResponse.json({ ok: true });
}
