/**
 * /qa-summary — the post-call leave-behind.
 *
 * Companion to /interview-prep. That page is the rehearsal artifact: 15
 * structured cards. This page is what Adeel and Bill open the Friday after
 * the interview to remember what was said. Five takeaways, each one a
 * synthesis of two or three of the 15 prep cards. One pull-quote per
 * takeaway, designed to be copy-pasteable into a Slack DM.
 *
 * Server component. Only client work is the Print this button island.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { QA_SUMMARY } from "@/data/qa-summary";
import { cn } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const metadata: Metadata = {
  title: "Q&A summary",
  description:
    "Post-call leave-behind. Five things Adeel and Bill should remember from the interview if they forget everything else.",
};

const NUMBER_PALETTE = [
  "text-ochre-500",
  "text-forest-700",
  "text-ochre-500",
  "text-forest-700",
  "text-ochre-500",
] as const;

export default function QaSummaryPage() {
  const { intro, takeaways, oneLineCloser } = QA_SUMMARY;

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Post-call leave-behind"
        title={<>Five things to remember.</>}
        subtitle="If you forget everything else from this interview, remember these. Each one is the synthesized answer to 2-3 of the questions Adeel and Bill are most likely to ask."
        rightSlot={<PrintButton />}
      />

      <p className="max-w-2xl text-pretty font-serif text-[15px] leading-relaxed text-muted-foreground">
        {intro}
      </p>

      <div className="rule" />

      <ol className="space-y-14">
        {takeaways.map((t, i) => {
          const numberColor = NUMBER_PALETTE[i % NUMBER_PALETTE.length];
          return (
            <li
              key={t.id}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 md:gap-x-10"
            >
              <div
                className={cn(
                  "font-display text-[64px] font-light leading-none tracking-tightest tabular-nums",
                  numberColor,
                )}
                aria-hidden
              >
                {i + 1}
              </div>

              <div className="space-y-4 pt-2">
                <p className="font-display text-[22px] leading-[1.25] tracking-tight text-foreground text-balance">
                  &ldquo;{t.pull}&rdquo;
                </p>

                <p className="max-w-2xl text-pretty font-serif text-[15px] leading-relaxed text-foreground/85">
                  {t.body}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <EvidencePill evidence={t.evidence} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    Derived from {t.derivedFrom.join(" · ")}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="rule" />

      <section
        aria-label="Closing line"
        className="rounded-md border border-forest-700/25 bg-forest-50 px-6 py-10 md:px-10 md:py-14"
      >
        <p className="font-display-italic text-[28px] leading-[1.2] tracking-tight text-forest-900 text-balance md:text-[28px]">
          {oneLineCloser}
        </p>
      </section>
    </div>
  );
}

/**
 * Renders the evidence string as a forest pill. If the evidence string starts
 * with a slash, the leading token is treated as a route and turned into a
 * link; the rest of the string follows as muted descriptor text inside the
 * pill. If there is no leading slash the whole thing renders as static text.
 */
function EvidencePill({ evidence }: { evidence: string }) {
  const trimmed = evidence.trim();
  if (!trimmed.startsWith("/")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-700/25 bg-forest-100/70 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-800">
        Evidence: {trimmed}
      </span>
    );
  }

  const firstSpace = trimmed.indexOf(" ");
  const href = firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace);
  const tail = firstSpace === -1 ? "" : trimmed.slice(firstSpace + 1);

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-full border border-forest-700/25 bg-forest-100/70 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-800 transition-colors hover:bg-forest-200/80"
    >
      <span className="text-forest-700/70">Evidence:</span>
      <span className="text-forest-800 group-hover:text-forest-900">
        {href}
      </span>
      {tail ? (
        <span className="text-forest-700/70 normal-case tracking-normal">
          {tail}
        </span>
      ) : null}
    </Link>
  );
}
