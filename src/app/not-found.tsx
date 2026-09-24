import Link from "next/link";

/** Root fallback; the public 404 with full chrome lives in (site)/not-found.tsx. */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-2 px-6 text-center">
      <p className="font-sans text-kicker uppercase text-breaking">Error 404</p>
      <h1 className="mt-4 font-serif text-h1 text-ink">This page doesn&apos;t exist.</h1>
      <Link
        href="/"
        className="mt-8 font-sans text-sm font-medium text-ink underline underline-offset-4 hover:text-saffron-dark"
      >
        Back to the front page
      </Link>
    </div>
  );
}
