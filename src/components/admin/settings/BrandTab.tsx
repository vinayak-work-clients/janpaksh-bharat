"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { brandAssetTarget } from "@/lib/admin/storage";
import { Logo } from "@/components/Logo";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Textarea } from "@/components/admin/ui/Textarea";
import { MediaUploader } from "@/components/admin/MediaUploader";
import type { SettingsForm } from "@/components/admin/settings/TabForm";

const DESCRIPTION_IDEAL = 160;

function LogoPreview({ url, surface }: { url: string | null; surface: "paper" | "ink" }) {
  const onInk = surface === "ink";
  return (
    <div className={cn("flex h-20 items-center justify-center border border-rule px-4", onInk ? "bg-ink" : "bg-paper")}>
      {url ? (
        <Image src={url} alt="" unoptimized width={0} height={0} sizes="200px" style={{ height: 40, width: "auto", maxWidth: "100%" }} />
      ) : (
        <Logo asSpan size="nav" tone={onInk ? "paper" : "ink"} />
      )}
    </div>
  );
}

function HeroSwatch({ variant }: { variant: "wash" | "solid" }) {
  return (
    <span aria-hidden="true" className="relative block h-10 w-16 shrink-0 overflow-hidden border border-rule bg-ink">
      {variant === "wash" ? (
        <span className="absolute -inset-2 blur-[3px]" style={{ background: "linear-gradient(135deg, #3b4a6b 0%, #0B0B0F 55%), #0B0B0F", backgroundBlendMode: "normal" }}>
          <span className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 45%, rgba(232,134,42,0.75), transparent 55%)" }} />
          <span className="absolute inset-0" style={{ background: "radial-gradient(circle at 75% 20%, rgba(94,132,190,0.6), transparent 50%)" }} />
        </span>
      ) : (
        <span className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(232,134,42,0.45), transparent 55%), #0B0B0F" }} />
      )}
      <span className="absolute bottom-1.5 left-1.5 h-1 w-6 bg-paper/80" />
      <span className="absolute bottom-3.5 left-1.5 h-1 w-9 bg-paper/50" />
    </span>
  );
}

