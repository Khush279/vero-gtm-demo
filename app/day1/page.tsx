/**
 * /day1 — the hour-by-hour plan for my first day at Vero.
 *
 * Server component. The data lives in data/day1.ts and the entire
 * interactive surface (filters, expand-on-click, "On the clock" simulator)
 * lives in components/day1-timeline.tsx. This page is just the header
 * wrapper plus the client island.
 *
 * Why the surface exists: a founder reading /strategy sees 90 days. The
 * gap between "great memo" and "great hire" is whether the candidate has
 * thought through Tuesday morning at 9:02. This page is that proof.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Day1Timeline } from "@/components/day1-timeline";
import { SlackThreadMock } from "@/components/slack-thread-mock";
import { DAY_ONE_BLOCKS } from "@/data/day1";
import { DAY1_SLACK_THREAD } from "@/data/day1-slack-thread";

export const metadata: Metadata = {
  title: "Day 1",
  description:
    "Hour-by-hour plan for my first day at Vero. Click any block to expand or hit start the day to watch the engine come online in real time.",
};

export default function Day1Page() {
  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Day 1 deep ownership · build the engine"
        title={<>What I do on day one.</>}
        subtitle="Hour by hour. Click any block to expand. Hit start the day to watch the engine come online in real time."
      />
      <Day1Timeline blocks={DAY_ONE_BLOCKS} />

      {/* The artifact day 1 actually produces: the EOD brief in #gtm-pipeline. */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[20px] tracking-tight text-foreground">
            What the day-end brief looks like.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            5:47 PM · #gtm-pipeline
          </span>
        </div>
        <p className="max-w-xl text-[13px] text-muted-foreground">
          The artifact every day produces: a short Slack post that closes the
          loop on what shipped, what is queued, and the one open question I
          want a founder take on overnight.
        </p>
        <SlackThreadMock thread={DAY1_SLACK_THREAD} />
      </section>
    </div>
  );
}
