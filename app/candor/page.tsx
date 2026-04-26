import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CANDOR } from "@/data/candor";

export const metadata: Metadata = {
  title: "Candor",
  description:
    "The page after the interview. Things I think but didn't put in the demo. Found, not pushed.",
  robots: { index: false, follow: false },
};

export default function CandorPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <PageHeader
        kicker="The page I wouldn't show you first"
        title={<>Candor.</>}
        subtitle="Things I think but didn't put in the demo. If you found this page, you went looking. Here's what I'd say if we were already on the team together."
      />

      <section className="space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Why this exists
        </div>
        <p className="text-pretty font-display-italic text-[18px] leading-relaxed text-foreground/85">
          {CANDOR.whyThisExists}
        </p>
      </section>

      <section className="space-y-4 rounded-lg border-l-2 border-forest-500 bg-forest-50/40 px-6 py-5">
        <h2 className="font-display text-[24px] font-light tracking-tight text-foreground">
          What I&apos;d push back on in your strategy
        </h2>
        <ul className="space-y-3 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          {CANDOR.pushBackOnStrategy.map((b) => (
            <li key={b.id} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600" />
              <span>{b.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[24px] font-light tracking-tight text-foreground">
          What I think is broken in healthtech generally
        </h2>
        <div className="space-y-4 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          {CANDOR.whatsBrokenInHealthtech.map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border-l-2 border-ochre-500 bg-ochre-50/40 px-6 py-5">
        <h2 className="font-display text-[24px] font-light tracking-tight text-foreground">
          What I&apos;d want from you
        </h2>
        <ul className="space-y-3 font-serif text-[15.5px] leading-relaxed text-foreground/90">
          {CANDOR.whatIWantFromYou.map((b) => (
            <li key={b.id} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ochre-600" />
              <span>{b.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-6 text-center">
        <p className="font-display-italic text-[20px] text-foreground/80">{CANDOR.signoff}</p>
      </section>
    </div>
  );
}
