import { ArrowLeft } from "lucide-react";
import { Kicker } from "@/components/ui/Kicker";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="hairline-b flex min-h-[70vh] items-center bg-paper-2">
      <div className="container-editorial py-20">
        <Kicker dot tone="breaking">
          Error 404
        </Kicker>
        <h1 className="mt-4 font-serif text-display text-ink">
          This story has moved on.
        </h1>
        <p lang="hi" className="hindi mt-3 text-[clamp(1.1rem,2vw,1.5rem)] text-saffron-dark">
          यह पन्ना मौजूद नहीं है
        </p>
        <p className="mt-6 max-w-xl font-sans text-[1.05rem] leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist, or it may have
          been archived — stories on Janpaksh Bharat auto-archive after 30 days.
        </p>
        <div className="mt-10">
          <Button href="/" variant="secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the front page
          </Button>
        </div>
      </div>
    </section>
  );
}
