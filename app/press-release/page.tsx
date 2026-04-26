import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PRESS_RELEASE } from "@/data/press-release";

/**
 * /press-release: mock launch announcement Vero would send when this hire
 * closes. Editorial press-release layout: PRESS RELEASE bar with dateline,
 * display headline, italic subhead, six body paragraphs in serif, three
 * pull-quote callouts in forest, facts-at-a-glance grid, About + Contact.
 *
 * Server component. All copy lives in /data/press-release.ts. The conceit is
 * the meta-move from the candidate's side, written as if the announcement
 * is already real. Read in 90 seconds.
 */

export const metadata: Metadata = {
  title: "Press release",
  description:
    "Mock launch announcement Vero would send when the founding GTM engineer hire closes. Read in 90 seconds.",
};

export default function PressReleasePage() {
  const pr = PRESS_RELEASE;

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Mock launch announcement"
        title={<>For immediate release.</>}
        subtitle="What Vero would send when this hire closes. Mocked as the meta-move from the candidate's side. Read in 90 seconds."
      />

      <article
        aria-label="Press release"
        className="mx-auto w-full max-w-3xl space-y-10 rounded-2xl border border-border/70 bg-card px-6 py-10 shadow-sm md:px-12 md:py-14"
      >
        {/* Header bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-forest-700">
            Press release
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
            {pr.dateline}
          </span>
        </header>

        {/* Headline + subhead */}
        <section className="space-y-5">
          <h2 className="font-display text-[28px] font-light leading-[1.1] tracking-tightest text-foreground md:text-[36px]">
            {pr.headline}
          </h2>
          <p className="font-display-italic text-[20px] leading-snug text-foreground/80 md:text-[22px]">
            {pr.subhead}
          </p>
        </section>

        <div className="rule" aria-hidden />

        {/* Body with interspersed quotes */}
        <section className="space-y-6">
          {pr.body.map((para, i) => (
            <Paragraph key={i} text={para} index={i} pr={pr} />
          ))}
        </section>

        {/* Quotes block (rendered after the body in case any didn't get
            interspersed; uses index hint above). */}

        {/* Facts at a glance */}
        <section
          aria-label="Facts at a glance"
          className="space-y-4 border-t border-border/70 pt-8"
        >
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Facts at a glance
          </h3>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {pr.factsAtAGlance.map((fact) => (
              <div
                key={fact.label}
                className="flex items-baseline justify-between gap-4 border-b border-dashed border-border/60 pb-2 font-mono text-[12px] tabular-nums"
              >
                <dt className="uppercase tracking-[0.18em] text-muted-foreground">
                  {fact.label}
                </dt>
                <dd className="text-right text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* About */}
        <section
          aria-label="About Vero"
          className="space-y-3 border-t border-border/70 pt-8"
        >
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            About Vero
          </h3>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            {pr.about}
          </p>
        </section>

        {/* Contact */}
        <section
          aria-label="Media contact"
          className="space-y-2 border-t border-border/70 pt-8"
        >
          <h3 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Media contact
          </h3>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            {pr.contact.name}
            <br />
            <a
              href={`mailto:${pr.contact.email}`}
              className="text-forest-700 underline underline-offset-4 decoration-forest-300 hover:decoration-forest-700"
            >
              {pr.contact.email}
            </a>
          </p>
          <p className="pt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            # # #
          </p>
        </section>
      </article>
    </div>
  );
}

/**
 * One body paragraph. After paragraphs 2, 3, and 5 we drop the matching
 * quote so the page reads like a real press release where quotes punctuate
 * the body, not a quote-wall at the bottom.
 *
 *   para 0 (lede)         → no quote
 *   para 1 (why now)      → no quote
 *   para 2 (what changes) → Adeel quote (clinical credibility framing)
 *   para 3 (founders)     → Bill quote (engineering framing)
 *   para 4 (90-day plan)  → Khush quote (mission framing)
 *   para 5 (closing)      → no quote
 */
function Paragraph({
  text,
  index,
  pr,
}: {
  text: string;
  index: number;
  pr: typeof PRESS_RELEASE;
}) {
  const quoteIndex =
    index === 2 ? 0 : index === 3 ? 1 : index === 4 ? 2 : null;
  return (
    <>
      <p className="text-pretty font-serif text-[16.5px] leading-[1.7] text-foreground/90">
        {text}
      </p>
      {quoteIndex !== null ? (
        <PullQuote quote={pr.quotes[quoteIndex]} />
      ) : null}
    </>
  );
}

/**
 * Forest-tinted callout block. Quote body in italic display, attribution
 * in mono small-caps below. Sits flush in the body flow.
 */
function PullQuote({ quote }: { quote: { who: string; role: string; body: string } }) {
  return (
    <figure className="my-2 rounded-xl border border-forest-200 bg-forest-50 px-6 py-5 md:px-8 md:py-6">
      <blockquote className="font-display-italic text-[18px] leading-snug text-forest-900 md:text-[19px]">
        &ldquo;{quote.body}&rdquo;
      </blockquote>
      <figcaption className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700">
        {quote.who} · {quote.role}
      </figcaption>
    </figure>
  );
}
