"use client";

import type { ReactNode } from "react";
import type { SettingsFormValues } from "@/lib/admin/schemas";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import type { SettingsForm } from "@/components/admin/settings/TabForm";

type Key = keyof SettingsFormValues;

interface Spec {
  name: Key;
  label: string;
  hint?: ReactNode;
  optional?: boolean;
  type?: "text" | "url" | "email" | "tel" | "textarea";
  placeholder?: string;
  lang?: string;
  className?: string;
}

function TextField({ form, spec }: { form: SettingsForm; spec: Spec }) {
  const { register, formState } = form;
  const error = formState.errors[spec.name]?.message as string | undefined;
  const describedBy = error ? `${spec.name}-error` : spec.hint ? `${spec.name}-hint` : undefined;
  return (
    <Field htmlFor={spec.name} label={spec.label} hint={spec.hint} optional={spec.optional} error={error} className={spec.className}>
      {spec.type === "textarea" ? (
        <Textarea id={spec.name} autoGrow rows={3} {...register(spec.name)} placeholder={spec.placeholder} lang={spec.lang} aria-invalid={Boolean(error) || undefined} aria-describedby={describedBy} />
      ) : (
        <Input
          id={spec.name}
          type={spec.type ?? "text"}
          inputMode={spec.type === "url" ? "url" : spec.type === "email" ? "email" : spec.type === "tel" ? "tel" : undefined}
          {...register(spec.name)}
          placeholder={spec.placeholder}
          lang={spec.lang}
          className={spec.lang === "hi" ? "hindi-sans text-[1.05rem]" : undefined}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
        />
      )}
    </Field>
  );
}

function Group({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="grid gap-4">
      {title && <h3 className="font-serif text-[1.05rem] font-semibold text-ink">{title}</h3>}
      {children}
    </div>
  );
}

export function ContactTab({ form }: { form: SettingsForm }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <TextField form={form} spec={{ name: "contactName", label: "Name", hint: "The person named on the contact page." }} />
      <TextField form={form} spec={{ name: "contactRole", label: "Role", hint: "e.g. CEO, Janpaksh Bharat" }} />
      <TextField form={form} spec={{ name: "contactEmail", label: "Email", type: "email", hint: "Footer, contact page and error messages." }} />
      <TextField form={form} spec={{ name: "contactPhone", label: "Phone", type: "tel", placeholder: "+91 …", hint: "Footer and contact page." }} />
      <TextField form={form} spec={{ name: "location", label: "Location", hint: "Shown on the About and Contact pages.", className: "sm:col-span-2" }} />
    </div>
  );
}

export function SocialTab({ form }: { form: SettingsForm }) {
  return (
    <div className="grid min-w-0 gap-8">
      <Group title="Social links">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} spec={{ name: "whatsappUrl", label: "WhatsApp community", type: "url", placeholder: "https://chat.whatsapp.com/…", hint: "Every WhatsApp button: hero, Connect band, footer, mobile bar and the contact page.", className: "sm:col-span-2" }} />
          <TextField form={form} spec={{ name: "instagramUrl", label: "Instagram", type: "url", placeholder: "https://instagram.com/…", hint: "Footer and the Connect band." }} />
          <TextField form={form} spec={{ name: "youtubeUrl", label: "YouTube", type: "url", placeholder: "https://youtube.com/@…", hint: "Footer, Connect band and the Watch strip." }} />
          <TextField form={form} spec={{ name: "xUrl", label: "X (Twitter)", type: "url", placeholder: "https://x.com/…", hint: "Footer and the Connect band." }} />
          <TextField form={form} spec={{ name: "facebookUrl", label: "Facebook", type: "url", placeholder: "https://facebook.com/…", hint: "Footer and the Connect band." }} />
        </div>
      </Group>
      <Group title="Calls to action">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField form={form} spec={{ name: "ctaPrimaryLabel", label: "Primary CTA label", hint: "The main button in the hero." }} />
          <TextField form={form} spec={{ name: "ctaPrimaryHref", label: "Primary CTA link", placeholder: "/about", hint: "A page (/about), an anchor (#whatsapp) or a full link." }} />
          <TextField form={form} spec={{ name: "ctaSecondaryLabel", label: "Secondary CTA label", hint: "The second hero button." }} />
          <TextField form={form} spec={{ name: "ctaSecondaryHref", label: "Secondary CTA link", placeholder: "#whatsapp", hint: "#whatsapp scrolls to the Connect band." }} />
          <TextField form={form} spec={{ name: "whatsappCtaLabel", label: "WhatsApp CTA label", hint: "Text on every WhatsApp button across the site.", className: "sm:col-span-2" }} />
        </div>
      </Group>
    </div>
  );
}

export function PodcastTab({ form }: { form: SettingsForm }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <TextField form={form} spec={{ name: "podcastName", label: "Show name", hint: "Listen band and the Podcasts page." }} />
      <TextField form={form} spec={{ name: "podcastNameHindi", label: "Show name (Hindi)", optional: true, lang: "hi" }} />
      <TextField form={form} spec={{ name: "podcastBlurb", label: "Blurb", type: "textarea", optional: true, hint: "One or two sentences about the show.", className: "sm:col-span-2" }} />
      <TextField form={form} spec={{ name: "listenSpotify", label: "Spotify", type: "url", optional: true, placeholder: "https://open.spotify.com/show/…" }} />
      <TextField form={form} spec={{ name: "listenApple", label: "Apple Podcasts", type: "url", optional: true, placeholder: "https://podcasts.apple.com/…" }} />
      <TextField form={form} spec={{ name: "listenYoutube", label: "YouTube", type: "url", optional: true, placeholder: "https://youtube.com/…", className: "sm:col-span-2" }} />
    </div>
  );
}
