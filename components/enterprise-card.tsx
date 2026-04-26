"use client";

/**
 * Enterprise account row used on /enterprise. One card per hospital system or
 * large clinic group. Click anywhere on the header strip to expand inline and
 * read the rep's notes — the same gesture an Attio inspector pane uses.
 *
 * The card deliberately fits a single line of summary on desktop (org name,
 * provider count, EMR, champion, stage chip, next milestone, weighted ARR) so
 * the left column scans like a procurement worksheet, not a marketing list.
 */

import { useState } from "react";
import { cn, smartDate } from "@/lib/utils";
import { EMR_LABELS, type EnterpriseAccount } from "@/lib/types";

/**
 * Format CAD ARR into the compact $1.2M / $850k style used in the JD-bullet
 * stats. Always tabular for column alignment.
 */
function formatArr(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    // 1.0M reads weak; collapse to 1M when the trailing digit is 0.
    const s = m.toFixed(1);
    return `$${s.endsWith(".0") ? s.slice(0, -2) : s}M`;
  }
  if (amount >= 1_000) {
    const k = Math.round(amount / 1_000);
    return `$${k}k`;
  }
  return `$${amount}`;
}

const STAGE_LABEL: Record<EnterpriseAccount["stage"], string> = {
  discovery: "Discovery",
  qualified: "Qualified",
  rfp_issued: "RFP issued",
  rfp_response: "RFP response",
  shortlisted: "Shortlisted",
  negotiation: "Negotiation",
  closed_won: "Closed-won",
  closed_lost: "Closed-lost",
};

/**
 * Stage chip palette mirrors the procurement funnel: muted at the top,
 * ochre once qualified, deepening forest as the deal advances, primary on
 * close, faint destructive on loss.
 */
const STAGE_CHIP: Record<EnterpriseAccount["stage"], string> = {
  discovery: "bg-muted text-muted-foreground",
  qualified: "bg-ochre-100 text-ochre-700",
  rfp_issued: "bg-forest-200 text-forest-800",
  rfp_response: "bg-forest-400/70 text-forest-900",
  shortlisted: "bg-forest-600 text-forest-50",
  negotiation: "bg-forest-700 text-forest-50",
  closed_won: "bg-primary text-primary-foreground",
  closed_lost: "bg-destructive/40 text-destructive-foreground",
};

export type EnterpriseCardProps = {
  account: EnterpriseAccount;
};

export function EnterpriseCard({ account }: EnterpriseCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md border border-border/60 bg-card transition-all",
        "hover:border-primary/30",
        open && "border-primary/30 shadow-[0_1px_0_hsl(var(--border))]",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="block w-full px-4 py-3 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-display text-[18px] leading-tight text-foreground">
                {account.org}
              </h3>
              {account.vorEligible ? (
                <span
                  className="shrink-0 rounded-sm bg-ochre-100 px-1.5 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-ochre-700"
                  title="Ontario Health Vendor of Record eligible"
                >
                  VoR
                </span>
              ) : null}
            </div>
            <div className="mt-1 truncate text-[12px] text-muted-foreground">
              <span className="font-mono tabular-nums">{account.providers}</span>{" "}
              providers
              <span className="text-muted-foreground/50"> · </span>
              {EMR_LABELS[account.emr]}
              <span className="text-muted-foreground/50"> · </span>
              {account.champion}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={cn(
                "rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                STAGE_CHIP[account.stage],
              )}
            >
              {STAGE_LABEL[account.stage]}
            </span>
            <span className="font-mono text-[13px] tabular-nums text-foreground">
              {formatArr(account.estimatedArr)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
          <span className="truncate">
            <span className="font-mono uppercase tracking-[0.14em] text-muted-foreground/70">
              next
            </span>
            <span className="ml-1.5">{account.nextMilestone}</span>
          </span>
          <span className="shrink-0 font-mono tabular-nums text-muted-foreground/80">
            {smartDate(account.nextMilestoneDue)}
          </span>
        </div>
      </button>

      {open ? (
        <div className="border-t border-border/60 px-4 py-3 text-[13px] leading-relaxed text-muted-foreground animate-fade-in">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Account notes
          </div>
          <p className="mt-1.5 text-pretty text-foreground/90">{account.notes}</p>
        </div>
      ) : null}
    </div>
  );
}

export default EnterpriseCard;
