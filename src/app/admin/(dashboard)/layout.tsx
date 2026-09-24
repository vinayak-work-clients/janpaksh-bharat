import { requireAdmin } from "@/lib/admin/auth";
import { getUnreadMessageCount } from "@/lib/admin/queries";
import { Shell } from "@/components/admin/Shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { supabase, user } = await requireAdmin();
  const unread = await getUnreadMessageCount(supabase);
  return (
    <Shell email={user.email ?? ""} unread={unread}>
      {children}
    </Shell>
  );
}
