import { Badge, type BadgeTone } from "@/components/admin/ui/Badge";
import { adminStatus, expiryLabel, expiryTone, type AdminStatus } from "@/lib/admin/expiry";
import { cn } from "@/lib/utils";

const STATUS: Record<AdminStatus, { label: string; tone: BadgeTone }> = {
  published: { label: "Published", tone: "success" },
  draft: { label: "Draft", tone: "muted" },
  expired: { label: "Expired", tone: "breaking" },
};

export function StatusBadge({ status, expiresAt, className }: { status: "draft" | "published"; expiresAt: string; className?: string }) {
  const s = STATUS[adminStatus(status, expiresAt)];
  return (
    <Badge tone={s.tone} className={className} dot={s.tone === "success"}>
      {s.label}
    </Badge>
  );
}

/** "in 23 days" coloured by urgency; a red "Expired" badge once past. */
export function ExpiryBadge({ expiresAt, className }: { expiresAt: string; className?: string }) {
  const tone = expiryTone(expiresAt);
  if (tone === "expired") {
    return (
      <Badge tone="breaking" className={className}>
        Expired
      </Badge>
    );
  }
  const color = { muted: "text-muted", saffron: "text-saffron-dark", breaking: "text-breaking font-semibold" }[tone];
  return <span className={cn("whitespace-nowrap font-sans text-[0.85rem]", color, className)}>{expiryLabel(expiresAt)}</span>;
}
