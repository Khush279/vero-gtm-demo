import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CaseStudyTimeline } from "@/components/case-study-timeline";
import { CASE_STUDY } from "@/data/case-study";

/**
 * /case-study: one named Ontario family physician, end-to-end.
 *
 * Founders read demos in two modes: "show me the system" and "show me one
 * example all the way through." This page is the second mode. Every other
 * surface in this repo abstracts; this one walks one human from cold to
 * closed in 28 days, with timestamps and artifacts at every step.
 *
 * Server-rendered. Only the timeline's collapse/expand is client-side.
 */

export const metadata: Metadata = {
  title: "From cold to closed in 28 days",
  description:
    "One named Ontario family physician, every artifact along the way. Research note, two cold emails, one reply, one demo, two weeks of trial telemetry, and a $720 ARR close.",
};

const STAT_DIVIDER = (
  <span aria-hidden className="text-muted-foreground/50">
    ·
  </span>
);

export default function CaseStudyPage() {
  const cs = CASE_STUDY;
  const protagonistFirstName = cs.protagonist.name
    .replace(/^Dr\.?\s+/, "")
    .split(" ")[0];

  const arrLabel = `$${cs.arr.toLocaleString("en-CA")}`;
  const stats: { label: string; value: string }[] = [
    { label: "Cycle", value: `${cs.cycleDays}d` },
    { label: "ARR", value: arrLabel },
    { label: "Demos", value: "1" },
    { label: "Replies", value: "1" },
    { label: "Outcome", value: "close-won" },
  ];

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="JD: End-to-end ownership · close"
        title={<>From cold to closed in 28 days.</>}
        subtitle="One named Ontario family physician, every artifact along the way. The system you've seen across the other surfaces, in motion against one human."
      />

      {/* Top stats strip */}
      <section
        aria-label="Case-study summary"
        className="rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
          {stats.map((s, i) => (
            <span key={s.label} className="inline-flex items-center gap-2">
              <span className="text-muted-foreground/60">{s.label}</span>
              <span className="text-foreground">{s.value}</span>
              {i < stats.length - 1 ? STAT_DIVIDER : null}
            </span>
          ))}
        </div>
      </section>

      {/* Protagonist card */}
      <section
        aria-label="Protagonist"
        className="grid grid-cols-1 gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:grid-cols-[2fr_3fr] md:p-7"
      >
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Protagonist
          </div>
          <h2 className="font-display text-[26px] leading-tight tracking-tight text-foreground">
            {cs.protagonist.name}
          </h2>
          <p className="text-[14px] text-muted-foreground">
            {cs.protagonist.specialty} · {cs.protagonist.city} ·{" "}
            <span className="text-foreground">{cs.protagonist.emr}</span>
          </p>
          <p className="pt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <Link
              href={`/lead/${cs.leadId}`}
              className="text-forest-700 underline underline-offset-4 decoration-forest-300 hover:decoration-forest-700"
            >
              Open lead · {cs.leadId}
            </Link>
          </p>
        </div>
        <div className="space-y-2 border-t border-border/60 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            How to read this page
          </div>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            Outbound artifacts (research, emails, telemetry, close notes) sit on
            the left and use forest accents. Replies from Dr. {protagonistFirstName.split(" ")[0]} sit on the right with ochre. The line in the middle is the
            sequence of touches as it actually happened. Every timestamp is real
            relative to a Day 1 of {formatRefDate(cs.artifacts[1].occurredAt)}.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section aria-label="Timeline" className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] tracking-tight text-foreground">
            Twenty-eight days, twelve artifacts.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Chronological
          </span>
        </div>
        <CaseStudyTimeline
          artifacts={cs.artifacts}
          protagonistFirstName={protagonistFirstName}
        />
      </section>

      {/* Footer / what this proves */}
      <section className="rounded-2xl border border-border/70 bg-muted/30 p-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          What this case proves
        </div>
        <ul className="mt-3 space-y-2 font-serif text-[15px] leading-relaxed text-foreground/85">
          <li>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest-700">
              Wedge holds.
            </span>{" "}
            The doc-upload-into-PSS angle was the opener, the demo, and the
            reason she didn&apos;t churn in week 1.
          </li>
          <li>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest-700">
              Two touches, one reply.
            </span>{" "}
            No drip-fatigue, no nine-step sequence. Touch 2 added one number
            from a peer, that was the difference.
          </li>
          <li>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest-700">
              Trial telemetry decides.
            </span>{" "}
            Week-1 charting time delta of -42% is the real close. Everything
            after is paperwork.
          </li>
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
          <Link
            href="/pipeline"
            className="rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted"
          >
            See her cohort in pipeline
          </Link>
          <Link
            href={`/lead/${cs.leadId}`}
            className="rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted"
          >
            Open the live lead profile
          </Link>
          <Link
            href="/strategy"
            className="rounded-md border border-border bg-card px-3 py-1.5 transition-colors hover:bg-muted"
          >
            Read the 90-day plan
          </Link>
        </div>
      </section>
    </div>
  );
}

function formatRefDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Toronto",
  });
}
