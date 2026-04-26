"use client";

/**
 * Right-pane "draft a 4-touch sequence" workspace. Client component.
 *
 * - Tone selector pills (Direct / Conversational / Skeptical-buyer-friendly)
 * - "Generate sequence" → POST /api/draft → renders 4 collapsible touches
 * - Day 1 has a "Mark replied" stub that strikes through Days 4/9/16 and
 *   shows an auto-pause footer (proves we know reply-handling matters).
 * - Banner pinned at top: "Demo only — never sent to real clinicians".
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Sequence, Touch } from "@/lib/types";

type Tone = "direct" | "conversational" | "skeptical";

const TONES: { id: Tone; label: string }[] = [
  { id: "direct", label: "Direct" },
  { id: "conversational", label: "Conversational" },
  { id: "skeptical", label: "Skeptical-buyer-friendly" },
];

const LEVERAGE_LABELS: Record<Touch["leverage"], string> = {
  price_anchor: "price anchor",
  doc_upload_diff: "doc-upload differentiator",
  pipeda_compliance: "PIPEDA",
  ontario_vor: "Ontario VoR",
  peer_adoption: "peer adoption",
  specialty_template: "specialty template",
  ehr_specific: "EMR-specific",
};

const CHANNEL_LABELS: Record<Touch["channel"], string> = {
  email: "Email",
  linkedin: "LinkedIn",
  call: "Call",
};

function ChannelIcon({ channel }: { channel: Touch["channel"] }) {
  // Inline SVG so we don't pay a lucide chunk for three tiny glyphs.
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (channel === "email") {
    return (
      <svg {...common} aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (channel === "linkedin") {
    return (
      <svg {...common} aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 animate-pulse rounded-full bg-current"
    />
  );
}

export function SequencePane({ leadId }: { leadId: string }) {
  const [tone, setTone] = useState<Tone>("direct");
  const [loading, setLoading] = useState(false);
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [mocked, setMocked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [replied, setReplied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setReplied(false);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ leadId, tone }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Draft request failed (${res.status})${txt ? `: ${txt.slice(0, 200)}` : ""}`);
      }
      const data: { sequence: Sequence; mocked: boolean } = await res.json();
      setSequence(data.sequence);
      setMocked(Boolean(data.mocked));
      setOpenDay(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong drafting the sequence.");
    } finally {
      setLoading(false);
    }
  }

  // Bridge to the mobile sticky CTA bar. LeadMobileCta dispatches a
  // `lead:generate` CustomEvent on window so the two components stay
  // decoupled — the bar doesn't need a ref into this pane and the pane
  // doesn't need to know the bar exists. Stash `generate` in a ref so
  // the listener always fires the latest closure (current tone, leadId).
  const generateRef = useRef(generate);
  useEffect(() => {
    generateRef.current = generate;
  });
  useEffect(() => {
    const handler = () => {
      void generateRef.current();
    };
    window.addEventListener("lead:generate", handler);
    return () => window.removeEventListener("lead:generate", handler);
  }, []);

  return (
    <section className="space-y-5">
      {/* Demo-only banner */}
      <div className="rounded-xl bg-forest-50 px-4 py-3 text-[12.5px] text-forest-700 ring-1 ring-forest-200">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">demo only</span>
        <span className="mx-2 text-forest-300">·</span>
        never sent to real clinicians. Drafts render in-browser and disappear on reload.
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Tone
          </div>
          {mocked && sequence ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre-100 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ochre-800">
              mocked · no OpenAI key set
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TONES.map((t) => {
            const active = t.id === tone;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[12px] transition-colors",
                  active
                    ? "bg-forest-700 text-forest-50"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className={cn(
              "inline-flex items-center gap-2 rounded-md bg-forest-700 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-forest-50 transition-colors",
              "hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-70",
            )}
          >
            {loading ? (
              <>
                <Spinner /> Drafting…
              </>
            ) : sequence ? (
              "Regenerate sequence"
            ) : (
              "Generate sequence"
            )}
          </button>
          {sequence ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              4 touches · Day 1 / 4 / 9 / 16
            </span>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
            {error}
          </div>
        ) : null}
      </div>

      {/* Empty state */}
      {!sequence && !loading ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-8 text-center">
          <p className="font-display text-[18px] tracking-tight text-foreground">
            No drafts yet.
          </p>
          <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">
            Pick a tone and generate. Each touch leans on a different leverage point:
            price anchor, doc-upload differentiator, Ontario VoR + PIPEDA, peer adoption.
          </p>
        </div>
      ) : null}

      {/* Touches */}
      {sequence ? (
        <div className="space-y-3">
          {sequence.touches.map((t) => {
            const struck = replied && t.day !== 1;
            const isOpen = openDay === t.day;
            return (
              <article
                key={t.day}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors",
                  struck ? "border-border/40 opacity-70" : "border-border/70",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenDay(isOpen ? null : t.day)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="inline-flex h-7 min-w-[3.25rem] items-center justify-center rounded-full bg-forest-100 px-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-forest-800">
                    Day {t.day}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <ChannelIcon channel={t.channel} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      {CHANNEL_LABELS[t.channel]}
                    </span>
                  </span>
                  <span className="inline-flex items-center rounded-md bg-ochre-50 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ochre-800 ring-1 ring-ochre-200">
                    {LEVERAGE_LABELS[t.leverage]}
                  </span>
                  <span
                    className={cn(
                      "ml-2 truncate font-display text-[15.5px] tracking-tight text-foreground",
                      struck && "line-through",
                    )}
                  >
                    {t.subject}
                  </span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {isOpen ? "hide" : "open"}
                  </span>
                </button>

                {isOpen ? (
                  <div className="border-t border-border/60 px-5 py-4">
                    <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Subject
                    </div>
                    <div
                      className={cn(
                        "font-display text-[18px] leading-snug tracking-tight text-foreground",
                        struck && "line-through",
                      )}
                    >
                      {t.subject}
                    </div>

                    <div className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Body
                    </div>
                    <div
                      className={cn(
                        "whitespace-pre-line text-pretty font-serif text-[15px] leading-relaxed text-foreground",
                        struck && "line-through",
                      )}
                    >
                      {t.body}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>{t.wordCount} words</span>
                      {t.day === 1 ? (
                        <button
                          type="button"
                          onClick={() => setReplied((r) => !r)}
                          className={cn(
                            "rounded-md px-2.5 py-1 transition-colors",
                            replied
                              ? "bg-forest-700 text-forest-50"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                          )}
                        >
                          {replied ? "Replied · sequence paused" : "Mark replied"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}

          {replied ? (
            <div className="rounded-xl bg-forest-50 px-4 py-3 text-[12.5px] text-forest-700 ring-1 ring-forest-200">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                auto-paused
              </span>
              <span className="mx-2 text-forest-300">·</span>
              reply detected on Day 1 → Days 4 / 9 / 16 cancelled, thread routed to founder
              inbox for human follow-up.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default SequencePane;
