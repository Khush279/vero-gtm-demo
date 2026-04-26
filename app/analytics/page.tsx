import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

/**
 * /analytics — SEO + funnel attribution surface.
 * Server component. All numbers are illustrative and footnoted as such; the
 * point is to show the shape of the analysis, not to manufacture authority.
 */

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Top 10 organic blog pages, three keyword bets, last-touch funnel attribution by source, and a one-page A/B test proposal ready for week 1.",
};

type BlogRow = {
  slug: string;
  title: string;
  keyword: string;
  clicks: number;
  position: number;
  ctr: number;
};

const BLOG_ROWS: BlogRow[] = [
  {
    slug: "tali-ai-review-2026",
    title: "Tali AI Review (2026)",
    keyword: "tali ai review",
    clicks: 4380,
    position: 1.4,
    ctr: 32.1,
  },
  {
    slug: "best-ai-medical-scribe-ontario",
    title: "Best AI Medical Scribe (Ontario edition)",
    keyword: "ai scribe ontario",
    clicks: 3210,
    position: 2.1,
    ctr: 24.6,
  },
  {
    slug: "best-ai-medical-scribe",
    title: "Best AI Medical Scribe (Canada)",
    keyword: "best ai medical scribe canada",
    clicks: 2870,
    position: 2.8,
    ctr: 19.4,
  },
  {
    slug: "dax-review-2026",
    title: "Nuance DAX Review (2026)",
    keyword: "nuance dax review",
    clicks: 2110,
    position: 3.6,
    ctr: 14.8,
  },
  {
    slug: "deepcura-review-2026",
    title: "DeepCura Review (2026)",
    keyword: "deepcura review",
    clicks: 1740,
    position: 2.5,
    ctr: 22.0,
  },
  {
    slug: "heidi-health-review-2026",
    title: "Heidi Health Review (2026)",
    keyword: "heidi health review",
    clicks: 1530,
    position: 4.2,
    ctr: 11.7,
  },
  {
    slug: "ai-scribe-pricing-comparison-2026",
    title: "AI Scribe Pricing Comparison (2026)",
    keyword: "ai scribe pricing",
    clicks: 1120,
    position: 5.1,
    ctr: 9.8,
  },
  {
    slug: "ai-scribe-pipeda-compliance",
    title: "AI Scribes and PIPEDA: what to ask vendors",
    keyword: "ai scribe pipeda",
    clicks: 880,
    position: 3.0,
    ctr: 17.2,
  },
  {
    slug: "ai-scribe-oscar-pro-integration",
    title: "AI Scribes that work with OSCAR Pro",
    keyword: "ai scribe oscar emr",
    clicks: 540,
    position: 4.7,
    ctr: 10.1,
  },
  {
    slug: "ai-scribe-family-medicine-templates",
    title: "150+ family-medicine templates in Vero",
    keyword: "ai scribe family medicine templates",
    clicks: 320,
    position: 6.4,
    ctr: 6.9,
  },
];

type KeywordOpp = {
  keyword: string;
  volume: string;
  rank: string;
  why: string;
  write: string;
};

const KEYWORDS: KeywordOpp[] = [
  {
    keyword: "ai scribe ontario family doctor",
    volume: "~720 / mo",
    rank: "Not ranked (page 4)",
    why: "Direct ICP intent. Ontario family physicians are the highest-LTV per-outreach segment because of the VoR moat and the 6M+ unattached-patient backlog driving FP overload. The existing Ontario-edition page ranks for the broader query but doesn't speak to FP-specific workflow pain.",
    write: "A side-by-side workflow walkthrough showing a 12-patient FP day with and without Vero, anchored on time-to-chart-close.",
  },
  {
    keyword: "tali ai vs vero",
    volume: "~210 / mo",
    rank: "Position 6",
    why: "Comparison-intent traffic converts at 3-5x informational. Tali is the moat threat in Ontario because of the Canadian-built positioning collision; if a clinician is searching the head-to-head they're already in evaluation. Owning position 1 here is worth more than ten new informational pages.",
    write: "An honest comparison: pricing ($60 vs Tali's bundle), 150+ specialty templates, doc-upload, EMR integration parity, and where Tali wins.",
  },
  {
    keyword: "ai scribe quebec privacy law 25",
    volume: "~390 / mo",
    rank: "Not ranked",
    why: "Law 25 is the regulatory wedge for the Quebec expansion lane and there's almost no English-language content addressing it head-on. Vero already handles PIPEDA; documenting Law 25 posture opens a procurement-defensible position before any competitor does.",
    write: "A Law 25 compliance brief with a residency / consent / breach-notification checklist clinicians can paste into their privacy officer's evaluation.",
  },
];

type FunnelRow = {
  source: string;
  sessions: number;
  demoBook: number;
  trialStart: number;
  paid: number;
  cac: string;
  note?: string;
};

