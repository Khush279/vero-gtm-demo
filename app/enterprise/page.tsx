/**
 * /enterprise — the institution lane.
 *
 * Two-column layout: a procurement-style worksheet on the left (one expandable
 * card per hospital system / large clinic group) and a sticky RFP playbook
 * panel on the right with pre-drafted answers to the six questions Ontario
 * Health procurement teams always ask.
 *
 * The framing is explicit: Vero already holds the Ontario Health VoR slot,
 * which is the single hardest piece of the enterprise puzzle in this market.
 * The cards and the playbook show how I'd convert that asset into named-account
 * pipeline in week 1.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { EnterpriseCard } from "@/components/enterprise-card";
import { ENTERPRISE } from "@/data/enterprise";
import {
  PIPEDA_COMPLIANCE,
  DATA_RESIDENCY,
  BAA_AVAILABILITY,
  AUDIT_LOGGING,
  SOC2_STATUS,
  SECURITY_QUESTIONNAIRE,
} from "@/data/rfp-answers";

export const metadata: Metadata = {
  title: "Enterprise",
  description:
    "Hospital-system pipeline with named champions and a pre-filled Ontario Health Vendor of Record response template covering the six standard procurement questions.",
};

/**
 * Stage-weighted ARR. We don't want a flat sum (every prospect at $X) — that
 * inflates pipeline and isn't how a real GTM engineer would talk to a
 * founder. Weights match what most enterprise SaaS forecasters use.
 */
const STAGE_WEIGHT: Record<string, number> = {
  discovery: 0.05,
  qualified: 0.15,
  rfp_issued: 0.3,
  rfp_response: 0.45,
  shortlisted: 0.6,
  negotiation: 0.75,
  closed_won: 1,
  closed_lost: 0,
};

/** Compact $1.2M / $850k formatter for the top stats row. */
function formatArr(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    const s = m.toFixed(1);
    return `$${s.endsWith(".0") ? s.slice(0, -2) : s}M`;
  }
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}k`;
  return `$${amount}`;
}

const RFP_BLOCKS: { id: string; question: string; answer: string }[] = [
  { id: "pipeda", question: "PIPEDA compliance", answer: PIPEDA_COMPLIANCE },
  { id: "residency", question: "Data residency", answer: DATA_RESIDENCY },
  { id: "baa", question: "Business Associate Agreements", answer: BAA_AVAILABILITY },
  { id: "audit", question: "Audit logging", answer: AUDIT_LOGGING },
  { id: "soc2", question: "SOC 2 status", answer: SOC2_STATUS },
  { id: "questionnaire", question: "Vendor security questionnaire", answer: SECURITY_QUESTIONNAIRE },
];

const DAY_ONE_PRIORITIES = [
  "Pull every Ontario Health VoR-eligible institution into a named-account list and assign owner / next-touch in Attio inside week 1.",
  "Stand up a one-page RFP-response generator that ingests Vero's existing security docs and outputs the six answer blocks below pre-filled per institution.",
  "Map procurement champions (CMIO, CIO, privacy officer) at the top 10 Ontario systems and seed warm intros via OntarioMD and the OHA networks.",
  "Templatise the SOC 2 Type I evidence packet so a procurement reviewer gets it within 24 hours of asking. That's the bar most early vendors miss.",
  "Build a quarterly enterprise pipeline review with Adeel and Bill: stage progression, weighted ARR, blocker log, and one experiment per quarter on procurement velocity.",
];

export default function EnterprisePage() {
  const accounts = ENTERPRISE;
  const total = accounts.length;
  const vorEligibleCount = accounts.filter((a) => a.vorEligible).length;
  const weightedArr = accounts.reduce(
    (sum, a) => sum + a.estimatedArr * (STAGE_WEIGHT[a.stage] ?? 0),
    0,
  );

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Enterprise deals · RFPs · procurement workflows"
        title={<>The institution lane.</>}
        subtitle="Vero is on the Ontario Health Vendor of Record list. That's a moat. Here's how I'd convert it into named-account pipeline."
      />

      {/* Top stats row: scoped to the enterprise lane only, not the full pipeline. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{total}</span> active accounts
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{formatArr(weightedArr)}</span> weighted ARR
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">
            {vorEligibleCount}/{total}
          </span>{" "}
          VoR-eligible
        </span>
      </div>

      {/* Two-column body: 60/40 on desktop, stacked on mobile. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* LEFT: account list */}
        <section className="space-y-3 lg:col-span-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[20px] tracking-tight text-foreground">
              Named accounts
            </h2>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              click to expand
            </span>
          </div>
          {accounts.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 bg-card/40 p-6 text-center text-[13px] text-muted-foreground">
              No enterprise accounts loaded yet. Populated from{" "}
              <span className="font-mono">data/enterprise.json</span>.
            </div>
          ) : (
            <div className="space-y-2.5">
              {accounts.map((account) => (
                <EnterpriseCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </section>

        {/* RIGHT: RFP playbook (sticky on desktop) */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-20 space-y-5">
            <div className="rounded-md border border-border/60 bg-card p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                RFP playbook
              </div>
              <h2 className="mt-1 font-display text-[20px] leading-tight tracking-tight text-foreground">
                Six answers, ready to paste.
              </h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                Drafted as if I were responding for Vero. Every Ontario Health
                procurement reviewer asks the same six questions. Pre-answering
                them is the difference between a 5-day turnaround and a 5-week
                one.
              </p>

              <div className="mt-5 space-y-4">
                {RFP_BLOCKS.map((block, i) => (
                  <div key={block.id} className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                        Q{String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-[13px] font-medium text-foreground">
                        {block.question}
                      </h3>
                    </div>
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                      {block.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border/60 bg-card p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Day-1 priorities for enterprise
              </div>
              <ol className="mt-3 space-y-2.5 text-[12.5px] leading-relaxed text-foreground/90">
                {DAY_ONE_PRIORITIES.map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70 pt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
