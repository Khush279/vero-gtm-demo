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
import { LeadMobileCta } from "@/components/lead-mobile-cta";
import { ObjectionHandler } from "@/components/objection-handler";
import { findLead } from "@/data/leads";

type Params = { id: string };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const lead = findLead(params.id);
  if (!lead) return { title: "Lead not found" };
  return {
    title: `${lead.name} · ${lead.specialty}`,
    description: `Enriched outbound workspace for ${lead.name} (${lead.specialty}, ${lead.city}) with an AI-drafted 4-touch sequence and inferred EMR.`,
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
    <div className="space-y-10 pb-24 md:pb-0">
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

      <section className="mt-12 border-t border-border/60 pt-8">
        <div className="mb-5 max-w-2xl space-y-2">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Objection handling
          </div>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            If they reply, here is what they will likely push back on. Five
            most-common objections for this segment, each with a scripted
            response and a follow-up ask.
          </p>
        </div>
        <ObjectionHandler compactMode />
      </section>

      <LeadMobileCta leadId={lead.id} />
    </div>
  );
}
