"use client";

/**
 * One interview question rendered as a collapsible card. Collapsed state shows
 * the question (display-italic), category chip, and asker chip. Expanded state
 * reveals the five sections: framework, key points, demo evidence, likely
 * follow-up, mistake to avoid. Each section has a mono small-caps label so the
 * structure is readable at a glance.
 *
 * The "Copy answer" button copies just the keyPoints (joined as a newline list)
 * to the clipboard so Khush can paste them into a notes app and rehearse.
 *
 * Mounted on /interview-prep. Pure client component, no network.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/data/interview-prep";

const CATEGORY_LABELS: Record<InterviewQuestion["category"], string> = {
  fit: "Fit",
  strategy: "Strategy",
  execution: "Execution",
  compensation: "Compensation",
  concerns: "Concerns",
};

const ASKER_LABELS: Record<InterviewQuestion["asker"], string> = {
  adeel: "Adeel",
  bill: "Bill",
  either: "Either",
};

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyAnswer() {
    try {
      const text = question.keyPoints.map((p) => `- ${p}`).join("\n");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article
      className={cn(
        "rounded-lg border border-border/60 bg-card transition-all",
        "hover:border-primary/30",
        open && "border-primary/30 shadow-[0_1px_0_hsl(var(--border))]",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="block w-full px-5 py-4 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryChip category={question.category} />
              <AskerChip asker={question.asker} />
            </div>
            <h3 className="font-display-italic text-[20px] leading-snug tracking-tight text-foreground md:text-[22px]">
              &ldquo;{question.question}&rdquo;
            </h3>
          </div>
          <div className="shrink-0">
            <span
              className={cn(
                "inline-flex items-center rounded-md border border-border/70 bg-background px-2.5 py-1",
                "font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground",
              )}
            >
              {open ? "collapse" : "expand"}
            </span>
          </div>
        </div>
      </button>

      {open ? (
        <div className="border-t border-border/60 px-5 py-6 animate-fade-in">
          <div className="space-y-6">
            <Section label="Framework">
              <p className="text-[14px] leading-relaxed text-foreground/90">
                {question.framework}
              </p>
            </Section>

            <Section label="Key points">
              <ul className="space-y-2">
                {question.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-[13.5px] leading-[1.65] text-foreground/90"
                  >
                    <span className="shrink-0 pt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-pretty">{point}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Section label="Evidence in demo">
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {question.evidenceFromDemo}
                </p>
              </Section>

              <Section label="Likely follow-up">
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {question.potentialFollowUp}
                </p>
              </Section>
            </div>

            <div className="rounded-md border-l-2 border-ochre-700 bg-ochre-50/40 px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ochre-700">
                Red flag to avoid
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">
                {question.redFlagToAvoid}
              </p>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={copyAnswer}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
                  copied
                    ? "bg-forest-700 text-forest-50"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
                aria-live="polite"
              >
                {copied ? "Copied" : "Copy answer"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default QuestionCard;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      {children}
    </section>
  );
}

function CategoryChip({
  category,
}: {
  category: InterviewQuestion["category"];
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-border/70 bg-background px-2 py-0.5",
        "font-mono text-[9.5px] uppercase tracking-[0.18em] text-foreground/80",
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function AskerChip({ asker }: { asker: InterviewQuestion["asker"] }) {
  const tone =
    asker === "adeel"
      ? "bg-forest-50 text-forest-700 border-forest-700/30"
      : asker === "bill"
        ? "bg-ochre-50 text-ochre-700 border-ochre-700/30"
        : "bg-muted/60 text-muted-foreground border-border/70";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5",
        "font-mono text-[9.5px] uppercase tracking-[0.18em]",
        tone,
      )}
    >
      {ASKER_LABELS[asker]}
    </span>
  );
}
