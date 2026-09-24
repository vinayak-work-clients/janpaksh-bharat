import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { Card } from "@/components/admin/ui/Card";
import { PasswordForm } from "@/components/admin/auth/PasswordForm";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: { reset?: string } }) {
  const { user } = await requireAdmin();
  const fromReset = searchParams.reset === "1";

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Card title="Signed in as">
          <p className="break-all font-sans text-[1rem] font-medium text-ink">{user.email}</p>
          <dl className="mt-4 grid gap-2 font-sans text-[0.85rem] text-muted">
            <div className="flex justify-between gap-4">
              <dt>Admin since</dt>
              <dd className="text-ink">{user.created_at ? formatDate(user.created_at) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Last sign-in</dt>
              <dd className="text-ink">{user.last_sign_in_at ? formatDate(user.last_sign_in_at, "d MMM yyyy, HH:mm") : "—"}</dd>
            </div>
          </dl>
        </Card>
      </div>
      <div className="lg:col-span-7">
        <Card title="Change password">
          {fromReset && (
            <p className="mb-4 border-l-2 border-saffron bg-saffron/10 px-3 py-2 font-sans text-[0.85rem] text-ink">
              You&rsquo;re signed in from the reset link. Choose a new password below.
            </p>
          )}
          <PasswordForm />
        </Card>
      </div>
    </div>
  );
}
