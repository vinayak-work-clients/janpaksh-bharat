"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { Clock3, Eraser, Info } from "lucide-react";
import { describeNextCleanup } from "@/lib/admin/cleanup";
import { runCleanupNow } from "@/lib/admin/actions/settings";
import { Button } from "@/components/admin/ui/Button";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";
import { Switch } from "@/components/admin/ui/Switch";
import type { SettingsForm } from "@/components/admin/settings/TabForm";

export function SiteTab({ form }: { form: SettingsForm }) {
  const { register, control, formState } = form;
  const { errors } = formState;
  return (
    <div className="grid min-w-0 gap-5">
      <div className="divide-y divide-rule border-y border-rule">
        <Controller control={control} name="tickerEnabled" render={({ field }) => <Switch id="tickerEnabled" label="Breaking ticker" hint="The red strip above the header that scrolls the latest breaking stories." checked={field.value} onCheckedChange={field.onChange} />} />
        <Controller control={control} name="adsEnabled" render={({ field }) => <Switch id="adsEnabled" label="Ads enabled" hint="Turns every ad slot on the site on or off. The same switch sits at the top of the Ads page." checked={field.value} onCheckedChange={field.onChange} />} />
      </div>
      <Field htmlFor="archiveNotice" label="Archive notice" optional hint="The line in the footer that explains the 30-day rule to readers." error={errors.archiveNotice?.message}>
        <Input id="archiveNotice" {...register("archiveNotice")} aria-describedby="archiveNotice-hint" />
      </Field>
    </div>
  );
}

/** Read-only explainer + manual purge; lives under the Site tab's form. */
export function CleanupPanel() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [next, setNext] = useState<string>("");

  useEffect(() => {
    const tick = () => setNext(describeNextCleanup());
    tick();
    const t = window.setInterval(tick, 60_000);
    return () => window.clearInterval(t);
  }, []);

  const run = () =>
    startTransition(async () => {
      const r = await runCleanupNow();
      const b = (r.body ?? {}) as Record<string, unknown>;
      const summary = [
        `${Number(b.deletedPosts ?? 0)} post${Number(b.deletedPosts ?? 0) === 1 ? "" : "s"} deleted`,
        `${Number(b.deletedFiles ?? 0)} file${Number(b.deletedFiles ?? 0) === 1 ? "" : "s"} removed`,
        `${Number(b.orphansRemoved ?? 0)} orphan${Number(b.orphansRemoved ?? 0) === 1 ? "" : "s"} swept`,
      ].join(" · ");
      const raw = JSON.stringify(r.body);
      if (r.ok) {
        toast.success("Cleanup finished", { description: `${summary}\n${raw}`, duration: 8000 });
        router.refresh();
      } else {
        toast.error(`Cleanup failed${r.status ? ` (${r.status})` : ""}`, { description: raw, duration: 10000 });
      }
    });

  return (
    <div className="grid gap-4 border border-rule bg-paper-2/50 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron-dark" aria-hidden="true" />
        <div className="font-sans text-[0.85rem] leading-relaxed text-ink">
          <p className="font-semibold">The 30-day rule</p>
          <p className="mt-1 text-muted">
            Every post is live for 30 days from the moment it is first saved. After that it disappears from the site immediately, and a nightly cleanup deletes the row and its uploaded files for good. Drafts follow the same clock.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-muted">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Next scheduled cleanup: <span className="text-ink" suppressHydrationWarning>{next || "03:00 IST daily"}</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={run} loading={pending}>
          <Eraser className="h-4 w-4" aria-hidden="true" /> Run cleanup now
        </Button>
        <span className="font-sans text-[0.78rem] text-muted">Deletes expired posts and their files straight away. Safe to run any time.</span>
      </div>
    </div>
  );
}
