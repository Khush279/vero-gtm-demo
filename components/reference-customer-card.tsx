"use client";

/**
 * Reference customer card on /enterprise. Mirrors the EnterpriseCard rhythm
 * (collapsed header strip, click to expand) but the expanded body is built for
 * a procurement reviewer: a pull quote in display italic, then a three-section
 * grid of "Talks about", "Won't talk about", and "Numbers they'll share".
 *
 * The "request reference call" CTA at the bottom is a no-op in the demo but
 * styled the way an enterprise sales playbook would present it: a forest
 * outline button, never a hard CTA, because reference calls are a privilege
 * the customer grants, not a button you press.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ReferenceCustomer } from "@/data/reference-customers";

const SEGMENT_LABEL: Record<ReferenceCustomer["segment"], string> = {
  virtual_care: "Virtual care",
  primary_care_network: "Primary care network",
  hospital_system: "Hospital system",
  specialty: "Specialty network",
};

const SEGMENT_CHIP: Record<ReferenceCustomer["segment"], string> = {
  virtual_care: "bg-forest-100 text-forest-800",
  primary_care_network: "bg-ochre-100 text-ochre-700",
  hospital_system: "bg-forest-200 text-forest-900",
  specialty: "bg-ochre-50 text-ochre-700",
};

export type ReferenceCustomerCardProps = {
  customer: ReferenceCustomer;
};

export function ReferenceCustomerCard({ customer }: ReferenceCustomerCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-border/60 bg-card transition-all",
        "hover:border-primary/30",
        open && "border-primary/30 shadow-[0_1px_0_hsl(var(--border))]",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="block w-full px-4 py-3.5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-[22px] leading-tight text-foreground">
              {customer.org}
            </h3>
            <div className="mt-1 truncate text-[12.5px] text-foreground/85">
              {customer.championName}
              <span className="text-muted-foreground/60">, </span>
              <span className="text-muted-foreground">{customer.championTitle}</span>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
              SEGMENT_CHIP[customer.segment],
            )}
          >
            {SEGMENT_LABEL[customer.segment]}
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
          <span className="truncate font-mono uppercase tracking-[0.14em] text-muted-foreground/80">
            {customer.vintage}
          </span>
          <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {open ? "hide" : "expand"}
          </span>
        </div>
      </button>

      {open ? (
        <div className="border-t border-border/60 animate-fade-in">
          <div className="px-4 pt-4 pb-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              Pull quote
            </div>
            <blockquote className="mt-2 font-display-italic text-[16px] leading-snug text-foreground/90">
              &ldquo;{customer.pullQuote}&rdquo;
            </blockquote>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-border/60 px-4 py-4 md:grid-cols-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest-700">
                Talks about
              </div>
              <ul className="mt-2 space-y-1.5">
                {customer.whatTheyTalkAbout.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[12.5px] leading-relaxed text-forest-900"
                  >
                    <span className="shrink-0 text-forest-500">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                Won&rsquo;t talk about
              </div>
              <ul className="mt-2 space-y-1.5">
                {customer.whatTheyWontTalkAbout.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[12.5px] leading-relaxed text-muted-foreground"
                  >
                    <span className="shrink-0 text-muted-foreground/60">&minus;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ochre-700">
                Numbers they&rsquo;ll share
              </div>
              <dl className="mt-2 space-y-1.5">
                {customer.metrics.map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between gap-2">
                    <dt className="text-[11.5px] leading-tight text-muted-foreground">
                      {m.label}
                    </dt>
                    <dd className="shrink-0 font-mono text-[12.5px] tabular-nums text-foreground">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="border-t border-border/60 px-4 py-3">
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "rounded-sm border border-forest-600/60 bg-transparent px-3 py-1.5",
                "font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-700",
                "transition-colors hover:bg-forest-50 hover:border-forest-700",
              )}
            >
              Request reference call
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ReferenceCustomerCard;
