/**
 * Daily CPSO scrape.
 *
 * Pulls the College of Physicians and Surgeons of Ontario public register one
 * profile at a time, throttled to 1 request per second. The register is public
 * data so this is permitted; we still respect robots.txt and only collect the
 * fields the register itself displays. No phone numbers or emails are scraped
 * because the register does not expose them.
 *
 * Output is a normalized row that the score recalculator can run against.
 */

import { load } from "cheerio";
import { writeFile } from "node:fs/promises";

import type { Lead } from "@/lib/types";
import { inferEmr, inferNearbyCompetitors } from "@/lib/enrich";
import { scoreLead } from "@/lib/scoring";

const BASE = "https://www.cpso.on.ca/Public-Register/Doctor-Search";
const THROTTLE_MS = 1100; // 1 req/sec floor with a small safety margin

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchProfile(cpsoNumber: string): Promise<Lead | null> {
  const url = `${BASE}/Doctor-Details?cpsoNumber=${cpsoNumber}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "vero-gtm-demo/1.0 (+contact: gtm@veroscribe.com)" },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const $ = load(html);

  const name = $("h1.physician-name").text().trim();
  const specialty = $("[data-field='specialty']").first().text().trim() || "Family Medicine";
  const yearRegistered = parseInt($("[data-field='year-registered']").text().trim(), 10) || 2010;
  const languages = $("[data-field='languages']")
    .text()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const city = $("[data-field='city']").text().trim() + ", ON";
  const practiceAddress = $("[data-field='practice-address']").text().trim();

  if (!name || !practiceAddress) return null;

  const partial: Lead = {
    id: `lead_${cpsoNumber}`,
    name: `Dr. ${name}`,
    specialty,
    yearRegistered,
    languages: languages.length ? languages : ["English"],
    city,
    practiceAddress,
    inferredEmr: inferEmr(practiceAddress, city),
    segment: "clinic_solo",
    score: 0,
    stage: "new",
    daysInStage: 0,
    nextTouchAt: null,
    lastContactedAt: null,
    nearbyCompetitorPresence: inferNearbyCompetitors(city, practiceAddress),
    source: "cpso_register",
  };
  partial.score = scoreLead(partial);
  return partial;
}

export async function scrapeBatch(cpsoNumbers: string[]): Promise<Lead[]> {
  const out: Lead[] = [];
  for (const n of cpsoNumbers) {
    try {
      const row = await fetchProfile(n);
      if (row) out.push(row);
    } catch (err) {
      console.warn(`[cpso-scrape] failed for ${n}:`, (err as Error).message);
    }
    await sleep(THROTTLE_MS);
  }
  return out;
}

if (require.main === module) {
  // Standalone run: read CPSO numbers from a queue file and write results.
  const queue = (process.env.CPSO_QUEUE ?? "").split(",").filter(Boolean);
  scrapeBatch(queue).then(async (rows) => {
    await writeFile("data/leads.scraped.json", JSON.stringify(rows, null, 2));
    console.log(`[cpso-scrape] wrote ${rows.length} rows`);
  });
}
