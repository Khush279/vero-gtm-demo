/**
 * /candor data. The page founders find via /map or /tour but isn't pushed in
 * the top-nav. Calibrated for after the call, not during. The voice rule is
 * stricter here than anywhere else in the demo — every line has to be
 * defensible in person.
 */

export type Bullet = {
  id: string;
  body: string;
};

export type CandorContent = {
  whyThisExists: string;
  pushBackOnStrategy: Bullet[];
  whatsBrokenInHealthtech: string[];
  whatIWantFromYou: Bullet[];
  signoff: string;
};

export const CANDOR: CandorContent = {
  whyThisExists:
    "The rest of the demo is calibrated for the interview. This page isn't. If you're reading it, you went looking for it, which is a fair signal we'd actually work well together.",

  pushBackOnStrategy: [
    {
      id: "doc-upload-moat",
      body: "The doc-upload differentiator buys a year, not a moat. Tali ships PDF parsing in Q1 2026 (probably) and the gap closes. Plan for that quarter now, not after.",
    },
    {
      id: "vor-not-sales-motion",
      body: "Ontario VoR is a procurement bypass, not a sales motion. We can't run outbound off it. It speeds the buy after the buy decision, which is real but bounded.",
    },
    {
      id: "comparison-content-fragility",
      body: "Comparison-content SEO works until Tali stops sleeping. Once the incumbent decides to fight on comparison pages they win, because they own the brand search Vero is currently arbitraging.",
    },
    {
      id: "150-templates-claim",
      body: "The 150+ specialty template claim is technically true and rhetorically suspect. The long tail is mostly auto-generated and clinicians notice. The honest pitch is: 18 templates we hand-tuned, plus a generator for the rest. Sell the 18.",
    },
  ],

  whatsBrokenInHealthtech: [
    "Clinicians get burned by software promises every quarter. The only real moat in this market is trust, and trust is built by undersold features that work, not over-pitched features that ship a month late. Vero's decision to lead with $60/mo instead of $200/mo is a moat-of-trust as much as it is a price moat. That's the read.",
    "The comparison-content SEO motion is a race the incumbent always wins eventually. The Vero blog is currently page-1 on 14 of 20 high-intent queries because Tali isn't fighting that war yet. They will. The window is 18 months, not five years. Whatever we build in that window has to outlive the SEO arbitrage.",
    "Canadian healthtech is in a soft bubble right now. Every Tier 1 hospital is piloting two or three scribes. The next 24 months pick the consolidator. We don't have to be biggest to win that, but we do have to be the one founders mention by name when their friend asks. That's a brand problem, not a feature problem.",
  ],

  whatIWantFromYou: [
    {
      id: "role-clarity",
      body: "Don't hire me as a founding GTM engineer if you actually want a senior BDR. Different roles. The risk of role confusion is real and it kills the hire if it isn't sorted in the first two weeks.",
    },
    {
      id: "override-permission",
      body: "I work better with founders who'll override me when I'm wrong. If Adeel ever says 'no, the clinical reality is different' I'll move that day. The worst version of this hire is one who pushes outbound volume past clinical credibility.",
    },
    {
      id: "permission-to-be-wrong",
      body: "I want to be wrong about the things on this page within 90 days. If I am, I'll write the follow-up post about why. If you want a candidate who never updates in public, I'm not it.",
    },
  ],

  signoff: "Khush · written when no one was looking.",
};
