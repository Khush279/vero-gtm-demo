import Link from "next/link";

/**
 * Landing page — framed as a cover letter to Adeel and Bill, the two founders
 * of Vero. One viewport, scannable in 30 seconds. Every other surface in this
 * repo is reachable from the grid below.
 */

type Surface = {
  href: string;
  title: string;
  kicker: string;
  blurb: string;
};

const SURFACES: Surface[] = [
  {
    href: "/pipeline",
    title: "Pipeline",
    kicker: "JD: Architect and own the CRM",
    blurb: "Attio-style board. 500 real Ontario family physicians from the CPSO register, scored and stage-bucketed.",
  },
  {
    href: "/lead/lead_0001",
    title: "Lead profile",
    kicker: "JD: Lifecycle flows · nurture sequences",
    blurb: "Enriched profile with inferred EMR. A 4-touch sequence drafted live by gpt-4o-mini, leverage point per email.",
  },
  {
    href: "/automations",
    title: "Automations",
    kicker: "JD: Scripts, integrations, APIs",
    blurb: "The page that separates GTM engineers from RevOps. Five running jobs, each with its actual TypeScript source.",
  },
  {
    href: "/enterprise",
    title: "Enterprise",
    kicker: "JD: Enterprise deals · RFPs · procurement",
    blurb: "Hospital-system pipeline, named champions, and a pre-filled Ontario Health VoR response template.",
  },
  {
    href: "/analytics",
    title: "Analytics",
    kicker: "JD: GA · Search Console · attribution",
    blurb: "Top-10 organic pages, three keyword bets, funnel attribution by source, and one A/B test I'd ship in week 1.",
  },
  {
    href: "/strategy",
    title: "Strategy",
    kicker: "JD: Foundational impact · build GTM from scratch",
    blurb: "The 90-day plan. Where Vero is, where the wedge is, and what I'd do week by week.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 pt-2">
      {/* Hero */}
      <section className="space-y-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Founding GTM Engineer · Interview demo
        </div>
        <h1 className="font-display text-[44px] font-light leading-[1.02] tracking-tightest text-foreground md:text-[64px]">
          Hello, <span className="font-display-italic text-primary">Adeel and Bill.</span>
        </h1>
        <div className="max-w-2xl space-y-4 font-serif text-[17px] leading-relaxed text-foreground/85 md:text-[18px]">
          <p>
            I&apos;m Khush. I built this in 48 hours instead of writing a cover letter.
          </p>
          <p>
            Adeel, every email here is calibrated to a real Ontario family physician because
            what Vero sells is hours back to clinicians like you.
          </p>
          <p>
            Bill, the source is on GitHub, the auto-deploy is on Vercel, and the{" "}
            <Link href="/automations" className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">
              /automations
            </Link>{" "}
            page exists because GTM engineers without code skills are just RevOps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <PlayIcon /> Watch the 6-min walkthrough
          </a>
          <Link
            href="/strategy"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-[13.5px] text-foreground transition-colors hover:bg-muted"
          >
            Read the strategy memo
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Surface grid */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[22px] tracking-tight text-foreground">
            The seven surfaces.
          </h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            One per JD bullet
          </span>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-muted/40"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.kicker}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="font-display text-[24px] tracking-tight text-foreground">
                  {s.title}
                </div>
                <ArrowIcon className="mt-1 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <p className="text-pretty text-[13.5px] leading-relaxed text-muted-foreground">
                {s.blurb}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About this build */}
      <section className="rounded-lg border border-border bg-muted/30 p-5">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          About this build
        </div>
        <p className="mt-2 font-mono text-[11.5px] leading-[1.7] text-foreground/80">
          48-hour scope · Next.js + Tailwind · OpenAI gpt-4o-mini for drafts · 500 leads from
          CPSO public register · Source not coupled to any prod system
        </p>
      </section>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor" aria-hidden>
      <path d="M4 3v10l9-5z" />
    </svg>
  );
}
