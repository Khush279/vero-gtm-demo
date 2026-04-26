/**
 * Tiny RAG module powering /chat. Pure functions, no I/O, no side effects.
 *
 * Three responsibilities:
 *   1. Build a knowledge base of small "docs" from existing data files
 *      (strategy memo split by H2, each experiment, each playbook, each
 *      source citation, each interview Q&A). One doc = one chunk worth
 *      retrieving as a unit.
 *   2. Score-and-rank docs against a query with simple keyword overlap.
 *      Good enough for a 100-doc corpus, no embeddings required, and
 *      every result is explainable in one sentence.
 *   3. Build the system + user prompts the chat route hands to gpt-4o-mini
 *      (or to the mocked path when no API key is set).
 *
 * The whole module is server-safe pure TypeScript so it can be imported by
 * the API route AND the test file without pulling Next runtime in.
 */

import { promises as fs } from "fs";
import path from "path";

import { EXPERIMENTS } from "@/data/experiments";
import { PLAYBOOKS } from "@/data/playbooks";
import { SOURCES } from "@/data/sources";
import { QUESTIONS } from "@/data/interview-prep";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type KbDoc = {
  /** Stable id for the chunk. Used in tests and logs. */
  id: string;
  /** Human-readable doc title. Shown on the citation chip. */
  title: string;
  /** Internal link the citation chip routes to (e.g. "/strategy"). */
  surface: string;
  /** Body text the retrieval scorer searches. Plain text, no markdown chrome. */
  body: string;
  /** Free-form tags. Future-proofing for filters; not used in scoring yet. */
  tags: string[];
};

// ---------------------------------------------------------------------------
// Stopwords. Kept short on purpose. The corpus is small and over-pruning
// stopwords loses recall on words like "what" in "what's your target".
// ---------------------------------------------------------------------------

const STOPWORDS = new Set<string>([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "i",
  "if",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "so",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "to",
  "too",
  "us",
  "was",
  "we",
  "were",
  "will",
  "with",
  "you",
  "your",
  "yours",
  "be",
  "been",
  "being",
]);

