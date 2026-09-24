import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/admin/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

interface Props {
  searchParams: { next?: string; error?: string };
}

const ERRORS: Record<string, string> = {
  forbidden: "That account isn't an admin of Janpaksh Bharat. Sign in with the admin email.",
  expired: "Your session ended. Please sign in again.",
};

export default function LoginPage({ searchParams }: Props) {
  const next = typeof searchParams.next === "string" ? searchParams.next : undefined;
  const notice = searchParams.error ? ERRORS[searchParams.error] : undefined;

  return (
    <div className="w-full max-w-[26rem]">
      <div className="mb-6 flex justify-center">
        <Logo size="menu" asSpan />
      </div>
      <div className="border border-rule bg-paper p-6 shadow-sm sm:p-8">
        <h1 className="font-serif text-[1.6rem] font-semibold leading-tight text-ink">Sign in</h1>
        <p className="mt-1.5 font-sans text-[0.9rem] text-muted">The newsroom dashboard. Admins only.</p>
        {notice && (
          <p role="alert" className="mt-4 border-l-2 border-breaking bg-breaking/5 px-3 py-2 font-sans text-[0.85rem] text-ink">
            {notice}
          </p>
        )}
        <LoginForm next={next} />
      </div>
      <p className="mt-6 text-center font-sans text-[0.78rem] text-muted">
        Trouble signing in? Contact the site developer.
      </p>
    </div>
  );
}
