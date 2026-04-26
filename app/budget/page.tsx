import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { BudgetTable } from "@/components/budget-table";
import { BUDGET, BUDGET_CURRENCY_FMT } from "@/data/budget";

export const metadata: Metadata = {
  title: "Q4 GTM budget",
  description:
    "Line-item Q4 GTM budget proposal for Vero. $180k, 14 lines, every line with rationale, expected return, and an owner. Guardrails for what is not funded sit below the table.",
};

export default function BudgetPage() {
  const { lines, totalProposed, totalApprovedPrior, intro, guardrails, quarter } =
    BUDGET;

  // Stats for the strip below the header.
  const biggestLine = lines.reduce((max, l) =>
    l.quarterlyAmount > max.quarterlyAmount ? l : max,
  );

  // Weighted ROI summary: sum the modeled MRR uplift and compare against
  // proposed spend. Numbers are illustrative; the math here is the same shape
  // as the Q3 actuals on the channel-mix page so the demo reads as one product.
  const modeledMrrUplift = 18000 + 6800 + 3500; // content lead + webinar pilot + comparison page lift
  const modeledQuarterlyReturn = modeledMrrUplift * 3;
  const weightedRoi = modeledQuarterlyReturn / totalProposed;

  const deltaToPrior = totalProposed - totalApprovedPrior;

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Q4 GTM proposal"
        title={<>The line-item budget.</>}
        subtitle="$180k for Q4. Each line has rationale, expected return, and an owner. Lines I'm not funding sit below the table; they matter as much as what's in."
      />

      <p className="max-w-3xl text-pretty font-serif text-[15.5px] leading-relaxed text-foreground/85">
        {intro}
      </p>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 lg:grid-cols-4">
        <Stat
          label="Total proposed"
          value={BUDGET_CURRENCY_FMT.format(totalProposed)}
          sub={quarter}
        />
        <Stat
          label="Prior quarter spend"
          value={BUDGET_CURRENCY_FMT.format(totalApprovedPrior)}
          sub={`+${BUDGET_CURRENCY_FMT.format(deltaToPrior)} incremental`}
        />
        <Stat
          label="Weighted ROI"
          value={`${weightedRoi.toFixed(2)}x`}
          sub="Modeled Q4 return on proposed spend"
        />
        <Stat
          label="Biggest single line"
          value={BUDGET_CURRENCY_FMT.format(biggestLine.quarterlyAmount)}
          sub={biggestLine.label}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Line items · grouped by category
          </h2>
          <p className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {lines.length} lines · sums to{" "}
            {BUDGET_CURRENCY_FMT.format(totalProposed)}
          </p>
        </div>
        <BudgetTable lines={lines} />
        <p className="font-mono text-[10px] text-muted-foreground/70">
          Monthly columns are run-rate; one-time spend (SOC 2 toolkit, recruiter
          retainer) shows $0 monthly and the lump sum in quarterly.
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-border/60 bg-card p-6">
        <header className="space-y-1">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Guardrails
          </div>
          <h2 className="font-display text-[22px] font-light tracking-tight text-foreground">
            What I am not funding this quarter.
          </h2>
        </header>
        <ul className="space-y-3">
          {guardrails.map((g, i) => (
            <li
              key={i}
              className="flex gap-3 text-pretty text-[13.5px] leading-relaxed text-foreground/85"
            >
              <span className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ochre-500/80" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-forest-200 bg-forest-50/60 p-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700">
          Decision rule
        </div>
        <p className="mt-3 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          If MRR by mid-Q4 trails by more than 15%, kill the LinkedIn experiment
          first. If Maple expansion lands, double the OntarioMD webinar budget.
          Both pre-committed.
        </p>
        <p className="mt-3 font-mono text-[11px] tabular-nums text-forest-700/80">
          Mid-Q4 review · Day 45 of the quarter · owner: Khush
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-card p-3.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="font-display text-[22px] font-light leading-none tabular-nums text-foreground">
        {value}
      </div>
      {sub ? (
        <div className="font-mono text-[10px] text-muted-foreground/80">
          {sub}
        </div>
      ) : null}
    </div>
  );
}
