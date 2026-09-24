import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireAdmin();
  return <ComingSoon what="The inbox" detail="Contact-form messages are already being stored. Reading, replying and archiving them lands in the next phase." />;
}
