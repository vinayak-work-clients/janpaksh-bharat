import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Ads" };

export default async function AdsPage() {
  await requireAdmin();
  return <ComingSoon what="Ad management" detail="Upload creatives per slot, schedule them and switch them on or off. Until then the placeholder creatives keep running." />;
}
