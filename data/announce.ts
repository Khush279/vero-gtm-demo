/**
 * Mock LinkedIn announcement post Khush would write on day 1 at Vero, with
 * two alternate drafts at different lengths and tones for calibration.
 *
 * The conceit on /announce: founders watch how candidates announce themselves
 * publicly. A draft post that's specific, on-brand, and not cringe is signal.
 *
 * Voice constraints (hard rules):
 *  - No em dashes anywhere. Periods or commas instead.
 *  - No "thrilled," "excited," "humbled," "honored to announce."
 *  - No emojis. No exclamation points.
 *  - No anthropomorphizing the product. No tricolons, no X-not-Y framing.
 *  - Numbers anchored to /data/strategy.md so the page reads consistent
 *    with /press-release.
 */

export type AnnouncePost = {
  id: "primary" | "humble" | "punchy";
  /** Tone label used by the card header. */
  toneLabel: string;
  /** The actual post text. Plain text, blank line between paragraphs. */
  body: string;
  /** Pre-computed length so the UI can show it without re-measuring. */
  charCount: number;
  /** One-line author note: when this draft is the right one to post. */
  notes: string;
};

export type AnnounceContent = {
  /** Two-sentence intro explaining why this page exists. */
  intro: string;
  /** The recommended post. */
  primary: AnnouncePost;
  /** Two alternates at different lengths. */
  alternates: AnnouncePost[];
  /** Things Khush would never post on day 1, with brief reasoning. */
  doNotPost: string[];
};

const PRIMARY_BODY = `A family doctor in Sudbury rosters 2,400 patients, finishes clinic at 5pm, and charts until 9. That's most of the family medicine I've talked to in Ontario this year.

Today I'm joining Vero as founding GTM engineer.

Vero is the Canadian AI medical scribe already used by 5,000+ clinicians. It's PIPEDA-compliant, holds the Ontario Health VoR badge, ingests referral letters and PDFs the way US scribes don't, and runs at roughly a fifth of DAX's price. 6.5M Ontarians don't have a family doctor right now. The clinicians who do are the ones I want this product in front of next.

If you're a Canadian primary care physician using a scribe today, or thinking about one, I want a 15-minute call this month. DM me.`;

const HUMBLE_BODY = `A family doctor in Sudbury rosters 2,400 patients, finishes clinic at 5pm, and charts until 9. That image is the reason I took this job.

I've spent the last few years building growth and automation systems for software companies because the work is fun. Healthcare wasn't on the original list. It got there slowly, through friends who went into family medicine and a year of reading about documentation burden until it stopped feeling abstract.

Today I'm joining Vero as founding GTM engineer. Adeel and Bill have built something that already works: 5,000+ paying clinicians, 150+ specialty templates, Ontario Health VoR, real margin. The product is settled. My job is reach. Most of the 14,200 family physicians in Ontario have never typed "AI medical scribe" into a search bar, and the next leg of growth is an outbound engine built like software next to a content motion that owns every comparison query in the category.

I'm joining a team, not founding a function. The work is to make the engine they've already started measurable, repeatable, and faster.

If you're a Canadian primary care physician using a scribe today, or thinking about one, I want a 15-minute call this month. DM me.`;

const PUNCHY_BODY = `Joined Vero today as founding GTM engineer.

5,000+ Canadian clinicians already use Vero to get two hours of charting back every night. Cheapest scribe in the category, Ontario Health VoR, the only one that ingests referral PDFs. The job is to put the next 20,000 in front of it, starting with the 14,200 family physicians in Ontario.

Canadian primary care physicians using a scribe, or shopping for one. 15 minutes this month. DM me.`;

export const ANNOUNCE: AnnounceContent = {
  intro:
    "What I'd write on LinkedIn the day this hire closes. Three drafts at different lengths and tones, plus the things I would not post.",
  primary: {
    id: "primary",
    toneLabel: "Default · short",
    body: PRIMARY_BODY,
    charCount: PRIMARY_BODY.length,
    notes:
      "Post this. Hook with a specific clinician, name the role, anchor on the moat numbers, end with a 15-minute ask.",
  },
  alternates: [
    {
      id: "humble",
      toneLabel: "Founder-led · longer",
      body: HUMBLE_BODY,
      charCount: HUMBLE_BODY.length,
      notes:
        "Post this if Adeel or Bill ask for something more reflective, or if it's going up the same week as a Vero brand moment.",
    },
    {
      id: "punchy",
      toneLabel: "Punchy · 1-screen",
      body: PUNCHY_BODY,
      charCount: PUNCHY_BODY.length,
      notes:
        "Post this if I want the first comment from a clinician inside an hour. Three lines, mobile-first, no scroll required.",
    },
  ],
  doNotPost: [
    "Don't post a humble-brag thread about the offer process or how many companies I talked to.",
    "Don't @-tag Adeel or Bill until day 7. The first post is mine to land before it becomes a Vero brand moment.",
    "Don't include the demo URL. It's an interview asset, not a marketing one, and it dilutes both surfaces if it leaks.",
    "Don't lead with my own resume. The hook is a real clinician's day, not the new title.",
    "Don't open replies with a templated DM. If 30 PCPs reach out, 30 get a personal first line referencing their clinic city or EMR.",
  ],
};
