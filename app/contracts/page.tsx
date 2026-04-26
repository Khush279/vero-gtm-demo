/**
 * /contracts. Three downloadable contract templates a Canadian clinic
 * procurement team would expect on day one: MSA, DPIA, mutual NDA. All three
 * are markdown files served statically from /public/contracts/files. Server
 * component on purpose: the only interaction is the download anchor, which
 * the browser handles natively.
 *
 * Top of page carries a forest-tinted legal-notice banner. Each card also
 * carries its own italic per-document notice immediately above the download
 * button. Two surfaces because procurement reviewers skim, and the disclaimer
 * needs to land at both the page level and the artefact level.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContractCard } from "@/components/contract-card";
import { CONTRACTS } from "@/data/contracts";

export const metadata: Metadata = {
  title: "Contracts",
  description:
    "Three downloadable contract templates: Master Services Agreement, Data Protection Impact Assessment, and mutual NDA. Templates only, not legal advice.",
};

export default function ContractsPage() {
  const totalBytes = CONTRACTS.reduce((sum, c) => sum + c.bytesEstimate, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Procurement-ready paper"
        title={<>The contracts.</>}
        subtitle="Three templates a Canadian clinic procurement team would expect on day one. Templates only · not legal advice. Have your counsel review before signing."
      />

      <div className="rounded-md border border-forest-300/60 bg-forest-50 px-5 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-forest-700">
          Legal notice
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/90">
          Templates only · not legal advice · review with counsel before signing
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          These documents are starting points calibrated to Vero&apos;s positioning
          (Canadian residency, PIPEDA-aligned, immutable audit log). They are
          not a substitute for advice from qualified Canadian counsel familiar
          with your jurisdiction and matter.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{CONTRACTS.length}</span> templates
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{formatTotal(totalBytes)}</span> total
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          static files · /public/contracts/files
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CONTRACTS.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>

      <div className="rounded-md border border-dashed border-border/60 bg-card/40 px-5 py-4 text-[12.5px] leading-relaxed text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Why these three
        </span>
        <p className="mt-2 text-foreground/85">
          Day-1 paper for a procurement reviewer. The MSA frames the
          commercial relationship, the DPIA satisfies the privacy office on
          PIPEDA and provincial health-information law, and the NDA covers the
          discovery period before the MSA is signed. Every clinic group and
          hospital procurement team in Canada asks for some version of these
          three before the contract conversation starts.
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
