import type { LegalDoc } from "@/data/legal";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/PageHero";
import { Kicker } from "@/components/ui/Kicker";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero variant="light" eyebrow="Legal" title={doc.title} titleHindi={doc.titleHindi} description={doc.intro}>
        <p className="font-sans text-[0.85rem] text-muted">
          Last updated <time dateTime={doc.lastUpdated}>{formatDate(doc.lastUpdated, "d MMMM yyyy")}</time>
          <span aria-hidden="true"> · </span>
          <span className="rounded-full border border-rule px-2 py-0.5 text-[0.7rem] uppercase tracking-[0.12em]">Placeholder draft</span>
        </p>
      </PageHero>

      <section className="container-editorial py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <article className="lg:col-span-8">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className={`font-serif text-h3 text-ink ${i === 0 ? "" : "mt-12"}`}>{s.title}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="mt-4 max-w-[68ch] font-sans text-[1.05rem] leading-[1.75] text-ink">{p}</p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2.5 font-sans text-[1.05rem] leading-relaxed text-ink">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-4">
                        <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>

          <aside className="order-first lg:order-none lg:col-span-3 lg:col-start-10">
            <nav aria-label="On this page" className="lg:sticky lg:top-28">
              <Kicker dot>On this page</Kicker>
              <ol className="hairline mt-3 divide-y divide-rule">
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block py-2.5 font-sans text-[0.9rem] text-muted transition-colors hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        </div>
      </section>
    </>
  );
}
