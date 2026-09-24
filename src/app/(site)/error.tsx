"use client";

import { useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="hairline-b flex min-h-[70vh] items-center bg-paper-2">
      <div className="container-editorial py-20">
        <Kicker dot tone="breaking">
          Something went wrong
        </Kicker>
        <h1 className="mt-4 font-serif text-display text-ink">We couldn&rsquo;t load this page.</h1>
        <p lang="hi" className="hindi mt-3 text-[clamp(1.1rem,2vw,1.5rem)] text-saffron-dark">
          कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें
        </p>
        <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-muted">
          The newsroom is still here. Try again in a moment, or go back to the front page.
          {error.digest && <span className="mt-2 block font-sans text-[0.75rem] text-muted/70">Reference {error.digest}</span>}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={reset} variant="primary">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
          <Button href="/" variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Front page
          </Button>
        </div>
      </div>
    </section>
  );
}
