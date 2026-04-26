/**
 * /faq. Single index that aggregates every FAQ scattered across /docs,
 * /objections, /vs-tali, /vs-dax, /vs-suki, and /interview-prep into one
 * organised lookup. Distilled, not copy-pasted: questions that appear in
 * multiple sources are merged, language is simplified, and every entry
 * links back to the surface where it lives in deeper context.
 *
 * Server component. The search filter is URL-driven (`?q=pricing`) so it
 * works with no client JS, and the accordion uses native <details>. A
 * founder skimming on a phone with JS off still gets the full page.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { FaqSearchBar } from "@/components/faq-search-bar";
import { FaqEntry } from "@/components/faq-entry";
import { MASTER_FAQ, filterEntries } from "@/data/faq-master";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "30+ questions distilled from across the Vero GTM demo. Pricing, compliance, workflow, sales process, and how the demo itself was built.",
};

export default function FaqPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.trim() ?? "";
  const buckets = filterEntries(query);
  const totalAll = MASTER_FAQ.reduce((sum, c) => sum + c.entries.length, 0);
  const totalShown = buckets.reduce((sum, b) => sum + b.entries.length, 0);

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="One index, every answer"
        title={<>The FAQ.</>}
        subtitle="30+ questions distilled from across the demo. Every answer links back to the surface where it lives in deeper context."
      />

      <FaqSearchBar defaultValue={query} />

      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {query ? (
            <>
              {totalShown} of {totalAll} match{" "}
              <span className="text-foreground">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            <>{totalAll} questions across {MASTER_FAQ.length} categories</>
          )}
        </p>
        <nav
          aria-label="Jump to category"
          className="hidden flex-wrap items-center gap-x-3 gap-y-1 md:flex"
        >
          {MASTER_FAQ.map((category) => (
            <a
              key={category.id}
              href={`#cat-${category.id}`}
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
            >
              {category.label}
            </a>
          ))}
        </nav>
      </div>

      {buckets.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="space-y-12">
          {buckets.map(({ category, entries }) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              className="scroll-mt-24 space-y-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                    {category.label}
                  </div>
                  <h2 className="font-display text-[22px] tracking-tight text-foreground">
                    {category.description}
                  </h2>
                </div>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                  {entries.length} {entries.length === 1 ? "answer" : "answers"}
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
                {entries.map((entry, i) => (
                  <FaqEntry key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-card px-6 py-10 text-center">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        No matches
      </p>
      <p className="mt-2 max-w-md mx-auto text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/85">
        Nothing in the index matches{" "}
        <span className="font-mono text-[13px] text-foreground">
          &ldquo;{query}&rdquo;
        </span>
        . Try a broader term like pricing, compliance, EMR, or trial, or{" "}
        <a
          href="/faq"
          className="underline decoration-dotted underline-offset-4 hover:text-foreground"
        >
          clear the filter
        </a>
        .
      </p>
    </div>
  );
}
