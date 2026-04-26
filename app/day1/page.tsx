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
import { DAY_ONE_BLOCKS } from "@/data/day1";

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
    </div>
  );
}
