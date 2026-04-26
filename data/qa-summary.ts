/**
 * QA_SUMMARY — the post-call leave-behind.
 *
 * /interview-prep is the rehearsal artifact: 15 questions, structured answers.
 * /qa-summary is the read-it-a-week-later artifact: 5 things Adeel and Bill
 * should remember if they forget everything else from the call. Each takeaway
 * is synthesized from 2-3 of the 15 questions, not lifted from any one of
 * them. Pure data. Pull quotes are designed to be copy-able into a Slack DM.
 */

export type Takeaway = {
  id: string;
  /** The headline takeaway, 1 sentence, font-display style. */
  pull: string;
  /** 2-3 sentence supporting body. */
  body: string;
  /** Which demo surface backs it (with link). */
  evidence: string;
  /** Which interview-prep question IDs this synthesizes. */
  derivedFrom: string[];
};

export type QaSummary = {
  /** 1 paragraph: what this page is and how to read it. */
  intro: string;
  /** 5 entries. */
  takeaways: Takeaway[];
  /** The final sentence Khush wants them to remember. */
  oneLineCloser: string;
};

export const QA_SUMMARY: QaSummary = {
  intro:
    "This is the one-page version of the interview, written for the Friday after. The 15-card prep page is rehearsal. This page is memory. Five takeaways, each one the synthesized answer to two or three of the questions you were most likely to ask. Read in 90 seconds. Forward to a co-founder in 10.",
  takeaways: [
    {
      id: "t1-where-the-arr-lives",
      pull: "The next $1M of ARR is sitting in 4,000 Ontario family physicians who have not yet searched for an AI scribe.",
      body:
        "The buyer is finite, knowable, and reachable through the CPSO public register. Vero already wins the search results from the FPs who do search. The work is building the outbound engine that reaches the ones who do not, before Tali figures out the same thing.",
      evidence: "/strategy 90-day funnel math",
      derivedFrom: ["q02-next-1m-arr", "q06-why-family-medicine", "q10-90-day-target"],
    },
    {
      id: "t2-wedge-shape",
      pull: "Vero out-features Tali on price, doc upload, and 150 specialty templates. Tali out-brands Vero on the OMA newsletter.",
      body:
        "The product wedge is real and the buyer feels the price delta in the first conversation. The brand gap is the work, and it closes with comparison-page SEO and one OCFP webinar by August. We do not need to win on every dimension. We need to win on the dimensions a buyer ranks first.",
      evidence: "/vs-tali full feature comparison",
      derivedFrom: ["q03-wedge-vs-tali", "q11-where-this-goes-wrong"],
    },
    {
      id: "t3-day-one-shape",
      pull: "Day one is shipping the first 50 cold emails, not writing the strategy doc.",
      body:
        "Monday: 500 CPSO leads in Attio, scored. Friday: 200 sends out, 5 demos in calendar, baseline reply rate captured. The 30/60/90 memo is a side effect of doing the work, not the prerequisite to starting it. By week 12 I am the architect of the engine, not the operator inside it.",
      evidence: "/day1 hour-by-hour plan",
      derivedFrom: ["q05-week-1-sequence", "q09-time-split"],
    },
    {
      id: "t4-where-it-breaks",
      pull: "The risk that keeps me up is depending on inbound to scale at the rate Vero is hiring.",
      body:
        "80/20 inbound/outbound is the right mix for where Vero is. It is the wrong mix for the next 10,000 reachable FPs. The mitigation is not a bigger marketing budget; it is a closed-loop attribution layer that tells us which sequence step is doing the work, paired with one named-account motion to prove the enterprise lane.",
      evidence: "/channel-mix and /strategy what-could-break",
      derivedFrom: ["q07-concerns-gtm-today", "q08-build-differently", "q11-where-this-goes-wrong"],
    },
    {
      id: "t5-how-i-keep-score",
      pull: "I would rather miss the 90-day target by 20% with clean attribution than hit it without knowing why.",
      body:
        "$200k MRR by Day 90 is the number, and the math behind it lives on /strategy. The metric I care about more than that number is forecasting accuracy: the gap between what I predict on Friday and what shows up the next Friday. Hitting a target you cannot explain is luck. Missing one you can explain is information.",
      evidence: "/metrics weekly forecast vs actual",
      derivedFrom: ["q10-90-day-target", "q08-build-differently"],
    },
  ],
  oneLineCloser:
    "If Vero hires for the work I want to do, the next year of the company looks like a Toronto family doctor opening a Vero email on a Tuesday morning and saying, finally, somebody who gets it.",
};
