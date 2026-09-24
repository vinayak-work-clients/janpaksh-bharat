"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition, type ReactNode } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { SETTINGS_TAB_FIELDS, settingsSchema, type SettingsFormValues, type SettingsPatch, type SettingsTab } from "@/lib/admin/schemas";
import { updateSettings } from "@/lib/admin/actions/settings";
import { Button } from "@/components/admin/ui/Button";

export type SettingsForm = UseFormReturn<SettingsFormValues>;

interface TabFormProps {
  tab: SettingsTab;
  label: string;
  initial: SettingsFormValues;
  onDirty: (tab: SettingsTab, dirty: boolean) => void;
  children: (form: SettingsForm) => ReactNode;
}

/** Validate only this tab's fields; the resolver strips the rest. */
function tabResolver(tab: SettingsTab) {
  const mask = Object.fromEntries(SETTINGS_TAB_FIELDS[tab].map((k) => [k, true])) as Record<keyof SettingsFormValues, true>;
  return zodResolver(settingsSchema.pick(mask));
}

function pickTab(values: SettingsFormValues, tab: SettingsTab): SettingsPatch {
  const out: Record<string, unknown> = {};
  for (const k of SETTINGS_TAB_FIELDS[tab]) out[k] = values[k];
  return out as SettingsPatch;
}

/**
 * One react-hook-form per tab with its own Save button. Saves only the
 * tab's fields, shows a toast, and reports dirty state for the tab label.
 */
export function TabForm({ tab, label, initial, onDirty, children }: TabFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<SettingsFormValues>({ resolver: tabResolver(tab), defaultValues: initial, mode: "onBlur" });
  const { handleSubmit, reset, getValues, setError, formState } = form;
  const { isDirty, errors } = formState;
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;

  useEffect(() => onDirty(tab, isDirty), [isDirty, tab, onDirty]);

  // A server refresh brings new values; adopt them unless the tab has local edits.
  useEffect(() => {
    if (!dirtyRef.current) reset(initial);
  }, [initial, reset]);

  const onInvalid = useCallback(() => {
    const first = Object.keys(errors)[0];
    toast.error("Please fix the highlighted fields", first ? { description: `Start with: ${first}` } : undefined);
  }, [errors]);

  const onValid = (values: SettingsFormValues) => {
    const merged = { ...getValues(), ...values };
    const patch = pickTab(merged, tab);
    startTransition(async () => {
      const r = await updateSettings(patch);
      if (!r.ok) {
        if (r.fieldErrors) {
          for (const [k, msg] of Object.entries(r.fieldErrors)) setError(k as keyof SettingsFormValues, { type: "server", message: msg });
        }
        toast.error(r.error, r.fieldErrors ? { description: Object.values(r.fieldErrors)[0] } : undefined);
        return;
      }
      reset(merged);
      toast.success(`${label} saved`, { description: r.warning ?? "The site picks up the change on its next page load." });
      router.refresh();
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="grid min-w-0 gap-5">
      {children(form)}
      <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        <span className="mr-auto font-sans text-[0.8rem] text-muted">{isDirty ? "Unsaved changes" : "No changes"}</span>
        <Button onClick={() => void handleSubmit(onValid, onInvalid)()} loading={pending} disabled={pending || !isDirty}>
          <Save className="h-4 w-4" aria-hidden="true" /> Save {label.toLowerCase()}
        </Button>
      </div>
    </form>
  );
}
