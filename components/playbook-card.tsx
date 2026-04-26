"use client";

/**
 * Playbook card on /playbooks. Collapsed state is a one-line summary plus
 * audience / channel tags and the expected-outcome chips. Expanded state
 * reveals every section with serif headings, plus the reusable assets and
 * ship-time block. Section bodies allow markdown — bold, simple lists, and
 * fenced ``` blocks rendered as monospace email templates with a subtle
 * border. Merge tokens like {{firstName}} are highlighted with a mono span.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Playbook, PlaybookSection } from "@/data/playbooks";

export type PlaybookCardProps = {
  playbook: Playbook;
};

export function PlaybookCard({ playbook }: PlaybookCardProps) {
  const [open, setOpen] = useState(false);

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
          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="font-display text-[22px] leading-tight tracking-tight text-foreground">
              {playbook.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11.5px]">
              <Tag label="audience" value={playbook.audience} />
              <Tag label="channel" value={playbook.channel} />
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                goal
              </span>{" "}
              {playbook.goal}
            </p>
          </div>
          <div className="shrink-0">
            <span
              className={cn(
                "inline-flex items-center rounded-md border border-border/70 bg-background px-2.5 py-1",
                "font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground",
                "transition-colors group-hover:text-foreground",
              )}
            >
              {open ? "collapse" : "expand"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {playbook.expectedOutcomes.map((o) => (
            <OutcomeChip key={o.metric} metric={o.metric} target={o.target} />
          ))}
        </div>
      </button>

      {open ? (
        <div className="border-t border-border/60 px-5 py-6 animate-fade-in">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* LEFT: sections (2/3 on desktop) */}
            <div className="space-y-7 lg:col-span-2">
              {playbook.sections.map((section, i) => (
                <SectionBlock key={section.heading} section={section} index={i} />
              ))}
            </div>

            {/* RIGHT: meta (assets + ship time) */}
            <aside className="space-y-5">
              <div className="rounded-md border border-border/60 bg-muted/30 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Reusable assets
                </div>
                <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-foreground/90">
                  {playbook.reusableAssets.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/70 pt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-md border border-border/60 bg-muted/30 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Ship time
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/90">
                  {playbook.estimatedShipTime}
                </p>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default PlaybookCard;

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
        {label}
      </span>
      <span className="text-[12px] text-foreground/85">{value}</span>
    </span>
  );
}

function OutcomeChip({ metric, target }: { metric: string; target: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 rounded-sm border border-border/70 bg-background px-2 py-0.5",
        "text-[11px]",
      )}
    >
      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
        {metric}
      </span>
      <span className="font-mono tabular-nums text-foreground">{target}</span>
    </span>
  );
}

function SectionBlock({ section, index }: { section: PlaybookSection; index: number }) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className="font-display text-[18px] leading-tight tracking-tight text-foreground">
          {section.heading}
        </h4>
      </div>
      <div className="pl-7">
        <MarkdownBody body={section.body} />
      </div>
    </section>
  );
}

/**
 * Lightweight markdown renderer scoped to what playbook bodies actually use:
 * paragraphs, **bold**, `inline code`, fenced ``` blocks (rendered as <pre>
 * email templates), simple unordered lists with "- " prefix, and ordered
 * lists with "1. " prefix. Merge tokens of the form {{token}} are detected
 * inside paragraphs and rendered in mono.
 *
 * Rolled by hand to avoid pulling a markdown dep into the bundle for one
 * page. Handles the cases this surface needs and nothing else.
 */
