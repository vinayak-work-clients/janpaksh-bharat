"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { updatePassword } from "@/lib/admin/actions/auth";
import { Button } from "@/components/admin/ui/Button";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    startTransition(async () => {
      const result = await updatePassword({ password, confirm });
      if (result.ok) {
        toast.success("Password updated");
        setPassword("");
        setConfirm("");
      } else {
        setError(result.error ?? "Couldn't update the password");
        toast.error("Couldn't update the password", { description: result.error });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-md gap-5">
      <Field htmlFor="pw-new" label="New password" hint="At least 8 characters. Use a phrase you'll remember.">
        <Input id="pw-new" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="pw-new-hint" />
      </Field>
      <Field htmlFor="pw-confirm" label="Repeat new password" error={error ?? undefined}>
        <Input id="pw-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={Boolean(error) || undefined} aria-describedby={error ? "pw-confirm-error" : undefined} />
      </Field>
      <div>
        <Button type="submit" loading={pending}>
          Update password
        </Button>
      </div>
    </form>
  );
}
