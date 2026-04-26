/**
 * The Slack thread that closes day 1. This is the artifact the /day1 page
 * actually produces by 6 PM: a brief in #gtm-pipeline that founders read
 * with their evening coffee.
 *
 * Structured as one main post by Khush plus three replies. The thread is
 * deliberately short — Slack, not a doc. Reactions are a stand-in for the
 * "+1, read it" signal that makes async closure work.
 *
 * Body strings use a tiny markdown-lite the renderer understands:
 *   **bold**   -> font-medium
 *   *italic*   -> italic
 *   `code`     -> mono pill
 *   \n         -> line break
 */

export type SlackPost = {
  id: string;
  author: { name: string; role: string; avatarColor: string };
  postedAt: string;
  body: string;
  reactions: { emoji: string; count: number }[];
  thread?: SlackPost[];
};

export const DAY1_SLACK_THREAD: SlackPost[] = [
  {
    id: "eod_brief_main",
    author: {
      name: "Khush Agarwala",
      role: "GTM",
      // Forest is the build palette; reads as the person driving the engine.
      avatarColor: "bg-forest-500 text-paper",
    },
    postedAt: "5:50 PM",
    body: [
      "@channel quick EOD brief, day 1.",
      "",
      "**Shipped today**",
      "• Outbound funnel diagnostic, last 90 days. Leakiest stage is open-to-reply on the solo-FP cohort (1.4%). Pinned the one-pager in #gtm.",
      "• Search Console pass: 3 pages ranking on EMR-charting queries with sub-3% CTR. Title-tag rewrites drafted, waiting on Adeel for clinical phrasing.",
      "• Attio v0 live. 8 stages wired, ICP scoring recalcing on lead update, 50 leads queued in the *ready to sequence* view.",
      "• 3 first-touch email drafts (solo FP, group practice owner, FHT lead). In Notion, tagged for Adeel review.",
      "• Subject-line A/B scheduled for 7 AM ET tomorrow, 200 sends, 2 cohorts of 100. Decision rule written: ship the winner if delta is over 4pts at n=200, else extend to 400.",
      "",
      "**On deck for tomorrow**",
      "• 7 AM batch fires, then I sit on the inbox until 9 to triage replies live and tag every objection into the copy file.",
      "• Wire the Telus PSS vs Accuro split into the Attio view so we can read reply rate by EMR by lunch.",
      "• Second sequence variant for the group-practice ICP, leading on after-clinic charting hours since that phrase came up in 4 of 5 transcripts.",
      "",
      "**One open question**",
      "• Telus PSS clinic owners are showing higher reply rates than Accuro in the 90-day pull (3.1% vs 1.8% on a small n). Should we lead with EMR-native variants in week 2, or hold and run the broader test first to keep the read clean?",
    ].join("\n"),
    reactions: [
      { emoji: "✅", count: 3 },
      { emoji: "🚀", count: 1 },
      { emoji: "👀", count: 2 },
      { emoji: "💯", count: 1 },
      { emoji: "🧠", count: 1 },
    ],
    thread: [
      {
        id: "eod_brief_reply_adeel",
        author: {
          name: "Adeel Khan",
          // Co-founder, MD. The clinical eye on every send.
          role: "Co-founder, MD",
          avatarColor: "bg-ochre-300 text-ochre-900",
        },
        postedAt: "6:12 PM",
        body: [
          "🔥 the 3 emails draft looks tight. Two clinical nits before these go out:",
          "",
          "1. *Family Practice* vs *Family Medicine*. Canada uses both colloquially but the CPSO and CFPC both list the specialty as **Family Medicine**, so lean that way for the FP variant. It is the phrasing on the licence and on the plaque, and a few of these recipients will clock the difference.",
          "2. The line about *after-hours charting* in variant B should specify **post-clinic** charting. Some FPs still take night call (rural, on-call rotations, hospitalist coverage) and *after-hours* reads to them as call shifts, not the EMR backlog at 9 PM that we are actually solving.",
          "",
          "Both are 30-second fixes. Approve once those land.",
        ].join("\n"),
        reactions: [
          { emoji: "🙏", count: 2 },
          { emoji: "✅", count: 1 },
        ],
      },
      {
        id: "eod_brief_reply_bill",
        author: {
          name: "Bill Chen",
          role: "Co-founder, Eng",
          avatarColor: "bg-forest-200 text-forest-800",
        },
        postedAt: "6:18 PM",
        body: [
          "ICP recompute job is firing on every lead update right now. Cheap at this volume, but should we debounce to 5min batches once we are past 1k leads/day? Easy to ship, saves us a refactor later.",
        ].join("\n"),
        reactions: [
          { emoji: "✅", count: 2 },
          { emoji: "👍", count: 1 },
        ],
        thread: [
          {
            id: "eod_brief_reply_khush_to_bill",
            author: {
              name: "Khush Agarwala",
              role: "GTM",
              avatarColor: "bg-forest-500 text-paper",
            },
            postedAt: "6:24 PM",
            body: [
              "+1, will ship the debounce tonight. 5min window, single recompute per lead per window. EMR-native question for Adeel: pulled the data, will share with that thread by AM.",
            ].join("\n"),
            reactions: [{ emoji: "🫡", count: 1 }],
          },
        ],
      },
    ],
  },
];