function MarkdownBody({ body }: { body: string }) {
  // Split body into top-level blocks by blank lines, but keep fenced code blocks intact.
  const blocks = splitBlocks(body);

  return (
    <div className="space-y-3 text-[13.5px] leading-[1.65] text-foreground/90">
      {blocks.map((block, i) => {
        if (block.type === "code") {
          return <EmailTemplate key={i} content={block.content} />;
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="shrink-0 select-none text-muted-foreground/50">
                    ·
                  </span>
                  <span className="flex-1">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="shrink-0 select-none font-mono text-[11px] tabular-nums text-muted-foreground/70 pt-0.5">
                    {String(j + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="text-pretty">
            {renderInline(block.content)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "p"; content: string }
  | { type: "code"; content: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function splitBlocks(body: string): Block[] {
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;

    // Fenced code block.
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.trim().startsWith("```")) {
        buf.push(lines[i]!);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", content: buf.join("\n") });
      continue;
    }

    // Skip blank lines.
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Ordered list (1. ..., 2. ...).
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i]!)) {
        let item = lines[i]!.replace(/^\d+\.\s+/, "");
        i++;
        // Continuation lines (no list prefix, not blank, not code fence).
        while (
          i < lines.length &&
          lines[i]!.trim() !== "" &&
          !/^\d+\.\s+/.test(lines[i]!) &&
          !/^-\s+/.test(lines[i]!) &&
          !lines[i]!.trim().startsWith("```")
        ) {
          item += " " + lines[i]!.trim();
          i++;
        }
        items.push(item);
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Unordered list (- ...).
    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i]!)) {
        let item = lines[i]!.replace(/^-\s+/, "");
        i++;
        while (
          i < lines.length &&
          lines[i]!.trim() !== "" &&
          !/^-\s+/.test(lines[i]!) &&
          !/^\d+\.\s+/.test(lines[i]!) &&
          !lines[i]!.trim().startsWith("```")
        ) {
          item += " " + lines[i]!.trim();
          i++;
        }
        items.push(item);
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Paragraph: collect until blank or special line.
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i]!.trim() !== "" &&
      !/^-\s+/.test(lines[i]!) &&
      !/^\d+\.\s+/.test(lines[i]!) &&
      !lines[i]!.trim().startsWith("```")
    ) {
      buf.push(lines[i]!);
      i++;
    }
    blocks.push({ type: "p", content: buf.join(" ") });
  }

  return blocks;
}

/**
 * Render inline markdown: **bold**, `code`, and {{mergeToken}} highlighting.
 * Returns an array of React nodes preserving order.
 */
function renderInline(text: string): React.ReactNode[] {
  // Tokenize on **...**, `...`, and {{...}} in a single pass.
  const tokens: { type: "text" | "bold" | "code" | "merge"; value: string }[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      tokens.push({ type: "text", value: buf });
      buf = "";
    }
  };

  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        tokens.push({ type: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        flush();
        tokens.push({ type: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (text[i] === "{" && text[i + 1] === "{") {
      const end = text.indexOf("}}", i + 2);
      if (end !== -1) {
        flush();
        tokens.push({ type: "merge", value: text.slice(i, end + 2) });
        i = end + 2;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();

  return tokens.map((t, idx) => {
    if (t.type === "bold") {
      return (
        <strong key={idx} className="font-medium text-foreground">
          {t.value}
        </strong>
      );
    }
    if (t.type === "code") {
      return (
        <code
          key={idx}
          className="rounded-sm bg-muted/70 px-1 py-px font-mono text-[12px] text-foreground"
        >
          {t.value}
        </code>
      );
    }
    if (t.type === "merge") {
      return (
        <span
          key={idx}
          className="font-mono text-[12px] text-ochre-700"
          title="Merge token replaced at send time"
        >
          {t.value}
        </span>
      );
    }
    return <span key={idx}>{t.value}</span>;
  });
}

/**
 * Email template renderer. Subtle border, mono, light cream tint so it reads
 * as the actual artefact and not just another paragraph. Merge tokens get
 * highlighted inside the <pre> as well.
 */
function EmailTemplate({ content }: { content: string }) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-md border border-border/70 bg-muted/40 px-4 py-3",
        "font-mono text-[12.5px] leading-[1.6] text-foreground/95",
        "whitespace-pre-wrap",
      )}
    >
      {highlightMergeTokens(content)}
    </pre>
  );
}

function highlightMergeTokens(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\{\{[^}]+\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    }
    out.push(
      <span key={key++} className="text-ochre-700" title="Merge token">
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return out;
}
