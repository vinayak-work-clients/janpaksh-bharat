"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { AlertTriangle, Check } from "lucide-react";
import { adSizes } from "@/config/ads";
import { cn } from "@/lib/utils";
import { adSchema, type AdFormValues } from "@/lib/admin/schemas";
import { aspectMismatch, sizeText, type SlotInfo } from "@/lib/admin/ads";
import { createAd, updateAd } from "@/lib/admin/actions/ads";
import { BRANDING_BUCKET, adCreativeTarget } from "@/lib/admin/storage";
import { removeUploaded } from "@/lib/admin/upload-client";
import { Button } from "@/components/admin/ui/Button";
import { DialogRoot, DialogContent, DialogClose } from "@/components/admin/ui/Dialog";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Switch } from "@/components/admin/ui/Switch";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { ScaledPreview } from "@/components/admin/ads/ScaledPreview";

interface AdCreativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotInfo;
  mode: "create" | "edit";
  adId?: string;
  initial: AdFormValues;
  onSaved: () => void;
}

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return "";
  }
};
const fromLocalInput = (local: string) => (local ? new Date(local).toISOString() : null);

/** Ratio as "3.88:1" for the hint text. */
const ratio = (w: number, h: number) => `${(w / h).toFixed(2).replace(/\.?0+$/, "")}:1`;