export function BrandTab({ form }: { form: SettingsForm }) {
  const { register, control, setValue, formState } = form;
  const { errors } = formState;
  const description = useWatch({ control, name: "description" }) ?? "";
  const logoUrl = useWatch({ control, name: "logoUrl" });
  const logoPath = useWatch({ control, name: "logoPath" });
  const logoDarkUrl = useWatch({ control, name: "logoDarkUrl" });
  const logoDarkPath = useWatch({ control, name: "logoDarkPath" });
  const heroPosterUrl = useWatch({ control, name: "heroPosterUrl" });
  const heroPosterPath = useWatch({ control, name: "heroPosterPath" });
  const logoTarget = useMemo(() => brandAssetTarget("logo"), []);
  const heroTarget = useMemo(() => brandAssetTarget("hero"), []);
  const len = description.length;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      <div className="grid min-w-0 content-start gap-5 [&>*]:min-w-0">
        <Field htmlFor="siteName" label="Site name (English)" error={errors.siteName?.message}>
          <Input id="siteName" {...register("siteName")} aria-invalid={Boolean(errors.siteName) || undefined} />
        </Field>
        <Field htmlFor="siteNameHindi" label="Site name (Hindi)" error={errors.siteNameHindi?.message}>
          <Input id="siteNameHindi" lang="hi" {...register("siteNameHindi")} className="hindi-sans text-[1.05rem]" aria-invalid={Boolean(errors.siteNameHindi) || undefined} />
        </Field>
        <Field htmlFor="tagline" label="Tagline (Hindi)" hint="The brand line under the logo, in the hero and the footer." error={errors.tagline?.message}>
          <Input id="tagline" lang="hi" {...register("tagline")} className="hindi-sans text-[1.05rem]" aria-invalid={Boolean(errors.tagline) || undefined} aria-describedby={errors.tagline ? "tagline-error" : "tagline-hint"} />
        </Field>
        <Field htmlFor="taglineEn" label="Tagline (English)" optional hint="The English rendering shown as a sub-line." error={errors.taglineEn?.message}>
          <Input id="taglineEn" {...register("taglineEn")} aria-describedby="taglineEn-hint" />
        </Field>
        <Field
          htmlFor="description"
          label="Description (SEO)"
          hint="Used for search results and link previews. Aim for 160 characters."
          error={errors.description?.message}
          trailing={<span className={cn(len > DESCRIPTION_IDEAL && "text-saffron-dark", len > 300 && "text-breaking")}>{len}/{DESCRIPTION_IDEAL}</span>}
        >
          <Textarea id="description" autoGrow rows={3} {...register("description")} aria-describedby={errors.description ? "description-error" : "description-hint"} />
        </Field>
        <Field htmlFor="heroKicker" label="Hero kicker" optional hint="The small uppercase line above the hero headline." error={errors.heroKicker?.message}>
          <Input id="heroKicker" {...register("heroKicker")} placeholder="Independent · Current Affairs · Bharat" aria-describedby="heroKicker-hint" />
        </Field>
      </div>

      <div className="grid min-w-0 content-start gap-5 [&>*]:min-w-0">
        <div>
          <p className="mb-1.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Logo (light)</p>
          <p className="mb-2 font-sans text-[0.8rem] text-muted">Shown on paper backgrounds: the header once scrolled and the article pages.</p>
          <MediaUploader
            kind="image"
            preview="none"
            folder="logo"
            target={logoTarget}
            allowUrl={false}
            id="logoUrl"
            value={logoUrl ? { url: logoUrl, path: logoPath } : null}
            onChange={(v) => {
              setValue("logoUrl", v?.url ?? null, { shouldDirty: true });
              setValue("logoPath", v?.path ?? null, { shouldDirty: true });
            }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <LogoPreview url={logoUrl} surface="paper" />
            <LogoPreview url={logoUrl} surface="ink" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Logo (dark)</p>
          <p className="mb-2 font-sans text-[0.8rem] text-muted">Shown on ink backgrounds: the transparent home header, the footer and the preloader.</p>
          <MediaUploader
            kind="image"
            preview="none"
            folder="logo"
            target={logoTarget}
            allowUrl={false}
            id="logoDarkUrl"
            value={logoDarkUrl ? { url: logoDarkUrl, path: logoDarkPath } : null}
            onChange={(v) => {
              setValue("logoDarkUrl", v?.url ?? null, { shouldDirty: true });
              setValue("logoDarkPath", v?.path ?? null, { shouldDirty: true });
            }}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <LogoPreview url={logoDarkUrl} surface="ink" />
            <LogoPreview url={logoDarkUrl} surface="paper" />
          </div>
        </div>
        <div>
          <p className="mb-1.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Hero poster</p>
          <p className="mb-2 font-sans text-[0.8rem] text-muted">Never shown as a picture: it is blurred into the colour wash behind the news deck.</p>
          <MediaUploader
            kind="image"
            preview="single"
            folder="hero"
            target={heroTarget}
            allowUrl
            id="heroPosterUrl"
            value={heroPosterUrl ? { url: heroPosterUrl, path: heroPosterPath } : null}
            onChange={(v) => {
              setValue("heroPosterUrl", v?.url ?? null, { shouldDirty: true });
              setValue("heroPosterPath", v?.path ?? null, { shouldDirty: true });
            }}
          />
        </div>
        <fieldset>
          <legend className="mb-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Hero background</legend>
          <Controller
            control={control}
            name="heroBackground"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "wash", label: "Wash", hint: "Poster blurred into colour" },
                    { value: "solid", label: "Solid", hint: "Ink with a saffron glow" },
                  ] as const
                ).map((opt) => (
                  <label key={opt.value} className={cn("flex cursor-pointer items-center gap-3 border p-3 transition-colors", field.value === opt.value ? "border-saffron bg-saffron/10" : "border-rule hover:border-ink/40")}>
                    <input type="radio" name="heroBackground" value={opt.value} checked={field.value === opt.value} onChange={() => field.onChange(opt.value)} className="sr-only" />
                    <HeroSwatch variant={opt.value} />
                    <span>
                      <span className="block font-sans text-[0.9rem] font-medium text-ink">{opt.label}</span>
                      <span className="block font-sans text-[0.75rem] text-muted">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
        </fieldset>
      </div>
    </div>
  );
}
