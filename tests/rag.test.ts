import { describe, expect, it } from "vitest";

import {
  buildKnowledgeBaseSync,
  buildRagPrompt,
  searchKb,
  type KbDoc,
} from "@/lib/rag";

/**
 * Tests for the tiny RAG module. The real /chat route uses the async
 * builder which reads /data/strategy.md from disk; we use the sync builder
 * here to keep these tests filesystem-free and deterministic.
 */

describe("buildKnowledgeBaseSync", () => {
  it("returns a non-empty corpus assembled from existing data files", () => {
    const kb = buildKnowledgeBaseSync();
    expect(kb.length).toBeGreaterThan(0);
  });

  it("gives every doc a stable id, title, surface, and body", () => {
    const kb = buildKnowledgeBaseSync();
    for (const doc of kb) {
      expect(typeof doc.id).toBe("string");
      expect(doc.id.length).toBeGreaterThan(0);
      expect(typeof doc.title).toBe("string");
      expect(doc.title.length).toBeGreaterThan(0);
      expect(doc.surface.startsWith("/")).toBe(true);
      expect(typeof doc.body).toBe("string");
      expect(doc.body.length).toBeGreaterThan(0);
    }
  });

  it("yields unique ids across the assembled corpus", () => {
    const kb = buildKnowledgeBaseSync();
    const ids = new Set(kb.map((d) => d.id));
    expect(ids.size).toBe(kb.length);
  });
});

describe("searchKb — empty / edge inputs", () => {
  const kb = buildKnowledgeBaseSync();

  it("returns an empty array for an empty query", () => {
    expect(searchKb("", kb, 5)).toEqual([]);
  });

  it("returns an empty array for a whitespace-only query", () => {
    expect(searchKb("   ", kb, 5)).toEqual([]);
  });

  it("returns an empty array when no docs match", () => {
    // A token that does not appear in any doc body or title.
    const out = searchKb("zzqqxxhhfooblahnopezz", kb, 5);
    expect(out).toEqual([]);
  });

  it("returns an empty array when topK is 0", () => {
    const out = searchKb("playbook", kb, 0);
    expect(out).toEqual([]);
  });

  it("returns an empty array when topK is negative", () => {
    const out = searchKb("playbook", kb, -3);
    expect(out).toEqual([]);
  });

  it("returns an empty array against an empty kb", () => {
    expect(searchKb("anything", [], 5)).toEqual([]);
  });
});

describe("searchKb — ranking and topK", () => {
  const kb = buildKnowledgeBaseSync();

  it("respects the topK ceiling on the result length", () => {
    const out = searchKb("playbook outbound seo", kb, 3);
    expect(out.length).toBeLessThanOrEqual(3);
  });

  it("ranks Tali-mentioning docs first when the query is 'tali'", () => {
    const out = searchKb("tali", kb, 5);
    expect(out.length).toBeGreaterThan(0);
    // Every returned hit should mention 'tali' in title or body.
    for (const doc of out) {
      const haystack = `${doc.title} ${doc.body}`.toLowerCase();
      expect(haystack.includes("tali")).toBe(true);
    }
  });

  it("weights title hits higher than body-only hits", () => {
    // Two synthetic docs: one has the query in the title, one only in the body.
    const titleDoc: KbDoc = {
      id: "z_title_doc",
      title: "marigold report",
      surface: "/x",
      body: "an unrelated body string",
      tags: [],
    };
    const bodyDoc: KbDoc = {
      id: "a_body_doc",
      title: "an unrelated title string",
      surface: "/y",
      // One body hit (+1) vs title doc's one title hit (+2). Title wins.
      body: "marigold",
      tags: [],
    };
    const out = searchKb("marigold", [titleDoc, bodyDoc], 2);
    expect(out[0].id).toBe("z_title_doc");
    expect(out[1].id).toBe("a_body_doc");
  });

  it("breaks score ties by id alphabetically (deterministic order)", () => {
    const make = (id: string): KbDoc => ({
      id,
      title: "marigold",
      surface: "/x",
      body: "irrelevant",
      tags: [],
    });
    const docs = [make("zeta"), make("alpha"), make("mike")];
    const out = searchKb("marigold", docs, 3);
    expect(out.map((d) => d.id)).toEqual(["alpha", "mike", "zeta"]);
  });

  it("returns the same results for the same query (deterministic)", () => {
    const a = searchKb("playbook outbound", kb, 4).map((d) => d.id);
    const b = searchKb("playbook outbound", kb, 4).map((d) => d.id);
    expect(a).toEqual(b);
  });

  it("ignores stopwords like 'the' and 'is' when computing matches", () => {
    // A query of pure stopwords should return nothing.
    const out = searchKb("the and is of to", kb, 5);
    expect(out).toEqual([]);
  });
});

describe("buildRagPrompt", () => {
  const kb = buildKnowledgeBaseSync();
  const sampleHits = kb.slice(0, 2);

  it("produces a system prompt that mentions the citation directive", () => {
    const { system } = buildRagPrompt("anything", sampleHits);
    expect(system.toLowerCase()).toContain("cite");
    expect(system).toContain("surface");
  });

  it("includes the user's query verbatim in the user prompt", () => {
    const query = "What is Vero's wedge versus Tali in Ontario?";
    const { user } = buildRagPrompt(query, sampleHits);
    expect(user).toContain(query);
  });

  it("includes each retrieved doc's body inside the user prompt", () => {
    const { user } = buildRagPrompt("any q", sampleHits);
    for (const hit of sampleHits) {
      expect(user).toContain(hit.body);
    }
  });

  it("numbers retrieved docs and tags each with its surface link", () => {
    const { user } = buildRagPrompt("any q", sampleHits);
    expect(user).toContain("[1]");
    expect(user).toContain("[2]");
    expect(user).toContain(`surface: ${sampleHits[0].surface}`);
  });

  it("trims whitespace from the query before embedding it", () => {
    const { user } = buildRagPrompt("   padded query   ", []);
    expect(user).toContain("Question: padded query");
    expect(user).not.toContain("Question:    padded");
  });

  it("keeps the 'say so plainly' instruction even when no docs were retrieved", () => {
    const { system, user } = buildRagPrompt("orphan question", []);
    expect(system.toLowerCase()).toContain("say so plainly");
    // And the user prompt should signal the empty retrieval state.
    expect(user).toContain("(no relevant docs were retrieved)");
  });
});
