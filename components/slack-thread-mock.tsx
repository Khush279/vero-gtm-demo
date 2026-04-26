/**
 * Slack-thread mockup. Server component, no interactivity. Renders the
 * day-end brief as it would appear in #gtm-pipeline so a founder reading
 * /day1 sees the actual artifact the day produces, not just a list of
 * activities.
 *
 * Visual rules:
 *  - Slack chrome shape (channel header, posts, threaded replies, reactions)
 *    rendered in the demo's forest/paper palette. No Slack purple.
 *  - Body uses a tiny markdown-lite: **bold**, *italic*, `code`, line breaks.
 *  - Threaded replies indented with a left border. Nesting capped at 1 level
 *    by the data shape (the renderer would handle deeper, but we don't go
 *    there in /day1).
 */

import { Lock, Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlackPost } from "@/data/day1-slack-thread";

export type SlackThreadMockProps = {
  thread: SlackPost[];
};

export function SlackThreadMock({ thread }: SlackThreadMockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
      {/* Channel header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Lock
            aria-hidden
            className="h-3 w-3 text-muted-foreground/70"
            strokeWidth={2.25}
          />
          <span className="font-mono text-[12.5px] text-foreground">
            # gtm-pipeline
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
            · private · 3 members
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          today
        </span>
      </div>

      {/* Posts */}
      <ol className="divide-y divide-border/40">
        {thread.map((post) => (
          <li key={post.id} className="px-4 py-4 sm:px-5">
            <SlackPostView post={post} depth={0} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default SlackThreadMock;

/* ----------------------------- Sub-components ----------------------------- */

function SlackPostView({ post, depth }: { post: SlackPost; depth: number }) {
  const monogram = getMonogram(post.author.name);

  return (
    <article className="flex gap-3">
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-[12px] font-medium",
          post.author.avatarColor,
        )}
        aria-hidden
      >
        {monogram}
      </div>

      {/* Body column */}
      <div className="min-w-0 flex-1 space-y-1.5">
        {/* Author line */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[13.5px] font-medium text-foreground">
            {post.author.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {post.author.role}
          </span>
          <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground/70">
            {post.postedAt}
          </span>
        </div>

        {/* Body */}
        <SlackBody body={post.body} />

        {/* Reactions */}
        {post.reactions.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {post.reactions.map((r, i) => (
              <span
                key={`${r.emoji}-${i}`}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[11.5px] text-foreground/80 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <span aria-hidden>{r.emoji}</span>
                <span className="font-mono tabular-nums text-[10.5px] text-muted-foreground">
                  {r.count}
                </span>
              </span>
            ))}
            {/* Reply hint, just visual */}
            <span className="ml-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
              <Reply aria-hidden className="h-3 w-3" strokeWidth={2.25} />
              {post.thread?.length ?? 0} {(post.thread?.length ?? 0) === 1 ? "reply" : "replies"}
            </span>
          </div>
        ) : null}

        {/* Threaded replies */}
        {post.thread && post.thread.length > 0 ? (
          <ol
            className={cn(
              "mt-3 space-y-4 border-l-2 border-border/50 pl-4",
              depth >= 1 && "pl-3",
            )}
          >
            {post.thread.map((reply) => (
              <li key={reply.id}>
                <SlackPostView post={reply} depth={depth + 1} />
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Tiny markdown-lite renderer. Handles **bold**, *italic*, `code` inline,
 * and preserves line breaks. Intentionally narrow — Slack posts here are
 * authored, not user-generated, so we don't need a real parser.
 */
function SlackBody({ body }: { body: string }) {
  const lines = body.split("\n");
  return (
    <div className="space-y-1 text-[13.5px] leading-relaxed text-foreground/90">
      {lines.map((line, i) => {
        if (line.trim() === "") {
          return <div key={i} className="h-1.5" aria-hidden />;
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Splits a single line into bold / italic / code / plain spans. Order of
 * tokens matters: code first (so its contents aren't interpreted), then
 * bold (** before *), then italic.
 */
function renderInline(line: string): React.ReactNode[] {
  const tokens = tokenize(line);
  return tokens.map((t, i) => {
    switch (t.kind) {
      case "code":
        return (
          <code
            key={i}
            className="rounded-sm bg-muted px-1 py-[1px] font-mono text-[12px] text-foreground"
          >
            {t.text}
          </code>
        );
      case "bold":
        return (
          <span key={i} className="font-medium text-foreground">
            {t.text}
          </span>
        );
      case "italic":
        return (
          <span key={i} className="italic">
            {t.text}
          </span>
        );
      default:
        return <span key={i}>{t.text}</span>;
    }
  });
}

type Token = { kind: "text" | "bold" | "italic" | "code"; text: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let rest = input;

  // Greedy: at each step, find the earliest delimiter and emit the text
  // before it, then the styled run.
  const patterns: { kind: Token["kind"]; re: RegExp }[] = [
    { kind: "code", re: /`([^`]+)`/ },
    { kind: "bold", re: /\*\*([^*]+)\*\*/ },
    { kind: "italic", re: /\*([^*]+)\*/ },
  ];

  while (rest.length > 0) {
    let earliest: { kind: Token["kind"]; index: number; match: RegExpExecArray } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(rest);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { kind: p.kind, index: m.index, match: m };
      }
    }
    if (!earliest) {
      tokens.push({ kind: "text", text: rest });
      break;
    }
    if (earliest.index > 0) {
      tokens.push({ kind: "text", text: rest.slice(0, earliest.index) });
    }
    tokens.push({ kind: earliest.kind, text: earliest.match[1] });
    rest = rest.slice(earliest.index + earliest.match[0].length);
  }

  return tokens;
}

/** "Khush Agarwala" -> "KA". Falls back to first 2 chars. */
function getMonogram(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
