"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { cn } from "@/lib/utils";
import { contactSchema, TOPICS, type ContactInput } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

type Errors = Partial<Record<keyof ContactInput, string>>;

const fieldBase =
  "w-full border border-rule bg-paper px-4 py-3 font-sans text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/40 aria-[invalid=true]:border-breaking";
const labelBase = "mb-2 block font-sans text-kicker uppercase text-muted";

export function ContactForm() {
  const { socials, cta, contact } = useSiteSettings();
  const [values, setValues] = useState<ContactInput>({
    name: "",
    email: "",
    phone: "",
    topic: "Story tip",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const set = (k: keyof ContactInput) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validateField = (k: keyof ContactInput) => {
    const shape = contactSchema.shape[k];
    const res = shape.safeParse(values[k]);
    setErrors((er) => ({ ...er, [k]: res.success ? undefined : res.error.issues[0]?.message }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactInput;
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-rule bg-paper-2 p-8 sm:p-10" role="status" aria-live="polite">
        <p className="font-serif text-h2 text-ink">Thank you — we read everything.</p>
        <p className="mt-4 max-w-md font-sans leading-relaxed text-muted">
          A member of the desk will reply within two working days. If it&rsquo;s urgent or you&rsquo;d rather talk,
          WhatsApp is the fastest way to reach us.
        </p>
        <div className="mt-8">
          <Button href={socials.whatsapp} external variant="primary">
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {cta.whatsappLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6" aria-describedby="contact-form-note">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelBase}>Name</label>
          <input id="contact-name" name="name" autoComplete="name" required value={values.name} onChange={set("name")} onBlur={() => validateField("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} className={fieldBase} placeholder="Your name" />
          {errors.name && <p id="err-name" className="mt-2 font-sans text-[0.8rem] text-breaking">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelBase}>Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required value={values.email} onChange={set("email")} onBlur={() => validateField("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} className={fieldBase} placeholder="you@example.com" />
          {errors.email && <p id="err-email" className="mt-2 font-sans text-[0.8rem] text-breaking">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelBase}>
            Phone <span className="normal-case tracking-normal text-muted/70">(optional)</span>
          </label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} onBlur={() => validateField("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined} className={fieldBase} placeholder="+91 …" />
          {errors.phone && <p id="err-phone" className="mt-2 font-sans text-[0.8rem] text-breaking">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="contact-topic" className={labelBase}>Topic</label>
          <div className="relative">
            <select id="contact-topic" name="topic" value={values.topic} onChange={set("topic")} className={cn(fieldBase, "appearance-none pr-10")}>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">▾</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelBase}>Message</label>
        <textarea id="contact-message" name="message" required rows={6} value={values.message} onChange={set("message")} onBlur={() => validateField("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : "contact-form-note"} className={cn(fieldBase, "resize-y")} placeholder="What happened, where, and how can we reach you?" />
        {errors.message ? (
          <p id="err-message" className="mt-2 font-sans text-[0.8rem] text-breaking">{errors.message}</p>
        ) : (
          <p id="contact-form-note" className="mt-2 font-sans text-[0.8rem] text-muted">Tips are treated as confidential. We never publish a source&rsquo;s identity without written consent.</p>
        )}
      </div>

      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company ?? ""} onChange={set("company")} />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" variant="secondary" size="lg" disabled={status === "submitting"} className="group">
          {status === "submitting" ? "Sending…" : "Send message"}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
        </Button>
        {status === "error" && (
          <p role="alert" className="font-sans text-[0.85rem] text-breaking">
            Something went wrong. Please try again or email {contact.email}.
          </p>
        )}
      </div>
    </form>
  );
}
