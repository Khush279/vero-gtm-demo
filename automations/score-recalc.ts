/**
 * ICP score recalculator.
 *
 * Pure, deterministic, idempotent. Reads data/leads.json, runs scoreLead() over
 * every row, and writes back only if anything changed. Emits a small audit log
 * for any score that moved more than 5 points so we can spot scoring drift.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { scoreLead } from "@/lib/scoring";
import type { Lead } from "@/lib/types";

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");

export async function recalcScores(): Promise<{ changed: number; bigDeltas: number }> {
  const raw = await readFile(LEADS_PATH, "utf8");
  const leads = JSON.parse(raw) as Lead[];
  let changed = 0;
  let bigDeltas = 0;
  for (const lead of leads) {
    const before = lead.score;
    const after = scoreLead(lead);
    if (after !== before) {
      lead.score = after;
      changed += 1;
      if (Math.abs(after - before) > 5) {
        console.log(`[score-recalc] ${lead.id} ${before} -> ${after}`);
        bigDeltas += 1;
      }
    }
  }
  if (changed > 0) {
    await writeFile(LEADS_PATH, JSON.stringify(leads, null, 2));
  }
  return { changed, bigDeltas };
}

if (require.main === module) {
  recalcScores().then(({ changed, bigDeltas }) => {
    console.log(`[score-recalc] ${changed} updated, ${bigDeltas} > 5pt deltas`);
  });
}
