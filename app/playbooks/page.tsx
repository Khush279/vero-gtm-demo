/**
 * /playbooks — three reusable GTM motions, written as operating manuals.
 *
 * The JD asks for "scalable GTM playbooks". A founder reading this page
 * should think: this person isn't building one-shot campaigns, they're
 * building a system the team can run without them in the room.
 *
 * Server component on purpose. Static content lives in data/playbooks.ts;
 * the only client work is the per-card expand/collapse state inside
 * PlaybookCard.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PlaybookCard } from "@/components/playbook-card";
import { PLAYBOOKS } from "@/data/playbooks";

export const metadata: Metadata = {
  title: "Playbooks",
  description:
    "Three reusable GTM motions written as operating manuals: solo-clinic outbound, enterprise VoR conversion, and SERP-defending content.",
};

export default function PlaybooksPage() {
  const totalSections = PLAYBOOKS.reduce((sum, p) => sum + p.sections.length, 0);
  const totalAssets = PLAYBOOKS.reduce((sum, p) => sum + p.reusableAssets.length, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Build scalable GTM playbooks"
        title={<>Three playbooks. Reusable.</>}
        subtitle="Each one is the operating manual for a repeatable motion. The team should be able to run any of these without me."
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{PLAYBOOKS.length}</span> playbooks
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{totalSections}</span> ordered sections
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{totalAssets}</span> reusable assets
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          click any card to expand
        </span>
      </div>

      <div className="space-y-4">
        {PLAYBOOKS.map((playbook) => (
          <PlaybookCard key={playbook.id} playbook={playbook} />
        ))}
      </div>

      <div className="rounded-md border border-dashed border-border/60 bg-card/40 px-5 py-4 text-[12.5px] leading-relaxed text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Why three
        </span>
        <p className="mt-2 text-foreground/85">
          One inbound-friendly outbound motion at the FP solo-clinic level, one
          enterprise motion that converts the Ontario Health VoR slot into
          named-account pipeline, and one content motion that defends the SERP
          where the next 5,000 clinicians are already searching. Together they
          cover the three customer surfaces Vero needs to grow into.
        </p>
      </div>
    </div>
  );
}
