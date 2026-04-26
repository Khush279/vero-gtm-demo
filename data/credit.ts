/**
 * Acknowledgements registry for /credit. Every library shipped, dataset
 * cited, designer borrowed from, and idea internalized has an entry. The
 * "why" line is one specific sentence about what it contributed to this
 * demo. No generics, no "great library" filler.
 *
 * Consumed by app/credit/page.tsx. Read alongside data/sources.ts (which
 * cites public claims). Credit is for tooling and ideas, sources is for
 * numbers.
 */

export type CreditEntry = {
  id: string;
  name: string;
  url?: string;
  /** One specific sentence: what they contributed to this demo. */
  why: string;
};

export type CreditSection = {
  id: string;
  label: string;
  /** One sentence intro to the section. */
  blurb: string;
  entries: CreditEntry[];
};

export type CreditContent = {
  intro: string;
  sections: CreditSection[];
};

export const CREDIT: CreditContent = {
  intro:
    "Every page in this demo leans on someone else's work. The libraries that render it, the datasets that fill it, the editorial software whose design language it borrows, and the writers whose frames shaped the strategy. Listed here, named, linked.",
  sections: [
    // ---------- CODE ----------
    {
      id: "code",
      label: "Code",
      blurb:
        "The runtime, the components, the build pipeline. Everything pulled from package.json, nothing hand-rolled where a stable library exists.",
      entries: [
        {
          id: "nextjs",
          name: "Next.js 14 (App Router)",
          url: "https://nextjs.org/",
          why: "Server components on every surface keep TTFB under 200ms and let the demo ship as static HTML where possible, dynamic only where the OpenAI calls live.",
        },
        {
          id: "react",
          name: "React 18",
          url: "https://react.dev/",
          why: "The Suspense boundary on /chat is what makes the streaming OpenAI response feel native instead of pasted in.",
        },
        {
          id: "tailwind",
          name: "TailwindCSS",
          url: "https://tailwindcss.com/",
          why: "Forty editorial pages in 48 hours requires a utility system; bespoke CSS would have eaten a full day of the build.",
        },
        {
          id: "shadcn",
          name: "shadcn/ui primitives",
          url: "https://ui.shadcn.com/",
          why: "The Dialog and Dropdown primitives on top-nav and mobile-nav are copied straight from shadcn, with the forest-green palette swapped in.",
        },
        {
          id: "radix",
          name: "Radix UI",
          url: "https://www.radix-ui.com/",
          why: "Accessible Dialog and Dropdown internals power the keyboard-shortcuts modal and mobile-nav sheet without manual ARIA wiring.",
        },
        {
          id: "lucide",
          name: "lucide-react",
          url: "https://lucide.dev/",
          why: "Every icon on the demo, from the download glyph on /resources to the arrow chips on /credit, comes from this set; consistent stroke weight is the thing that makes the UI feel coherent.",
        },
        {
          id: "react-markdown",
          name: "react-markdown + remark-gfm",
          url: "https://github.com/remarkjs/react-markdown",
          why: "Renders the strategy memo in data/strategy.md and the GFM tables on /playbooks without a custom parser.",
        },
        {
          id: "openai",
          name: "OpenAI Node SDK",
          url: "https://github.com/openai/openai-node",
          why: "Powers the /chat panel and /prompt-debugger; streaming responses with the SDK is the difference between a working demo and a ten-second lag.",
        },
        {
          id: "next-og",
          name: "next/og",
          url: "https://nextjs.org/docs/app/api-reference/functions/image-response",
          why: "Generates the per-page OpenGraph cards at the edge so a recruiter sharing /strategy on Slack sees a real preview instead of a default favicon.",
        },
        {
          id: "vitest",
          name: "Vitest",
          url: "https://vitest.dev/",
          why: "Runs the lead-scoring and pricing-calculator unit tests in under a second; fast feedback is what made the 48-hour timeline survivable.",
        },
        {
          id: "cheerio",
          name: "cheerio",
          url: "https://cheerio.js.org/",
          why: "Parses the CPSO public register HTML in scripts/scrape-cpso.ts so the day-1 swap from synthetic to real lead data is one command, not a rewrite.",
        },
        {
          id: "cva",
          name: "class-variance-authority + tailwind-merge",
          url: "https://cva.style/",
          why: "Variant-driven button and chip styles across forty pages; tailwind-merge resolves conflicting classes when a child component overrides a parent default.",
        },
      ],
    },

    // ---------- DATA ----------
    {
      id: "data",
      label: "Data",
      blurb:
        "Public registers, blog posts, and pricing pages. Every claim resolves back to one of these or is labeled synthetic on /sources.",
      entries: [
        {
          id: "cpso",
          name: "CPSO Public Register",
          url: "https://www.cpso.on.ca/Public-Register/Doctor-Search",
          why: "The legal source for every Ontario family physician's name, practice address, and registration status; the 10,500-row reachable universe on /strategy is filtered from this register at 1 request per second.",
        },
        {
          id: "cihi",
          name: "CIHI Physicians in Canada",
          url: "https://www.cihi.ca/en/physicians",
          why: "Provides the 14,200 Ontario family physician headcount that anchors the TAM math on /strategy and /pipeline.",
        },
        {
          id: "ontariomd",
          name: "OntarioMD",
          url: "https://www.ontariomd.ca/",
          why: "EMR adoption percentages and the OSCAR Pro / Telus PS Suite split that informs the integration sequencing on /enterprise come from OntarioMD's public dashboards.",
        },
        {
          id: "ocfp",
          name: "Ontario College of Family Physicians",
          url: "https://www.ontariofamilyphysicians.ca/",
          why: "The 6.5 million Ontarians without a family doctor figure on /strategy comes from the OCFP Practice Profile Survey 2026; it is the urgency number behind the whole pitch.",
        },
        {
          id: "veroscribe",
          name: "Vero blog and pricing pages",
          url: "https://veroscribe.com/",
          why: "Pricing ($59.99 to $89), the 150+ template count, the Ontario Health VoR announcement, and the comparison-page voice all come from veroscribe.com directly.",
        },
        {
          id: "capterra",
          name: "Capterra",
          url: "https://www.capterra.com/",
          why: "Cross-checks the Tali AI and Suki AI pricing references on /vs-tali and /vs-suki against a third-party listing so the comparisons are not single-sourced.",
        },
        {
          id: "openview",
          name: "OpenView 2024 SaaS Benchmarks",
          url: "https://openviewpartners.com/2024-saas-benchmarks-report/",
          why: "The 25/40/50 reply-to-demo-to-trial-to-paid floor assumptions on /strategy and /analytics use OpenView's outbound benchmarks as the conservative baseline to beat.",
        },
      ],
    },

    // ---------- DESIGN ----------
    {
      id: "design",
      label: "Design",
      blurb:
        "Two typefaces and three pieces of editorial software set the visual register. Forest green and ochre are mine; almost everything else is borrowed.",
      entries: [
        {
          id: "newsreader",
          name: "Newsreader (Production Type)",
          url: "https://fonts.google.com/specimen/Newsreader",
          why: "Every display headline and italic pull-quote in the demo is set in Newsreader; the editorial weight is what separates this from a generic SaaS landing page.",
        },
        {
          id: "inter",
          name: "Inter (Rasmus Andersson)",
          url: "https://rsms.me/inter/",
          why: "All UI labels, mono small-caps kickers, and body copy lean on Inter's tabular numerals and stylistic sets ss01 and cv01 for the metrics strips.",
        },
        {
          id: "linear",
          name: "Linear",
          url: "https://linear.app/",
          why: "The keyboard-shortcuts modal and the dense, quiet metric strips on /pipeline are direct reads of Linear's information density and command-K muscle memory.",
        },
        {
          id: "attio",
          name: "Attio",
          url: "https://attio.com/",
          why: "The pipeline board layout, lead-card hover states, and the way enterprise champions are framed as people with quotes instead of rows in a CRM came from staring at Attio for an hour.",
        },
        {
          id: "vercel",
          name: "Vercel",
          url: "https://vercel.com/",
          why: "The forest-and-bone palette, the mono-caps section labels, and the restraint with color (one accent, used sparingly) are Vercel's editorial vocabulary applied to a healthcare GTM brief.",
        },
      ],
    },

    // ---------- IDEAS ----------
    {
      id: "ideas",
      label: "Ideas",
      blurb:
        "Books, articles, and frameworks whose thinking is doing actual work in the strategy pages. Cited where they show up.",
      entries: [
        {
          id: "april-dunford",
          name: "April Dunford, Obviously Awesome",
          url: "https://www.aprildunford.com/obviously-awesome",
          why: "The /vs-tali, /vs-suki, /vs-dax positioning frame is Dunford's: list the alternatives the buyer is actually considering, then name the unique value that only Vero delivers in that context.",
        },
        {
          id: "bob-moesta",
          name: "Bob Moesta, Demand-Side Sales / Jobs-to-be-Done",
          url: "https://www.demandsideacademy.com/",
          why: "The ICP definition on /strategy is built around the JTBD progress the FP is trying to make (get home for dinner, stop doing notes at 11pm), not demographics; the urgency-not-features reframe is Moesta's.",
        },
        {
          id: "openview-benchmarks",
          name: "OpenView SaaS Benchmarks",
          url: "https://openviewpartners.com/2024-saas-benchmarks-report/",
          why: "Used as the conservative floor on /sources for funnel conversion percentages so the 90-day plan does not assume best-case math.",
        },
        {
          id: "heidi",
          name: "Heidi Health's content marketing",
          url: "https://www.heidihealth.com/blog",
          why: "The comparison-page playbook on /vs-tali and /vs-summary is a direct read of Heidi's public SEO strategy: rank for 'competitor vs Heidi', own the buyer's research session.",
        },
        {
          id: "vero-blog",
          name: "Vero's own published comparisons",
          url: "https://veroscribe.com/blog",
          why: "Set the bar for tone on /vs-* pages; Vero already writes comparison content with named competitors and specific feature deltas, so the demo had to match that voice or it would have read as off-brand.",
        },
        {
          id: "founding-sales",
          name: "Pete Kazanjy, Founding Sales",
          url: "https://www.foundingsales.com/",
          why: "The 4-touch day 1/4/9/16 cadence on /playbooks and the discovery-to-demo script structure on /demo-script lift directly from the founder-led-sales chapter on outbound.",
        },
      ],
    },

    // ---------- PEOPLE ----------
    {
      id: "people",
      label: "People",
      blurb:
        "The hiring panel this demo was built for, and the physicians whose public records seeded the lead data.",
      entries: [
        {
          id: "adeel",
          name: "Adeel Yang, CEO and co-founder, Vero",
          url: "https://veroscribe.com/",
          why: "Wrote the JD whose ten bullets each became a surface in this demo; the structure of /strategy, /playbooks, and /pipeline answers his explicit asks one for one.",
        },
        {
          id: "bill",
          name: "Bill (hiring panel, Vero)",
          why: "The compliance and procurement framing on /enterprise, /day1, and the Ontario Health VoR thesis on /strategy assume an operator audience that has actually shipped into Canadian health systems.",
        },
        {
          id: "fps",
          name: "The Ontario family physicians on the CPSO public register",
          url: "https://www.cpso.on.ca/Public-Register/Doctor-Search",
          why: "Their public registry entries seeded the lead universe modeled on /pipeline and /lead; one click away from being a human with a 4pm patient and a 9pm note backlog, and the whole demo is for them.",
        },
      ],
    },
  ],
};

export default CREDIT;
