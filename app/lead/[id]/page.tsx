/**
 * Lead detail surface — answers the JD bullet "lifecycle flows: lead routing,
 * follow-ups, nurture sequences." Two columns: enriched profile on the left,
 * AI-drafted 4-touch sequence on the right.
 *
 * Server component. Resolves the lead at request time so a deep-link to a
 * stale id renders a calm fallback instead of throwing.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { LeadProfile } from "@/components/lead-profile";
import { SequencePane } from "@/components/sequence-pane";
import { findLead } from "@/data/leads";

type Params = { id: string };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const lead = findLead(params.id);
  if (!lead) return { title: "Lead not found · Vero GTM" };
  return {
    title: `${lead.name} · ${lead.specialty} · Vero GTM`,
    description: `Outbound workspace for ${lead.name} (${lead.city}).`,
  };
}

function NotFound({ id }: { id: string }) {
  return (
    <div className="space-y-8">
      <PageHeader
        kicker="JD: Lifecycle flows · lead routing · nurture sequences"
        title={<>Lead not found</>}
        subtitle={
          <>
            No lead in the demo dataset matches{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
              {id}
            </code>
            . The pipeline page lists every CPSO entry currently loaded.
          </>
        }
      />
      <div>
        <Link
          href="/pipeline"
          className="inline-flex items-center gap-2 rounded-md bg-forest-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-forest-50 transition-colors hover:bg-forest-800"
        >
          ← Back to pipeline
        </Link>
      </div>
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Params }) {
  const lead = findLead(params.id);
  if (!lead) return <NotFound id={params.id} />;

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Lifecycle flows · lead routing · nurture sequences"
        title={<>{lead.name}</>}
        subtitle={`${lead.specialty} · ${lead.city} · ICP ${lead.score}/100`}
        rightSlot={
          <Link
            href="/pipeline"
            className="rounded-md border border-border/70 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            ← Pipeline
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <LeadProfile lead={lead} />
        <SequencePane leadId={lead.id} />
      </div>
    </div>
  );
}
