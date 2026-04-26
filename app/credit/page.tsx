/**
 * /credit, the acknowledgements ledger.
 *
 * A founder reading the demo will eventually pattern-match candidate
 * character via attribution. This page exists so they can scan the
 * libraries this lean on, the datasets cited, the editorial software
 * borrowed from, the books and articles whose frames are doing actual
 * work in the strategy, and the people on the hiring panel by name.
 *
 * Server component. Data lives in data/credit.ts; rendering is a flat
 * map over five sections, each a 2-col grid of CreditCard.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CreditCard } from "@/components/credit-card";
import { CREDIT, type CreditSection } from "@/data/credit";

export const metadata: Metadata = {
  title: "Credit",
  description:
    "Acknowledgements: the libraries, datasets, designers, ideas, and people that made the Vero GTM demo possible.",
};

export default function CreditPage() {
  const totalEntries = CREDIT.sections.reduce(
    (sum, s) => sum + s.entries.length,
    0,
  );

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Acknowledgements"
        title={<>Standing on shoulders.</>}
        subtitle="The libraries, datasets, designers, ideas, and people that made this demo possible. None of this is invented from scratch."
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{totalEntries}</span>{" "}
          acknowledgements
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">
            {CREDIT.sections.length}
          </span>{" "}
          sections
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          external links open in a new tab
        </span>
      </div>

      <p className="max-w-2xl font-serif text-[15px] leading-relaxed text-foreground/85">
        {CREDIT.intro}
      </p>

      <div className="space-y-14">
        {CREDIT.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}

function Section({ section }: { section: CreditSection }) {
  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {section.label} · {String(section.entries.length).padStart(2, "0")}
        </div>
        <p className="max-w-xl font-serif text-[15px] leading-relaxed text-foreground/85">
          {section.blurb}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-lg border border-border/60 bg-card p-6 md:grid-cols-2">
        {section.entries.map((entry) => (
          <CreditCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
