/**
 * /sources, the receipts ledger.
 *
 * A founder reading the demo will eventually ask "where does this number
 * come from?" This page pre-empts the question. Every claim across the
 * demo, mapped to its citation, with the synthetic data clearly labeled
 * and a day-1 plan for replacing the mocks.
 *
 * Server component. Data lives in data/sources.ts; rendering is a flat
 * group-by-category list of SourceRow.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SourceRow } from "@/components/source-row";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  SOURCES,
  type Source,
  type SourceCategory,
} from "@/data/sources";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Every claim in the Vero GTM demo, mapped to its source. Synthetic data is labeled with a day-1 swap plan.",
};

const DAY_ONE_SWAPS: { title: string; detail: string }[] = [
  {
    title: "Real CPSO scrape",
    detail:
      "Run scripts/scrape-cpso.ts at 1 request per second behind the public User-Agent already declared. Replaces the 500-lead Mulberry32 fixture with the live ~10,500 reachable Ontario FPs.",
  },
  {
    title: "Search Console pull",
    detail:
      "Authenticate the Vero Search Console property and replace the illustrative click and position numbers on /analytics with the trailing 90-day export. Wire a nightly cron so the page stays live.",
  },
  {
    title: "Stripe ARR pull",
    detail:
      "Read paid-provider count and MRR from Stripe instead of the static '5,000+ paying providers' string. Keeps the headline honest as the number moves week to week.",
  },
  {
    title: "Attio sync for enterprise pipeline",
    detail:
      "Replace data/enterprise.json with a server-side fetch from Attio's API. Stage transitions, champion notes, and contract values live in CRM, not in a JSON file.",
  },
  {
    title: "GA4 plus Stripe join for funnel attribution",
    detail:
      "Stand up a small ETL that joins GA4 first-touch with Stripe trial-to-paid events, keyed on email. Replaces the illustrative funnel attribution figures on /analytics.",
  },
];

export default function SourcesPage() {
  const counts = countByCategory(SOURCES);
  const totalSources = SOURCES.length;
  const syntheticCount = counts["synthetic-data"] ?? 0;

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Where every number comes from"
        title={<>The receipts.</>}
        subtitle="Each claim in this demo, mapped to its source. Synthetic data is labeled. Day-1 priorities for replacing synthetic with real are listed below the table."
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{totalSources}</span>{" "}
          claims cited
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">
            {totalSources - syntheticCount}
          </span>{" "}
          public
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{syntheticCount}</span>{" "}
          synthetic, labeled
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          external links open in a new tab
        </span>
      </div>

      <div className="space-y-14">
        {CATEGORY_ORDER.map((cat) => {
          const rows = SOURCES.filter((s) => s.category === cat);
          if (rows.length === 0) return null;
          return <CategorySection key={cat} category={cat} rows={rows} />;
        })}
      </div>

      <DayOneSwaps />
    </div>
  );
}

function CategorySection({
  category,
  rows,
}: {
  category: SourceCategory;
  rows: Source[];
}) {
  const meta = CATEGORY_META[category];
  return (
    <section className="space-y-4">
      <header className="space-y-1.5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {meta.label} · {String(rows.length).padStart(2, "0")}
        </div>
        <p className="max-w-xl font-serif text-[15px] leading-relaxed text-foreground/85">
          {meta.blurb}
        </p>
      </header>
      <div className="rounded-lg border border-border/60 bg-card px-5">
        {rows.map((row) => (
          <SourceRow key={row.id} source={row} />
        ))}
      </div>
    </section>
  );
}

function DayOneSwaps() {
  return (
    <section className="space-y-4">
      <header className="space-y-1.5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Day-1 swaps · {String(DAY_ONE_SWAPS.length).padStart(2, "0")}
        </div>
        <h2 className="font-display text-[24px] font-light tracking-tight text-foreground">
          Synthetic out, real in. First day at Vero.
        </h2>
        <p className="max-w-xl font-serif text-[15px] leading-relaxed text-foreground/85">
          The shortest path from this demo to a live system. Each item is one
          afternoon of work or less.
        </p>
      </header>
      <ol className="overflow-hidden rounded-lg border border-border/60 bg-card">
        {DAY_ONE_SWAPS.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-4 border-t border-border/60 px-5 py-4 first:border-t-0"
          >
            <span className="shrink-0 pt-0.5 font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="space-y-1">
              <div className="font-display text-[16px] tracking-tight text-foreground">
                {s.title}
              </div>
              <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                {s.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function countByCategory(sources: Source[]): Record<SourceCategory, number> {
  const out = {
    tam: 0,
    competitive: 0,
    compliance: 0,
    product: 0,
    playbook: 0,
    "synthetic-data": 0,
  } satisfies Record<SourceCategory, number>;
  for (const s of sources) {
    out[s.category] += 1;
  }
  return out;
}
