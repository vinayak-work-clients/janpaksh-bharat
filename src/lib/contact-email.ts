import "server-only";

import { Resend } from "resend";
import type { ContactInput } from "@/lib/contact-schema";
import { SITE_URL } from "@/lib/site-url";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface NotifyResult {
  sent: boolean;
  reason?: string;
}

/**
 * Notify the desk of a new contact message through Resend. Never throws:
 * the row is already stored, so a mail failure is logged and reported back.
 * Skips silently when RESEND_API_KEY is not set.
 */
export async function notifyContactMessage(input: Omit<ContactInput, "company">, fallbackTo: string): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[contact] email skipped: RESEND_API_KEY is not set");
    return { sent: false, reason: "no-api-key" };
  }
  const from = process.env.CONTACT_FROM_EMAIL || "Janpaksh Bharat <onboarding@resend.dev>";
  const to = process.env.CONTACT_NOTIFY_EMAIL || fallbackTo;
  if (!to) {
    console.warn("[contact] email skipped: no CONTACT_NOTIFY_EMAIL and no contact email in settings");
    return { sent: false, reason: "no-recipient" };
  }

  const { name, email, phone, topic, message } = input;
  const subject = `New message: ${topic} — ${name}`;
  const inboxUrl = `${SITE_URL}/admin/messages`;
  const text = [
    `New message from the Janpaksh Bharat contact form`,
    ``,
    `Name:  ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Topic: ${topic}`,
    ``,
    message,
    ``,
    `Open the inbox: ${inboxUrl}`,
  ].join("\n");
  const html = `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#0B0B0F;line-height:1.5">
<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6B6B75;margin:0 0 12px">Janpaksh Bharat · contact form</p>
<h1 style="font-size:20px;margin:0 0 16px">${esc(subject)}</h1>
<table cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">
<tr><td style="padding:4px 16px 4px 0;color:#6B6B75">Name</td><td style="padding:4px 0">${esc(name)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#6B6B75">Email</td><td style="padding:4px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#6B6B75">Phone</td><td style="padding:4px 0">${esc(phone || "—")}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#6B6B75">Topic</td><td style="padding:4px 0">${esc(topic)}</td></tr>
</table>
<div style="margin:20px 0;padding:16px;background:#F6F3EE;border-left:3px solid #E8862A;white-space:pre-wrap;font-size:15px">${esc(message)}</div>
<p style="font-size:14px"><a href="${esc(inboxUrl)}" style="color:#B8611A">Open the inbox</a> · reply to this email to answer ${esc(name)} directly.</p>
</body></html>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({ from, to, replyTo: email, subject, text, html });
    if (error) {
      console.error("[contact] email failed:", error.message);
      return { sent: false, reason: error.message };
    }
    return { sent: true };
  } catch (e) {
    console.error("[contact] email failed:", e instanceof Error ? e.message : e);
    return { sent: false, reason: e instanceof Error ? e.message : String(e) };
  }
}
