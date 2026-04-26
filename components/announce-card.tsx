/**
 * One LinkedIn-mock card on /announce. Pure presentational, server-rendered.
 *
 * Layout: avatar circle (initials) + name + role + "now" timestamp at the
 * top, body in serif with proper line breaks for paragraph spacing,
 * mono char-count footer at the bottom. Active "primary" card gets a forest
 * accent border so the eye lands on the recommended draft first.
 */

import { cn } from "@/lib/utils";
import type { AnnouncePost } from "@/data/announce";

export function AnnounceCard({
  post,
  isPrimary,
}: {
  post: AnnouncePost;
  isPrimary: boolean;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border bg-card shadow-sm",
        isPrimary
          ? "border-forest-400/70 ring-1 ring-forest-300/60"
          : "border-border/60",
      )}
      aria-label={`${post.toneLabel} announcement draft`}
    >
      {/* Tone strip */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-t-xl border-b px-4 py-2",
          isPrimary
            ? "border-forest-200 bg-forest-50 text-forest-700"
            : "border-border/70 bg-muted/30 text-muted-foreground",
        )}
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em]">
          {post.toneLabel}
        </span>
        {isPrimary ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-forest-700">
            Recommended
          </span>
        ) : null}
      </div>

      {/* LinkedIn-style author row */}
      <header className="flex items-center gap-3 px-5 pt-5">
        <div
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-700 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-paper"
        >
          KA
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium leading-tight text-foreground">
            Khush Agarwala
          </div>
          <div className="truncate text-[12px] leading-tight text-muted-foreground">
            Founding GTM Engineer · Vero
          </div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            now · Toronto
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 px-5 pb-4 pt-4">
        <div className="space-y-3 font-serif text-[14.5px] leading-[1.65] text-foreground/90">
          {post.body.split(/\n\n+/).map((para, i) => (
            <p key={i} className="text-pretty whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* LinkedIn-mock action bar */}
      <div className="border-t border-border/60 px-5 py-2">
        <div className="flex items-center justify-between gap-2 text-muted-foreground/70">
          <div className="flex gap-4 font-mono text-[10.5px] uppercase tracking-[0.18em]">
            <span>Like</span>
            <span>Comment</span>
            <span>Repost</span>
          </div>
        </div>
      </div>

      {/* Footer: meta */}
      <footer className="flex items-center justify-between gap-3 rounded-b-xl border-t border-border/60 bg-muted/20 px-5 py-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          {post.charCount.toLocaleString()} chars
        </span>
        <span className="truncate text-right font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground/80">
          {post.id}
        </span>
      </footer>

      {/* Author note (only on primary, ochre-tinted) */}
      <div
        className={cn(
          "border-t px-5 py-3 text-[12.5px] leading-relaxed",
          isPrimary
            ? "border-ochre-200/80 bg-ochre-50 text-ochre-900"
            : "border-border/60 bg-background text-foreground/75",
        )}
      >
        <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground">
          When to post
        </span>
        <p className="mt-1 font-serif">{post.notes}</p>
      </div>
    </article>
  );
}

export default AnnounceCard;
