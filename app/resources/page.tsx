/**
 * /resources. Five downloadable artefacts a founder could hand the second
 * hire on day one. CSVs, markdown, JSON, all served as static files from
 * /public. Server component on purpose: the only interaction is the
 * download anchor, which the browser handles natively.
 *
 * Grouped by category so the visual scan reads as: playbooks first (the
 * operating manuals), then templates (RFP), then spreadsheets (the actual
 * data structures), then specs (what to build next).
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { RESOURCES, type Resource } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Downloadable templates: ICP scoring rubric, 4-touch sequence playbook, RFP response template, week-1 dashboard spec, lead enrichment field map.",
};

const CATEGORY_ORDER: Resource["category"][] = [
  "playbook",
  "template",
  "spreadsheet",
  "spec",
];

const CATEGORY_LABEL: Record<Resource["category"], string> = {
  playbook: "Playbooks",
  template: "Templates",
  spreadsheet: "Spreadsheets",
  spec: "Specs",
};

const CATEGORY_BLURB: Record<Resource["category"], string> = {
  playbook: "Operating manuals you can run without me in the room.",
  template: "Pre-filled documents the institution side reads as ready-to-sign.",
  spreadsheet: "The actual data structures behind the pipeline and importer.",
  spec: "What to build next, scoped tightly enough to start Monday.",
};

export default function ResourcesPage() {
  const totalBytes = RESOURCES.reduce((sum, r) => sum + r.bytesEstimate, 0);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: RESOURCES.filter((r) => r.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Operating documents"
        title={<>The artifacts.</>}
        subtitle="The spreadsheets, templates, and specs you'd actually need to run this on day 1. Download what you want, modify it, ship it."
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{RESOURCES.length}</span> files
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{grouped.length}</span> categories
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{formatTotal(totalBytes)}</span> total
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          static files · /public/resources/files
        </span>
      </div>

      <div className="space-y-12">
        {grouped.map(({ category, items }) => (
          <section key={category} className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <div className="space-y-1">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                  {CATEGORY_LABEL[category]}
                </div>
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                  {CATEGORY_BLURB[category]}
                </p>
              </div>
              <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
                {items.length} {items.length === 1 ? "file" : "files"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {items.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-md border border-dashed border-border/60 bg-card/40 px-5 py-4 text-[12.5px] leading-relaxed text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Why these five
        </span>
        <p className="mt-2 text-foreground/85">
          Day-1 operating documents, not marketing collateral. Each file is the
          actual artefact the team would reach for in week one: the rubric that
          scores a CPSO row, the cadence that sends 1,000 emails without burning
          the brand, the answers procurement asks before they sign, the schema
          the dashboard will be built against, and the field map that turns a
          public-register import into a clean lead in Attio.
        </p>
      </div>
    </div>
  );
}

function formatTotal(bytes: number): string {
  const kb = bytes / 1024;
  if (kb < 100) return `${kb.toFixed(1)} KB`;
  return `${Math.round(kb)} KB`;
}
