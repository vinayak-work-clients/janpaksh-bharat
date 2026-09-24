"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { AlertTriangle, ExternalLink, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { adSizes } from "@/config/ads";
import { cn, formatDate } from "@/lib/utils";
import { AD_STATUS_LABEL, SLOT_GROUPS, SLOT_LIST, adStatus, adToForm, emptyAdForm, slotSizesLabel, type AdStatus, type AdminAd, type SlotInfo } from "@/lib/admin/ads";
import type { AdFormValues } from "@/lib/admin/schemas";
import { deleteAd, setAdsEnabled, toggleAd } from "@/lib/admin/actions/ads";
import { Badge, type BadgeTone } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { ConfirmDialog } from "@/components/admin/ui/Dialog";
import { Switch } from "@/components/admin/ui/Switch";
import { Tooltip } from "@/components/admin/ui/Tooltip";
import { AdCreativeDialog } from "@/components/admin/ads/AdCreativeDialog";

interface AdsManagerProps {
  ads: AdminAd[];
  adsEnabled: boolean;
}

const STATUS_TONE: Record<AdStatus, BadgeTone> = { active: "success", scheduled: "saffron", expired: "breaking", disabled: "muted" };

type DialogState = { mode: "create"; slot: SlotInfo; initial: AdFormValues } | { mode: "edit"; slot: SlotInfo; ad: AdminAd; initial: AdFormValues } | null;