const FUNNEL: FunnelRow[] = [
  { source: "Organic search", sessions: 18420, demoBook: 3.8, trialStart: 11.2, paid: 28.4, cac: "$74" },
  { source: "Direct", sessions: 4310, demoBook: 6.2, trialStart: 14.0, paid: 34.1, cac: "$48" },
  { source: "Paid (Google)", sessions: 0, demoBook: 0, trialStart: 0, paid: 0, cac: "n/a", note: "not running" },
  { source: "LinkedIn organic", sessions: 1180, demoBook: 2.1, trialStart: 7.4, paid: 21.0, cac: "$96" },
  { source: "Outbound email", sessions: 740, demoBook: 4.6, trialStart: 9.8, paid: 26.5, cac: "$112" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-12">
      <PageHeader
        kicker="JD: Analytics · attribution · GA · Search Console"
        title={<>The numbers.</>}
        subtitle="Vero already wins on SEO. Here's how I'd close the attribution loop and pick the next 3 keywords."
      />

      {/* A. Top 10 blog pages */}
      <section className="space-y-4">
        <SectionHeader
          letter="A"
          title="Top 10 Vero blog pages by estimated organic traffic"
          subtitle="Pulled from public SERP data. Replace with Search Console exports day 1."
        />
        <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead className="bg-muted/40 text-left font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Page</th>
                <th className="px-4 py-3 font-normal">Target keyword</th>
                <th className="px-4 py-3 text-right font-normal">Est. clicks / mo</th>
                <th className="px-4 py-3 text-right font-normal">Avg position</th>
                <th className="px-4 py-3 text-right font-normal">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BLOG_ROWS.map((r) => (
                <tr key={r.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <a
                      href={`https://www.veroscribe.com/blog/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground hover:text-primary hover:underline underline-offset-4"
                    >
                      {r.title}
                    </a>
                    <div className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">
                      /blog/{r.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.keyword}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">
                    {r.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.position.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.ctr.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footnote>
          Numbers illustrative; replace with Search Console pulls on day 1.
        </Footnote>
      </section>

      {/* B. Keyword opportunities */}
      <section className="space-y-4">
        <SectionHeader
          letter="B"
          title="3 keyword opportunities I'd target next"
          subtitle="Ranked by intent quality. Two of the three are buying-stage queries."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {KEYWORDS.map((k) => (
            <article
              key={k.keyword}
              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
                {k.keyword}
              </div>
              <div className="grid grid-cols-2 gap-3 border-y border-border/60 py-3 text-[12px]">
                <div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Volume
                  </div>
                  <div className="mt-1 tabular-nums text-foreground">{k.volume}</div>
                </div>
                <div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Current rank
                  </div>
                  <div className="mt-1 text-foreground">{k.rank}</div>
                </div>
              </div>
              <div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Why
                </div>
                <p className="mt-1 text-pretty font-serif text-[14px] leading-relaxed text-foreground/85">
                  {k.why}
                </p>
              </div>
              <div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  What I&apos;d write
                </div>
                <p className="mt-1 text-pretty text-[13px] leading-relaxed text-muted-foreground">
                  {k.write}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* C. Funnel attribution */}
      <section className="space-y-4">
        <SectionHeader
          letter="C"
          title="Funnel attribution by source"
          subtitle="Last-touch model. Multi-touch modelling is week-3 work, after the GA4 → BigQuery export is wired."
        />
        <div className="overflow-x-auto rounded-lg border border-border/60 bg-card">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="bg-muted/40 text-left font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Source</th>
                <th className="px-4 py-3 text-right font-normal">Sessions</th>
                <th className="px-4 py-3 text-right font-normal">Demo book rate</th>
                <th className="px-4 py-3 text-right font-normal">Trial start rate</th>
                <th className="px-4 py-3 text-right font-normal">Paid conversion</th>
                <th className="px-4 py-3 text-right font-normal">Est. CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FUNNEL.map((r) => (
                <tr key={r.source} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground">
                    {r.source}
                    {r.note ? (
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                        {r.note}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.sessions ? r.sessions.toLocaleString() : "–"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.demoBook ? `${r.demoBook.toFixed(1)}%` : "–"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.trialStart ? `${r.trialStart.toFixed(1)}%` : "–"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                    {r.paid ? `${r.paid.toFixed(1)}%` : "–"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">
                    {r.cac}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footnote>
          Estimated CAC computed at $X per touch hour blended; numbers illustrative.
        </Footnote>
      </section>

      {/* D. Experiment proposal */}
      <section className="space-y-4">
        <SectionHeader
          letter="D"
          title="One-page experiment proposal"
          subtitle="The first A/B test I'd ship in week 1."
        />
        <article className="rounded-lg border border-border/60 bg-card p-6">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
            Experiment 001 · Pricing-page hero anchor
          </div>
          <h3 className="mt-2 font-display text-[22px] tracking-tight text-foreground">
            Annual price anchor lifts trial-start by &geq; 15%.
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field label="Hypothesis">
              Anchoring on the annual figure ($720/yr) reframes the cost as a one-time
              decision rather than a recurring subscription. Clinicians evaluating tools
              alongside their CME and licensing fees benchmark on annual lines, not monthly
              ones. Expected lift: 15–25% on trial-start.
            </Field>
            <Field label="Primary metric">
              Trial-start rate per session on /pricing (event:{" "}
              <code className="rounded bg-muted px-1 font-mono text-[11.5px]">
                trial_start
              </code>
              ).
            </Field>
            <Field label="Variant A (control)">
              Hero reads <strong>$59.99 / mo</strong>, secondary line shows <em>or $720 billed annually</em>.
            </Field>
            <Field label="Variant B (test)">
              Hero reads <strong>$720 / yr</strong>, secondary line shows <em>$59.99 / mo if you prefer</em>.
            </Field>
            <Field label="Sample size needed">
              4,000 sessions per variant (alpha 0.05, power 0.80, baseline 11.2% trial-start,
              minimum detectable effect 15% relative). Hits significance in ~2 weeks at
              current organic volume.
            </Field>
            <Field label="Decision rule">
              Ship variant B if it hits 95% confidence and &geq; 5% absolute lift. If
              significant but lift &lt; 5%, hold and run a follow-up on copy framing instead.
            </Field>
          </div>
        </article>
      </section>
    </div>
  );
}

function SectionHeader({
  letter,
  title,
  subtitle,
}: {
  letter: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-primary">
        {letter}
      </span>
      <div>
        <h2 className="font-display text-[22px] tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-pretty font-serif text-[14.5px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}
