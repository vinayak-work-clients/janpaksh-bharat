import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  return <ComingSoon what="Site settings" detail="Logo, tagline, contact details, social links and the hero poster will be editable here in the next phase." />;
}
