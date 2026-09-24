"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { requestPasswordReset, signIn } from "@/lib/admin/actions/auth";
import { Button } from "@/components/admin/ui/Button";
import { Field } from "@/components/admin/ui/Field";
import { Input } from "@/components/admin/ui/Input";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resetting, startReset] = useTransition();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn({ email, password, next });
      // On success the action redirects and never returns.
      if (result && !result.ok) setError(result.error ?? "Wrong email or password");
    });
  };

  const onForgot = () => {
    if (!email.trim()) {
      setError("Enter your email address first, then tap “Forgot password”.");
      return;
    }
    startReset(async () => {
      const result = await requestPasswordReset(email);
      if (result.ok) toast.success("Check your inbox", { description: `We emailed a password reset link to ${email.trim()}.` });
      else toast.error("Couldn't send the reset email", { description: result.error });
    });
  };

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5">
      <Field htmlFor="login-email" label="Email">
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={Boolean(error) || undefined}
        />
      </Field>
      <Field htmlFor="login-password" label="Password" error={error ?? undefined}>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "login-password-error" : undefined}
        />
      </Field>
      <Button type="submit" size="lg" loading={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <button
        type="button"
        onClick={onForgot}
        disabled={resetting}
        className="justify-self-center font-sans text-[0.85rem] font-medium text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50"
      >
        {resetting ? "Sending reset email…" : "Forgot password?"}
      </button>
    </form>
  );
}
