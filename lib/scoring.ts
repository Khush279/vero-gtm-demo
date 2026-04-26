/**
 * Pure ICP scoring for Ontario family-physician outbound.
 *
 * Score = specialty_weight
 *       × city_tier_weight
 *       × experience_band_weight
 *       × segment_weight
 *       × competitor_pressure_weight
 *       × 100 (rounded to int).
 *
 * Higher score = better fit for Vero's wedge motion (Ontario FPs / IM,
 * mid-career, mid-density market, low local competitor saturation).
 */

import type { Lead, Segment } from "@/lib/types";

const SPECIALTY_WEIGHT: { match: RegExp; w: number }[] = [
  { match: /family/i, w: 1.0 },
  { match: /general practice/i, w: 1.0 },
  { match: /internal medicine/i, w: 1.0 },
  { match: /psychiatr/i, w: 0.7 },
  { match: /paediatric|pediatric/i, w: 0.6 },
];

const T1_CITIES = ["Toronto", "Ottawa", "Mississauga"];
const T2_CITIES = [
  "Hamilton",
  "London",
  "Brampton",
  "Markham",
  "Kitchener",
  "Waterloo",
  "Windsor",
];

function specialtyWeight(specialty: string): number {
  for (const { match, w } of SPECIALTY_WEIGHT) {
    if (match.test(specialty)) return w;
  }
  return 0.4;
}

function cityTierWeight(city: string): number {
  if (T1_CITIES.some((c) => city.includes(c))) return 1.0;
  if (T2_CITIES.some((c) => city.includes(c))) return 0.8;
  return 0.7;
}

function experienceBandWeight(yearsRegistered: number, refYear = 2026): number {
  const years = Math.max(0, refYear - yearsRegistered);
  if (years < 5) return 0.5;
  if (years <= 15) return 1.0;
  if (years <= 25) return 0.85;
  return 0.6;
}

function segmentWeight(segment: Segment): number {
  switch (segment) {
    case "clinic_solo":
      return 1.0;
    case "clinic_group":
      return 0.85;
    case "specialty":
      return 0.7;
    case "enterprise":
      return 0.5;
  }
}

function competitorPressureWeight(nearby: number): number {
  if (nearby <= 0) return 1.0;
  if (nearby === 1) return 0.9;
  if (nearby === 2) return 0.75;
  return 0.6;
}

export function scoreLead(lead: Lead): number {
  const raw =
    specialtyWeight(lead.specialty) *
    cityTierWeight(lead.city) *
    experienceBandWeight(lead.yearRegistered) *
    segmentWeight(lead.segment) *
    competitorPressureWeight(lead.nearbyCompetitorPresence) *
    100;
  return Math.round(raw);
}
