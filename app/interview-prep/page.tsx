/**
 * /interview-prep: meta-page that anticipates the 15 questions Adeel and Bill
 * are most likely to ask, each with a structured answer (framework, key points,
 * demo evidence, likely follow-up, mistake to avoid).
 *
 * The signal this page sends: the candidate has already mapped the
 * conversation. The list filters by category (fit / strategy / execution /
 * concerns / compensation) and asker (Adeel / Bill / either) so it doubles as a
 * pre-interview rehearsal tool.
 *
 * Server component. The only client state lives inside InterviewPrepBoard for
 * the filters and the per-card collapse.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { QUESTIONS } from "@/data/interview-prep";
import { InterviewPrepBoard } from "./interview-prep-board";

export const metadata: Metadata = {
  title: "Interview prep",
  description:
    "The 15 questions Adeel and Bill are most likely to ask, each structured as: framework, key points, demo evidence, likely follow-up, mistake to avoid.",
};

export default function InterviewPrepPage() {
  const counts = {
    total: QUESTIONS.length,
    fit: QUESTIONS.filter((q) => q.category === "fit").length,
    strategy: QUESTIONS.filter((q) => q.category === "strategy").length,
    execution: QUESTIONS.filter((q) => q.category === "execution").length,
    concerns: QUESTIONS.filter((q) => q.category === "concerns").length,
    compensation: QUESTIONS.filter((q) => q.category === "compensation").length,
  };

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Meta · interview prep"
        title={<>If they ask, here&rsquo;s what I&rsquo;d say.</>}
        subtitle="The 15 questions Adeel and Bill are most likely to ask. Each one structured as: framework, key points, demo evidence, likely follow-up, mistake to avoid."
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md border border-border/60 bg-card px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          <span className="tabular-nums text-foreground">{counts.total}</span>{" "}
          questions
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{counts.fit}</span> fit
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{counts.strategy}</span>{" "}
          strategy
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{counts.execution}</span>{" "}
          execution
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">{counts.concerns}</span>{" "}
          concerns
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>
          <span className="tabular-nums text-foreground">
            {counts.compensation}
          </span>{" "}
          comp
        </span>
        <span className="ml-auto text-[10.5px] tracking-[0.18em] text-muted-foreground/70">
          click any card to expand
        </span>
      </div>

      <InterviewPrepBoard questions={QUESTIONS} />
    </div>
  );
}
