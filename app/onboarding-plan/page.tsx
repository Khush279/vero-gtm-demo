/**
 * /onboarding-plan — week-1 ramp for hire #2 (a BDR).
 *
 * Server component. The data lives in data/onboarding-plan.ts and the
 * expand-collapse day cards live in components/onboarding-day-card.tsx.
 *
 * Why the surface exists: a founder reading /strategy sees hire #2 named at
 * day 90. The gap between "we will hire someone" and "we have thought about
 * how that hire ramps" is whether the candidate has written the first 5
 * days. This page closes that gap. Specific, not aspirational, 2-minute
 * read.
 */

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { OnboardingDayCard } from "@/components/onboarding-day-card";
import { ONBOARDING_PLAN } from "@/data/onboarding-plan";

export const metadata: Metadata = {
  title: "Onboarding plan",
  description:
    "Week-1 ramp for hire #2 (a BDR). Day-by-day, Monday to Friday. The first hire is scoped before they exist: profile, success criteria, failure mode, and what they ship by Friday EOD.",
};

export default function OnboardingPlanPage() {
  const { profile, days } = ONBOARDING_PLAN;

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="Hire #2 · Week 1 ramp"
        title={<>The new BDR&apos;s first 5 days.</>}
        subtitle="What hire #2 (a BDR) does Mon to Fri of week one. Specific, not aspirational. Read in 2 minutes."
      />

      <ProfileCard profile={profile} />

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[20px] tracking-tight text-foreground">
            Monday to Friday.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            click any day to expand
          </span>
        </div>
        <ol className="space-y-3">
          {days.map((day) => (
            <li key={day.day}>
              <OnboardingDayCard day={day} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ProfileCard({ profile }: { profile: typeof ONBOARDING_PLAN.profile }) {
  return (
    <section className="rounded-lg border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="space-y-1">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Hire #2 profile
          </span>
          <h2 className="font-display text-[22px] leading-tight tracking-tight text-foreground">
            BDR, not content lead.
          </h2>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary-foreground">
          {profile.role}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-foreground/90">
        {profile.whyThisHire}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Success criteria · 30 / 60 / 90
          </div>
          <ul className="space-y-1.5">
            {profile.successCriteria.map((criterion, i) => (
              <li
                key={i}
                className="flex gap-3 font-mono text-[12px] leading-relaxed text-foreground/90"
              >
                <span className="shrink-0 tabular-nums text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Failure mode
          </div>
          <p className="text-[13.5px] italic leading-relaxed text-muted-foreground">
            {profile.failureMode}
          </p>
        </div>
      </div>
    </section>
  );
}
