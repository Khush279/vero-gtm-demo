/**
 * /vs-tali. The comparison page Vero would actually publish at
 * veroscribe.com/vs-tali. The strategy memo names Tali (Toronto-built,
 * Canadian, ~$300/mo) as the real competitive moat threat. This is the
 * page Khush would ship in week 1 against that threat.
 *
 * Structure mirrors the SEO comparison playbook in /playbooks: TLDR
 * above the fold, pricing block as the editorial anchor, feature matrix,
 * an honest "where Tali is better" section, two physician quotes, FAQ
 * with FAQPage JSON-LD schema, CTA. Server component. No JS required;
 * the FAQ accordion is native <details>/<summary>.
 */

import type { Metadata } from "next";
import Script from "next/script";
import { PageHeader } from "@/components/page-header";
import { VsFeatureRow } from "@/components/vs-feature-row";
import { VsFaqAccordion } from "@/components/vs-faq-accordion";
import { VS_TALI } from "@/data/vs-tali";

export const metadata: Metadata = {
  title: "Vero vs Tali AI",
  description:
    "Honest side-by-side of two Canadian-built AI medical scribes. Pricing, EMR coverage, doc upload, Ontario VoR, and where Tali is genuinely the better pick.",
};

export default function VsTaliPage() {
  const { intro, pricingDelta, featureMatrix, whereTaliIsBetter, quotes, faq, ctaBlock } =
    VS_TALI;

  const veroWins = featureMatrix.filter((r) => r.whoWins === "vero").length;
  const taliWins = featureMatrix.filter((r) => r.whoWins === "tali").length;
  const ties = featureMatrix.filter((r) => r.whoWins === "tie").length;

  // FAQPage JSON-LD. Keeps the FAQ block eligible for rich-result snippets,
  // which is the highest-ROI schema for a comparison page (per the SEO
  // playbook).
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="space-y-14">
      <PageHeader
        kicker="Comparison · Updated April 2026"
        title={<>Vero vs Tali AI</>}
        subtitle={<>{intro}</>}
      />

      {/* TLDR callout */}
      <section className="rounded-lg border border-border/60 bg-card p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            TLDR
          </div>
          <div className="font-mono text-[10.5px] tabular-nums text-muted-foreground/80">
            {veroWins} Vero · {taliWins} Tali · {ties} tie
          </div>
        </div>
        <ul className="mt-4 space-y-2.5 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              Vero is{" "}
              <strong className="font-medium">
                ${pricingDelta.vero.toLocaleString()}/yr
              </strong>{" "}
              versus Tali at{" "}
              <strong className="font-medium">
                ${pricingDelta.tali.toLocaleString()}/yr
              </strong>
              . Same SOAP-quality output. {pricingDelta.ratio} delta.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              Vero ships 150+ specialty templates and ingests doc uploads
              (referral letters, prior auths, patient PDFs). Tali does not.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              Tali wins on native mobile apps and phone support. If your
              clinic charts from a phone or wants a phone line, pick Tali.
            </span>
          </li>
        </ul>
      </section>

      {/* Editorial price section */}
      <section className="space-y-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          The price section
        </div>
        <div className="rounded-lg border border-border/60 bg-paper p-7 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-baseline md:gap-10">
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest-700">
                Vero
              </div>
              <div className="font-display text-[44px] font-light leading-none tracking-tightest text-foreground md:text-[56px]">
                ${pricingDelta.vero.toLocaleString()}
                <span className="ml-1 font-mono text-[12px] tracking-normal text-muted-foreground">
                  /yr
                </span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                $59.99/mo on the annual plan
              </div>
            </div>

            <div
              className="hidden font-display text-[28px] font-light text-muted-foreground/60 md:block"
              aria-hidden
            >
              vs
            </div>

            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ochre-700">
                Tali
              </div>
              <div className="font-display text-[44px] font-light leading-none tracking-tightest text-foreground/80 md:text-[56px]">
                ${pricingDelta.tali.toLocaleString()}
                <span className="ml-1 font-mono text-[12px] tracking-normal text-muted-foreground">
                  /yr
                </span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                ~$299/mo, no public annual discount
              </div>
            </div>
          </div>
          <div className="mt-7 border-t border-border/60 pt-5">
            <p className="font-display text-[22px] font-light leading-snug tracking-tight text-foreground md:text-[26px]">
              Same SOAP-quality output. {pricingDelta.ratio} the spend.
            </p>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              Run both for 14 days on the same patient panel. The note quality
              is at parity. The bill is not.
            </p>
          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Feature matrix · {featureMatrix.length} rows
          </div>
          <div className="font-mono text-[10.5px] text-muted-foreground/80">
            Forest pill = Vero · Ochre pill = Tali · Muted = tie
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border border-border/60 bg-card">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="w-[44%] px-4 py-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                  Feature
                </th>
                <th className="w-[22%] px-4 py-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                  Vero
                </th>
                <th className="w-[22%] px-4 py-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                  Tali
                </th>
                <th className="w-[12%] px-4 py-2.5 text-right font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted-foreground">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((row, i) => (
                <VsFeatureRow key={row.feature} row={row} zebra={i % 2 === 1} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Where Tali is better. Honest section, deliberately styled differently */}
      <section className="space-y-4">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Where Tali is better
        </div>
        <div className="space-y-4 border-l-2 border-ochre-300 bg-ochre-50/40 py-2 pl-5 pr-2 md:pl-6">
          <p className="font-display-italic text-[16px] leading-relaxed text-foreground/75 md:text-[17px]">
            Three places Tali genuinely wins. We are naming them on our own
            comparison page because pretending otherwise is the fastest way to
            lose a clinician&apos;s trust.
          </p>
          <ul className="space-y-5">
            {whereTaliIsBetter.map((item, i) => (
              <li key={item.feature} className="space-y-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tabular-nums text-ochre-700/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[18px] tracking-tight text-foreground">
                    {item.feature}
                  </h3>
                </div>
                <p className="pl-7 text-pretty text-[13.5px] leading-relaxed text-foreground/80">
                  {item.explanation}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Physician quotes */}
      <section className="space-y-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          From clinicians on both sides
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <figure
              key={q.who}
              className="flex flex-col justify-between gap-5 rounded-lg border border-border/60 bg-card p-5"
            >
              <blockquote className="font-serif text-[15.5px] leading-relaxed text-foreground/90">
                <span
                  aria-hidden
                  className="mr-1 font-display text-[28px] leading-none text-primary/40"
                >
                  &ldquo;
                </span>
                {q.body}
              </blockquote>
              <figcaption className="border-t border-border/50 pt-3">
                <div className="text-[13px] font-medium text-foreground">
                  {q.who}
                </div>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  {q.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground/70">
          Quotes are illustrative for this demo build. The published page on
          veroscribe.com would carry full names and verified clinician
          consent.
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          FAQ
        </div>
        <VsFaqAccordion items={faq} />
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-primary/20 bg-forest-50/60 p-7 md:p-10">
        <div className="space-y-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700">
            Try it
          </div>
          <h2 className="font-display text-[28px] font-light leading-tight tracking-tight text-foreground md:text-[34px]">
            {ctaBlock.headline}
          </h2>
          <p className="max-w-xl text-pretty text-[14.5px] leading-relaxed text-foreground/80">
            {ctaBlock.body}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start the 14-day trial
          </a>
          <a
            href="#"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-[13.5px] text-foreground transition-colors hover:bg-muted"
          >
            Connect me with a clinician using both
          </a>
        </div>
      </section>

      {/* JSON-LD: FAQPage schema. Lives at the bottom of the page so it does
          not block initial paint. Eligible for FAQ rich snippets in Google
          SERPs, which is the highest-ROI schema for comparison pages. */}
      <Script
        id="vs-tali-faq-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