function tokenize(input: string): string[] {
  if (!input) return [];
  return input
    .toLowerCase()
    .replace(/[^a-z0-9$%./\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

// ---------------------------------------------------------------------------
// Strategy memo loader. Splits by H2 so each section ("Day 90", "The 90-day
// funnel math", etc) becomes its own retrievable doc. The memo H1 prelude
// is captured as its own doc so questions like "where is Vero today" still
// resolve.
// ---------------------------------------------------------------------------

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/**
 * Read /data/strategy.md from disk and split it by `## ` headings.
 * If the file is missing (test sandbox, unusual cwd), returns an empty
 * array and the rest of the KB still works.
 */
async function loadStrategyDocs(): Promise<KbDoc[]> {
  let raw = "";
  try {
    const filePath = path.join(process.cwd(), "data", "strategy.md");
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return [];
  }

  if (!raw.trim()) return [];

  // Split keeping a marker so we know where each section starts.
  const lines = raw.split("\n");
  const sections: { title: string; body: string[] }[] = [];
  let current: { title: string; body: string[] } | null = null;

  // Capture content above the first ## as a "preamble" doc.
  const preamble: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace(/^##\s+/, "").trim(), body: [] };
    } else if (line.startsWith("# ") && !current) {
      // H1, treat as preamble title; ignore.
      preamble.push(line.replace(/^#\s+/, "").trim());
    } else if (!current) {
      preamble.push(line);
    } else {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  const docs: KbDoc[] = [];

  const preambleText = preamble.join("\n").trim();
  if (preambleText.length > 0) {
    docs.push({
      id: "strategy_preamble",
      title: "Strategy memo: opening",
      surface: "/strategy",
      body: preambleText,
      tags: ["strategy", "memo"],
    });
  }

  for (const section of sections) {
    const body = section.body.join("\n").trim();
    if (!body) continue;
    docs.push({
      id: `strategy_${slugify(section.title) || "section"}`,
      title: `Strategy: ${section.title}`,
      surface: "/strategy",
      body,
      tags: ["strategy", "memo"],
    });
  }

  return docs;
}

// ---------------------------------------------------------------------------
// Experiment, playbook, source, and interview docs.
// ---------------------------------------------------------------------------

function buildExperimentDocs(): KbDoc[] {
  return EXPERIMENTS.map((e) => ({
    id: `experiment_${e.id}`,
    title: `Experiment: ${e.title}`,
    surface: "/experiments",
    body: [
      e.title,
      `Hypothesis: ${e.hypothesis}`,
      `Rationale: ${e.rationale}`,
      `Variant A: ${e.setup.variantA}`,
      `Variant B: ${e.setup.variantB}`,
      `Primary metric: ${e.primaryMetric}`,
      `Guardrails: ${e.guardrailMetrics.join("; ")}`,
      `MDE: ${e.mde}`,
      `Sample size: ${e.sampleSize}`,
      `Decision rule: ${e.decisionRule}`,
      `Cost: ${e.cost}`,
      `Duration: ${e.duration}`,
      `Category: ${e.category}`,
    ].join("\n"),
    tags: ["experiment", e.category],
  }));
}

function buildPlaybookDocs(): KbDoc[] {
  return PLAYBOOKS.map((p) => ({
    id: `playbook_${p.id}`,
    title: `Playbook: ${p.title}`,
    surface: "/playbooks",
    body: [
      p.title,
      `Audience: ${p.audience}`,
      `Channel: ${p.channel}`,
      `Goal: ${p.goal}`,
      `Expected outcomes: ${p.expectedOutcomes
        .map((o) => `${o.metric} ${o.target}`)
        .join("; ")}`,
      `Reusable assets: ${p.reusableAssets.join("; ")}`,
      `Estimated ship time: ${p.estimatedShipTime}`,
      ...p.sections.map((s) => `${s.heading}\n${s.body}`),
    ].join("\n"),
    tags: ["playbook"],
  }));
}

function buildSourceDocs(): KbDoc[] {
  return SOURCES.map((s) => ({
    id: `source_${s.id}`,
    title: `Source: ${s.citation}`,
    surface: "/sources",
    body: [
      `Claim: ${s.claim}`,
      `Citation: ${s.citation}`,
      s.url ? `URL: ${s.url}` : "",
      `Category: ${s.category}`,
      `Used on: ${s.surface.join(", ")}`,
      s.caveat ? `Caveat: ${s.caveat}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    tags: ["source", s.category],
  }));
}

function buildInterviewDocs(): KbDoc[] {
  return QUESTIONS.map((q) => ({
    id: `interview_${q.id}`,
    title: `Interview Q&A: ${q.question}`,
    surface: "/interview-prep",
    body: [
      `Question: ${q.question}`,
      `Asker: ${q.asker}`,
      `Category: ${q.category}`,
      `Framework: ${q.framework}`,
      `Key points:`,
      ...q.keyPoints.map((k) => `- ${k}`),
      `Evidence in demo: ${q.evidenceFromDemo}`,
      `Likely follow-up: ${q.potentialFollowUp}`,
      `Red flag to avoid: ${q.redFlagToAvoid}`,
    ].join("\n"),
    tags: ["interview", q.category],
  }));
}

// ---------------------------------------------------------------------------
// Public API.
// ---------------------------------------------------------------------------

/**
 * Assemble the full knowledge base from existing data files. Async because
 * the strategy memo is read off disk; everything else is in-memory data.
 *
 * Caller is responsible for caching if needed; the API route builds it
 * once per request, which is fine at this corpus size.
 */
export async function buildKnowledgeBase(): Promise<KbDoc[]> {
  const [strategyDocs] = await Promise.all([loadStrategyDocs()]);
  return [
    ...strategyDocs,
    ...buildExperimentDocs(),
    ...buildPlaybookDocs(),
    ...buildSourceDocs(),
    ...buildInterviewDocs(),
  ];
}

/**
 * Synchronous KB builder that skips the strategy memo. Useful in tests
 * where we do not want to read the filesystem and still need a non-empty
 * corpus to score against.
 */
export function buildKnowledgeBaseSync(): KbDoc[] {
  return [
    ...buildExperimentDocs(),
    ...buildPlaybookDocs(),
    ...buildSourceDocs(),
    ...buildInterviewDocs(),
  ];
}

/**
 * Score every doc against the query and return the top-K. Scoring is a
 * count of overlapping non-stopword tokens between the query and the
 * doc's title + body, with a small bonus for title hits because a hit
 * in a 5-word title is more diagnostic than the same hit buried in a
 * 1,000-word body.
 *
 * Empty queries return an empty array. Ties break by id for stability.
 */
export function searchKb(
  query: string,
  kb: KbDoc[],
  topK: number,
): KbDoc[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0 || kb.length === 0 || topK <= 0) return [];

  const scored = kb.map((doc) => {
    const titleTokens = tokenize(doc.title);
    const bodyTokens = tokenize(doc.body);
    let score = 0;
    for (const t of titleTokens) {
      if (qTokens.has(t)) score += 2;
    }
    for (const t of bodyTokens) {
      if (qTokens.has(t)) score += 1;
    }
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.doc.id.localeCompare(b.doc.id);
    })
    .slice(0, topK)
    .map((s) => s.doc);
}

/**
 * Build the prompt pair handed to the model. The system prompt is short
 * and load-bearing: it tells the model to ground every claim in the
 * retrieved docs and to cite by `surface`. The user prompt stitches the
 * query together with the doc bodies.
 */
export function buildRagPrompt(
  query: string,
  hits: KbDoc[],
): { system: string; user: string } {
  const system = [
    "You are answering questions about the Vero GTM demo.",
    "Ground every answer in the retrieved source docs below.",
    "Cite the source docs by their `surface` link in parentheses, like (/strategy).",
    "Stay specific. No filler. No em dashes. No marketing voice.",
    "If the docs do not contain the answer, say so plainly in one sentence.",
  ].join(" ");

  const context = hits.length
    ? hits
        .map(
          (h, i) =>
            `[${i + 1}] ${h.title} (surface: ${h.surface})\n${h.body}`,
        )
        .join("\n\n---\n\n")
    : "(no relevant docs were retrieved)";

  const user = [
    `Question: ${query.trim()}`,
    "",
    "Retrieved docs:",
    context,
    "",
    "Answer in 2 to 5 sentences. End with the citations in parentheses.",
  ].join("\n");

  return { system, user };
}
