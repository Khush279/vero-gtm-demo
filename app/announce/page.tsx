import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { AnnounceCard } from "@/components/announce-card";
import { ANNOUNCE } from "@/data/announce";

/**
 * /announce: the LinkedIn announcement post Khush would write the day this
 * hire closes, plus two alternates at different lengths and tones for
 * calibration. Server component. All copy lives in /data/announce.ts.
 *
 * The page reads in 60 seconds: three LinkedIn-mock cards in a row (collapse
 * to one column on mobile), tone notes block underneath, and a "what I would
 * not post" list at the bottom.
 */

export const metadata: Metadata = {
  title: "Announcement post",
  description:
    "What I'd write on LinkedIn the day this hire closes. Three drafts at different lengths and tones, plus the things I would not post.",
};

export default function AnnouncePage() {
  const { primary, alternates, doNotPost } = ANNOUNCE;
  const allPosts = [primary, ...alternates];

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Day 1 · LinkedIn"
        title={<>The announcement post.</>}
        subtitle="What I'd write on LinkedIn the day this hire closes. Three drafts at different lengths and tones, plus the things I would not post."
      />

      {/* Three LinkedIn-mock cards */}
      <section
        aria-label="Announcement drafts"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {allPosts.map((post) => (
          <AnnounceCard
            key={post.id}
            post={post}
            isPrimary={post.id === "primary"}
          />
        ))}
      </section>

      {/* Tone notes */}
      <section
        aria-label="Tone notes"
        className="space-y-4 rounded-xl border border-border/70 bg-card px-6 py-6 md:px-8 md:py-7"
      >
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Tone notes
        </h2>
        <dl className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-3">
          {allPosts.map((post) => (
            <div key={post.id} className="space-y-1.5">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-forest-700">
                {post.toneLabel}
              </dt>
              <dd className="font-serif text-[13.5px] leading-relaxed text-foreground/85">
                {post.notes}
              </dd>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums text-muted-foreground/70">
                {post.charCount.toLocaleString()} chars
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* What I would not post */}
      <section
        aria-label="What I would not post"
        className="space-y-4 rounded-xl border border-ochre-200 bg-ochre-50/70 px-6 py-6 md:px-8 md:py-7"
      >
        <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ochre-700">
          What I would not post
        </h2>
        <ul className="space-y-2.5">
          {doNotPost.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 font-serif text-[14px] leading-relaxed text-ochre-900"
            >
              <span
                aria-hidden
                className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-ochre-600"
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