export function AdsManager({ ads, adsEnabled }: AdsManagerProps) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(adsEnabled);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [toDelete, setToDelete] = useState<AdminAd | null>(null);
  const [pending, startTransition] = useTransition();

  const bySlot = useMemo(() => {
    const map = new Map<string, AdminAd[]>();
    for (const ad of ads) map.set(ad.slotKey, [...(map.get(ad.slotKey) ?? []), ad]);
    return map;
  }, [ads]);

  const onGlobal = (next: boolean) => {
    setEnabled(next);
    startTransition(async () => {
      const r = await setAdsEnabled(next);
      if (r.ok) {
        toast.success(next ? "Ads switched on" : "Ads switched off", { description: next ? "Every slot with an active creative is showing again." : "No ad slot renders on the site until you switch them back on." });
        router.refresh();
      } else {
        setEnabled(!next);
        toast.error("Couldn't update the switch", { description: r.error });
      }
    });
  };

  const onToggle = (ad: AdminAd) =>
    startTransition(async () => {
      const r = await toggleAd(ad.id);
      if (r.ok) {
        toast.success(r.enabled ? "Creative enabled" : "Creative disabled");
        router.refresh();
      } else toast.error("That didn't work", { description: r.error });
    });

  const onDelete = async () => {
    if (!toDelete) return;
    const r = await deleteAd(toDelete.id);
    if (r.ok) {
      toast.success("Creative deleted", r.warning ? { description: r.warning } : undefined);
      router.refresh();
    } else toast.error("Couldn't delete", { description: r.error });
  };

  return (
    <div className={cn("grid gap-8", pending && "opacity-70")}>
      <Card>
        <Switch
          id="ads-enabled"
          checked={enabled}
          onCheckedChange={onGlobal}
          label={<span className="font-serif text-[1.1rem] font-semibold">Ads enabled</span>}
          hint="Turns every ad slot on the site on or off. Individual creatives keep their own settings."
        />
      </Card>

      {SLOT_GROUPS.map((group) => {
        const slots = SLOT_LIST.filter((s) => s.group === group.key);
        return (
          <section key={group.key} aria-labelledby={`ads-group-${group.key}`} className="grid gap-4">
            <h2 id={`ads-group-${group.key}`} className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {group.label}
            </h2>
            <div className="grid gap-4 xl:grid-cols-2">
              {slots.map((slot) => (
                <SlotCard
                  key={slot.key}
                  slot={slot}
                  ads={bySlot.get(slot.key) ?? []}
                  onAdd={() => setDialog({ mode: "create", slot, initial: emptyAdForm(slot.key) })}
                  onEdit={(ad) => setDialog({ mode: "edit", slot, ad, initial: adToForm(ad) })}
                  onToggle={onToggle}
                  onDelete={setToDelete}
                />
              ))}
            </div>
          </section>
        );
      })}

      {dialog && (
        <AdCreativeDialog
          open
          onOpenChange={(o) => !o && setDialog(null)}
          slot={dialog.slot}
          mode={dialog.mode}
          adId={dialog.mode === "edit" ? dialog.ad.id : undefined}
          initial={dialog.initial}
          onSaved={() => router.refresh()}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this creative?"
        description={
          <>
            <strong className="text-ink">{toDelete?.sponsorName}</strong> will stop showing immediately and its uploaded file will be removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete creative"
        onConfirm={onDelete}
      />
    </div>
  );
}

function SlotCard({ slot, ads, onAdd, onEdit, onToggle, onDelete }: { slot: SlotInfo; ads: AdminAd[]; onAdd: () => void; onEdit: (ad: AdminAd) => void; onToggle: (ad: AdminAd) => void; onDelete: (ad: AdminAd) => void }) {
  const hasActive = ads.some((a) => adStatus(a) === "active");
  return (
    <Card as="section" flush className="flex flex-col" id={`slot-${slot.key}`}>
      <div className="flex items-start justify-between gap-3 border-b border-rule px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h3 className="font-serif text-[1.1rem] font-semibold leading-tight text-ink">{slot.label}</h3>
          <p className="mt-1 font-mono text-[0.72rem] text-muted">{slot.key}</p>
          <p className="mt-2 font-sans text-[0.8rem] text-ink">{slotSizesLabel(slot)}</p>
          <p className="mt-0.5 font-sans text-[0.8rem] text-muted">{slot.where}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onAdd} className="shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add creative
        </Button>
      </div>

      {ads.length === 0 ? (
        <p className="px-4 py-4 font-sans text-[0.85rem] text-muted sm:px-5">No creatives yet.</p>
      ) : (
        <ul className="divide-y divide-rule">
          {ads.map((ad) => (
            <CreativeRow key={ad.id} ad={ad} slot={slot} onEdit={() => onEdit(ad)} onToggle={() => onToggle(ad)} onDelete={() => onDelete(ad)} />
          ))}
        </ul>
      )}

      {!hasActive && (
        <p className="mt-auto flex items-start gap-2 border-t border-amber-300 bg-amber-50 px-4 py-3 font-sans text-[0.8rem] leading-snug text-amber-800 sm:px-5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          No active creative — the slot is hidden on the site.
        </p>
      )}
    </Card>
  );
}

function CreativeRow({ ad, slot, onEdit, onToggle, onDelete }: { ad: AdminAd; slot: SlotInfo; onEdit: () => void; onToggle: () => void; onDelete: () => void }) {
  const status = adStatus(ad);
  const size = adSizes[slot.size];
  // Thumbnail at the slot's true aspect ratio, capped at 160×56.
  const aspect = size.width / size.height;
  const thumbW = Math.round(Math.min(160, 56 * aspect));
  const thumbH = Math.round(thumbW / aspect);
  const window =
    ad.startsAt || ad.endsAt
      ? [ad.startsAt ? `from ${formatDate(ad.startsAt, "d MMM, HH:mm")}` : null, ad.endsAt ? `until ${formatDate(ad.endsAt, "d MMM, HH:mm")}` : null].filter(Boolean).join(" · ")
      : null;

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 sm:gap-3 sm:px-5">
      <span className="relative shrink-0 overflow-hidden border border-rule bg-paper-2" style={{ width: thumbW, height: thumbH }}>
        <Image src={ad.imageUrl} alt="" fill unoptimized sizes={`${thumbW}px`} className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-sans text-[0.9rem] font-medium text-ink">{ad.sponsorName}</span>
          <Badge tone={STATUS_TONE[status]} dot={status === "active"}>
            {AD_STATUS_LABEL[status]}
          </Badge>
          <span className="font-sans text-[0.75rem] text-muted">Weight {ad.weight}</span>
        </div>
        <a href={ad.href} target="_blank" rel="noopener noreferrer" className="clamp-1 mt-0.5 inline-flex max-w-full items-center gap-1 font-sans text-[0.78rem] text-muted hover:text-ink">
          <span className="truncate">{ad.href}</span>
          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
        </a>
        {window && <p className="mt-0.5 font-sans text-[0.75rem] text-muted">{window}</p>}
      </div>
      <div className="flex basis-full items-center justify-end gap-1 sm:basis-auto sm:shrink-0">
        <Tooltip content="Edit">
          <button type="button" onClick={onEdit} aria-label={`Edit ${ad.sponsorName}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content={ad.enabled ? "Disable" : "Enable"}>
          <button
            type="button"
            onClick={onToggle}
            aria-label={`${ad.enabled ? "Disable" : "Enable"} ${ad.sponsorName}`}
            aria-pressed={ad.enabled}
            className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5", ad.enabled ? "text-emerald-700" : "text-muted")}
          >
            <Power className="h-4 w-4" aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Delete">
          <button type="button" onClick={onDelete} aria-label={`Delete ${ad.sponsorName}`} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-breaking/10 hover:text-breaking">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </Tooltip>
      </div>
    </li>
  );
}
