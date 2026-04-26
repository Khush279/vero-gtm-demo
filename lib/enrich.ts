/**
 * Enrichment helpers. Right now this is heuristic-only: in production the same
 * function signatures would be backed by a Clearbit-style provider plus an
 * internal EMR signals warehouse. The interface stays the same; only the
 * implementation gets swapped.
 */

import type { EmrInferred, Lead } from "@/lib/types";

const TORONTO_CORE = ["Toronto"];

function hasAny(haystack: string, needles: string[]): boolean {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

export function inferEmr(practiceAddress: string, city: string): EmrInferred {
  const a = practiceAddress.toLowerCase();

  if (hasAny(a, ["telus", "ps suite", "med access"])) {
    return a.includes("med access") ? "telus_med_access" : "telus_pss";
  }

  if (hasAny(a, ["family health team", "fht", "health network", "ontario health team"])) {
    return "telus_pss";
  }

  if (hasAny(a, ["medical centre", "medical center", "medical group", "wellness centre"])) {
    return "accuro";
  }

  if (
    hasAny(a, ["hospital", "uhn", "sunnybrook", "mount sinai", "trillium", "william osler"]) ||
    a.includes("academic")
  ) {
    return "epic";
  }

  if (hasAny(a, ["regional health", "lhin", "system"])) {
    return "cerner";
  }

  if (hasAny(a, ["walk-in", "well health"])) {
    return "input_health";
  }

  // Downtown Toronto small clinics skew OSCAR (community-EMR friendly).
  if (TORONTO_CORE.some((c) => city.includes(c)) && (a.includes("clinic") || a.includes("suite"))) {
    return "oscar";
  }

  return "unknown";
}

/**
 * Stable-ish nearby-competitor estimator from city + practice address. Pure
 * function so it can be re-run on a snapshot without diff-noise.
 */
export function inferNearbyCompetitors(city: string, practiceAddress: string): number {
  const seedSrc = `${city}|${practiceAddress}`;
  let h = 0;
  for (let i = 0; i < seedSrc.length; i += 1) {
    h = (h * 31 + seedSrc.charCodeAt(i)) >>> 0;
  }
  const torontoBoost = city.includes("Toronto") ? 1 : 0;
  const ottawaBoost = city.includes("Ottawa") ? 1 : 0;
  // Base 0–2, plus boosts, clamped to 0–4.
  const base = h % 3;
  return Math.min(4, base + torontoBoost + ottawaBoost);
}

/**
 * Fills in inferredEmr / nearbyCompetitorPresence if they're missing or zero.
 * Idempotent: passing an already-enriched Lead returns it unchanged.
 */
export function enrichLead(lead: Lead): Lead {
  const next: Lead = { ...lead };
  if (!next.inferredEmr || next.inferredEmr === "unknown") {
    next.inferredEmr = inferEmr(next.practiceAddress, next.city);
  }
  if (next.nearbyCompetitorPresence == null) {
    next.nearbyCompetitorPresence = inferNearbyCompetitors(next.city, next.practiceAddress);
  }
  return next;
}
