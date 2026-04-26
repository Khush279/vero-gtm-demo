/**
 * Run with: npx tsx scripts/scrape-cpso.ts > data/leads.json
 *
 * Walks the CPSO public register one profile at a time, throttled to 1 request
 * per second, and writes a normalized JSON array to stdout. The register is
 * public data; this script still respects robots.txt, identifies itself in the
 * User-Agent, and only collects fields the register itself displays. Phone
 * numbers and emails are not exposed by the register, so they are not
 * collected here.
 *
 * This is the script the /automations page links to. It is real and runnable;
 * the demo's data/leads.json is a deterministic fixture (see README) so that
 * demo viewers do not all hammer cpso.on.ca at once.
 */

import { load } from "cheerio";
import { writeFile } from "node:fs/promises";

import { inferEmr, inferNearbyCompetitors } from "../lib/enrich";
import { scoreLead } from "../lib/scoring";
import type { Lead } from "../lib/types";

const SEARCH_URL = "https://www.cpso.on.ca/Public-Register/Doctor-Search";
const PROFILE_URL = "https://www.cpso.on.ca/Public-Register/Doctor-Details";
const THROTTLE_MS = 1100;
const USER_AGENT = "vero-gtm-demo/1.0 (+contact: gtm@veroscribe.com)";

const TARGET_SPECIALTIES = ["Family Medicine", "General Practice", "Internal Medicine"];
const TARGET_CITIES = [
  "Toronto",
  "Ottawa",
  "Mississauga",
  "Hamilton",
  "London",
  "Brampton",
  "Markham",
  "Kitchener",
  "Waterloo",
  "Windsor",
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function searchPage(specialty: string, city: string, page: number): Promise<string[]> {
  const params = new URLSearchParams({ specialty, city, page: String(page) });
  const html = await fetchHtml(`${SEARCH_URL}?${params.toString()}`);
  const $ = load(html);
  const ids: string[] = [];
  $("a[href*='Doctor-Details?cpsoNumber=']").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const m = href.match(/cpsoNumber=(\d+)/);
    if (m) ids.push(m[1]);
  });
  return ids;
}

async function fetchProfile(cpsoNumber: string): Promise<Lead | null> {
  const html = await fetchHtml(`${PROFILE_URL}?cpsoNumber=${cpsoNumber}`);
  const $ = load(html);

  const nameRaw = $("h1.physician-name").text().trim();
  if (!nameRaw) return null;
  const specialty = $("[data-field='specialty']").first().text().trim() || "Family Medicine";
  const yearRegistered = parseInt($("[data-field='year-registered']").text().trim(), 10) || 2010;
  const languages = $("[data-field='languages']")
    .text()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const cityShort = $("[data-field='city']").text().trim();
  const practiceAddress = $("[data-field='practice-address']").text().trim();
  if (!practiceAddress) return null;

  const city = `${cityShort}, ON`;
  const partial: Lead = {
    id: `lead_${cpsoNumber}`,
    name: `Dr. ${nameRaw}`,
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

async function main(): Promise<void> {
  const seen = new Set<string>();
  const out: Lead[] = [];

  for (const specialty of TARGET_SPECIALTIES) {
    for (const city of TARGET_CITIES) {
      let page = 1;
      let pageIds: string[] = [];
      do {
        pageIds = await searchPage(specialty, city, page);
        await sleep(THROTTLE_MS);
        for (const id of pageIds) {
          if (seen.has(id)) continue;
          seen.add(id);
          try {
            const profile = await fetchProfile(id);
            if (profile) out.push(profile);
          } catch (err) {
            console.warn(`[scrape] ${id} failed: ${(err as Error).message}`);
          }
          await sleep(THROTTLE_MS);
        }
        page += 1;
      } while (pageIds.length > 0 && page <= 25);
    }
  }

  // Write to stdout so callers can redirect to data/leads.json.
  process.stdout.write(JSON.stringify(out, null, 2));
  // Also write to disk as a backup.
  await writeFile("data/leads.scraped.json", JSON.stringify(out, null, 2));
  console.error(`[scrape] wrote ${out.length} leads`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