export function AdCreativeDialog({ open, onOpenChange, slot, mode, adId, initial, onSaved }: AdCreativeDialogProps) {
  const [pending, startTransition] = useTransition();
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  /** Paths uploaded in this dialog session and not yet saved: removed on cancel. */
  const uploaded = useRef<Set<string>>(new Set());
  const saved = useRef(false);
  const target = useMemo(() => adCreativeTarget(slot.key), [slot.key]);
  const size = adSizes[slot.size];

  const form = useForm<AdFormValues>({ resolver: zodResolver(adSchema), defaultValues: initial, mode: "onBlur" });
  const { register, control, handleSubmit, setValue, setError, reset, getValues, formState } = form;
  const { errors } = formState;

  const imageUrl = useWatch({ control, name: "imageUrl" });
  const imagePath = useWatch({ control, name: "imagePath" });
  const sponsorName = useWatch({ control, name: "sponsorName" });
  const alt = useWatch({ control, name: "alt" });

  useEffect(() => {
    if (open) {
      reset(initial);
      setDims(null);
      uploaded.current.clear();
      saved.current = false;
    }
  }, [open, initial, reset]);

  const mismatch = dims ? aspectMismatch(dims.width, dims.height, slot.size) : 0;

  const close = (next: boolean) => {
    if (!next && !saved.current) {
      // Discard files uploaded during this session that never made it to a row.
      const keep = initial.imagePath;
      const stale = Array.from(uploaded.current).filter((p) => p !== keep);
      if (stale.length) void removeUploaded(stale, BRANDING_BUCKET);
    }
    onOpenChange(next);
  };

  const onValid = (values: AdFormValues) => {
    startTransition(async () => {
      const result = mode === "create" ? await createAd(values) : await updateAd(adId!, values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [k, msg] of Object.entries(result.fieldErrors)) setError(k as keyof AdFormValues, { type: "server", message: msg });
        }
        toast.error(result.error, result.fieldErrors ? { description: Object.values(result.fieldErrors)[0] } : undefined);
        return;
      }
      saved.current = true;
      toast.success(mode === "create" ? "Creative added" : "Creative updated", { description: result.warning ?? `${slot.label} will show it on the next page load.` });
      onSaved();
      onOpenChange(false);
    });
  };
  const onInvalid = () => toast.error("Please fix the highlighted fields");

  return (
    <DialogRoot open={open} onOpenChange={close}>
      <DialogContent
        title={mode === "create" ? "Add creative" : "Edit creative"}
        description={
          <>
            {slot.label} · {sizeText(slot.size)}
            {slot.mobileSize && <> · mobile {adSizes[slot.mobileSize].width}×{adSizes[slot.mobileSize].height}</>}
          </>
        }
        className="max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto"
      >
        <form onSubmit={(e) => e.preventDefault()} noValidate className="mt-5 grid gap-5">
          <Field htmlFor="ad-sponsor" label="Sponsor name" error={errors.sponsorName?.message}>
            <Input id="ad-sponsor" {...register("sponsorName")} placeholder="Himalaya Organics" aria-invalid={Boolean(errors.sponsorName) || undefined} />
          </Field>

          <div>
            <p className="mb-1.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Creative</p>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <MediaUploader
                  kind="image"
                  preview="none"
                  folder="ads"
                  target={target}
                  allowUrl={false}
                  id="ad-image"
                  value={imageUrl ? { url: imageUrl, path: imagePath } : null}
                  invalid={Boolean(errors.imageUrl)}
                  onChange={(v) => {
                    field.onChange(v?.url ?? "");
                    setValue("imagePath", v?.path ?? null, { shouldDirty: true });
                    if (v?.path) uploaded.current.add(v.path);
                    setDims(v?.width && v?.height ? { width: v.width, height: v.height } : null);
                  }}
                />
              )}
            />
            {errors.imageUrl && (
              <p role="alert" className="mt-1.5 font-sans text-[0.8rem] text-breaking">
                {errors.imageUrl.message}
              </p>
            )}
            {dims && (
              <p className={cn("mt-2 flex items-start gap-2 font-sans text-[0.8rem] leading-snug", mismatch > 0.05 ? "text-saffron-dark" : "text-emerald-700")}>
                {mismatch > 0.05 ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>
                  {mismatch > 0.05 ? (
                    <>
                      This image is {dims.width}×{dims.height} ({ratio(dims.width, dims.height)}). The slot is {size.width}×{size.height} ({ratio(size.width, size.height)}), so the edges will be cropped on the site.
                    </>
                  ) : (
                    <>
                      {dims.width}×{dims.height} matches the slot ({size.width}×{size.height}).
                    </>
                  )}
                </span>
              </p>
            )}
          </div>

          {imageUrl && (
            <div>
              <p className="mb-1.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-muted">Preview at slot size</p>
              <ScaledPreview width={size.width} height={size.height}>
                <span className="absolute left-0 top-0 -translate-y-full pb-0.5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted" aria-hidden="true">
                  Advertisement
                </span>
                <Image src={imageUrl} alt={alt || sponsorName || ""} fill unoptimized sizes={`${size.width}px`} className="object-cover" />
              </ScaledPreview>
            </div>
          )}

          <Field htmlFor="ad-href" label="Link" hint="Where a tap on the ad goes. Opens in a new tab." error={errors.href?.message}>
            <Input id="ad-href" type="url" inputMode="url" {...register("href")} placeholder="https://" aria-invalid={Boolean(errors.href) || undefined} aria-describedby={errors.href ? "ad-href-error" : "ad-href-hint"} />
          </Field>
          <Field htmlFor="ad-alt" label="Alt text" optional hint="Read out by screen readers. Defaults to the sponsor name." error={errors.alt?.message}>
            <Input id="ad-alt" {...register("alt")} placeholder="Himalaya Organics — Seasonal Harvest" aria-describedby="ad-alt-hint" />
          </Field>

          <div className="border-y border-rule">
            <Controller control={control} name="enabled" render={({ field }) => <Switch id="ad-enabled" label="Enabled" hint="Switch off to keep the creative but hide it." checked={field.value} onCheckedChange={field.onChange} />} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field htmlFor="ad-starts" label="Start" optional hint="Leave blank to start now." error={errors.startsAt?.message}>
              <Controller control={control} name="startsAt" render={({ field }) => <Input id="ad-starts" type="datetime-local" value={toLocalInput(field.value)} onChange={(e) => field.onChange(fromLocalInput(e.target.value))} aria-describedby="ad-starts-hint" />} />
            </Field>
            <Field htmlFor="ad-ends" label="End" optional hint="Leave blank to run until disabled." error={errors.endsAt?.message}>
              <Controller control={control} name="endsAt" render={({ field }) => <Input id="ad-ends" type="datetime-local" value={toLocalInput(field.value)} onChange={(e) => field.onChange(fromLocalInput(e.target.value))} aria-invalid={Boolean(errors.endsAt) || undefined} aria-describedby={errors.endsAt ? "ad-ends-error" : "ad-ends-hint"} />} />
            </Field>
          </div>

          <Field htmlFor="ad-weight" label="Weight" hint="1–10. When a slot has several active creatives, higher weights show more often." error={errors.weight?.message}>
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <Input
                  id="ad-weight"
                  type="number"
                  min={1}
                  max={10}
                  inputMode="numeric"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value === "" ? 1 : Math.max(1, Math.min(10, Number(e.target.value))))}
                  aria-invalid={Boolean(errors.weight) || undefined}
                  aria-describedby={errors.weight ? "ad-weight-error" : "ad-weight-hint"}
                  className="max-w-[8rem]"
                />
              )}
            />
          </Field>

          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={() => void handleSubmit(onValid, onInvalid)()} loading={pending} disabled={pending || !getValues("imageUrl") && !imageUrl}>
              {mode === "create" ? "Add creative" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
