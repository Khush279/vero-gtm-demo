import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Sparkline } from "@/components/sparkline";
import {
  CHANNELS,
  RECOMMENDATION_LABEL,
  type ChannelData,
  type Recommendation,
} from "@/data/channel-mix";

export const metadata: Metadata = {
  title: "Channel mix",
  description:
    "Bottoms-up channel ROI for Vero outbound + content + partner motion. Six channels, illustrative numbers, double-down picks called out.",
};

const REC_TONE: Record<Recommendation, string> = {
  "double-down": "border-forest-200 bg-forest-50 text-forest-700",
  watch: "border-ochre-200 bg-ochre-50 text-ochre-700",
  cut: "border-border/70 bg-muted/40 text-muted-foreground",
};

const fmt = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function ChannelCard({ ch }: { ch: ChannelData }) {
  return (
    <article className="space-y-4 rounded-lg border border-border/60 bg-card p-5 transition-colors hover:border-primary/30">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-display text-[20px] font-light tracking-tight text-foreground">
            {ch.label}
          </h3>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${REC_TONE[ch.recommendation]}`}
          >
            {RECOMMENDATION_LABEL[ch.recommendation]}
          </span>
        </div>
        <Sparkline values={ch.trend30d} width={88} height={24} ariaLabel={`${ch.label} 30d trend`} />
      </header>

      <div className="grid grid-cols-2 gap-4 border-y border-border/50 py-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">CAC</div>
          <div className="mt-1 font-display text-[26px] font-light leading-none tabular-nums text-foreground">
            {ch.cac > 0 ? fmt.format(ch.cac) : "—"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Cost / mo</div>
          <div className="mt-1 font-display text-[26px] font-light leading-none tabular-nums text-foreground">
            {fmt.format(ch.costPerMonth)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Pipeline gen</div>
          <div className="mt-1 font-mono text-[14px] tabular-nums text-foreground/85">{fmt.format(ch.pipelineGenerated)}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Closed-won</div>
          <div className="mt-1 font-mono text-[14px] tabular-nums text-foreground/85">{fmt.format(ch.closedWonAttributed)}</div>
        </div>
      </div>

      <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">{ch.notes}</p>
    </article>
  );
}

export default function ChannelMixPage() {
  const totalPipeline = CHANNELS.reduce((s, c) => s + c.pipelineGenerated, 0);
  const totalClosed = CHANNELS.reduce((s, c) => s + c.closedWonAttributed, 0);
  const totalCost = CHANNELS.reduce((s, c) => s + c.costPerMonth, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        kicker="JD: Reporting · attribution · channel ROI"
        title={<>Where the pipeline comes from.</>}
        subtitle="Six channels, illustrative numbers. Forest-tinted recommendations are the channels Vero should keep doubling down on. Ochre flags channels to question."
      />

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 lg:grid-cols-4">
        <Stat label="Channels active" value={`${CHANNELS.filter((c) => c.costPerMonth > 0 || c.pipelineGenerated > 0).length}`} />
        <Stat label="Monthly cost" value={fmt.format(totalCost)} />
        <Stat label="Pipeline (90d)" value={fmt.format(totalPipeline)} />
        <Stat label="Closed-won (90d)" value={fmt.format(totalClosed)} />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {CHANNELS.map((ch) => (
          <ChannelCard key={ch.id} ch={ch} />
        ))}
      </section>

      <section className="rounded-lg border border-border/60 bg-card p-6">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          What moves next quarter
        </div>
        <p className="mt-3 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          Outbound email and SEO content carry the motion. Partner motion (OntarioMD,
          OCFP webinar) is the highest-ARPU channel even at small volume — worth
          doubling the time invested. LinkedIn is a watch: replies look promising but
          attribution to closed-won is thin without a structured cadence. Paid search
          stays at zero until the unit economics on outbound + content stop scaling.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-card p-3.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-display text-[22px] font-light leading-none tabular-nums text-foreground">{value}</div>
    </div>
  );
}
