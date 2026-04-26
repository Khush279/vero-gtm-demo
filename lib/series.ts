/**
 * Tiny deterministic series helpers for inline sparklines.
 *
 * The dashboard surfaces only printed values (e.g. "$11,520", "5.9%", "8m").
 * To draw a 4-week trend we need to (a) parse those strings back into raw
 * numbers and (b) generate a plausible interpolated path from a starting
 * value to the current value. The path is fake-but-stable: a Mulberry32 PRNG
 * seeded with the metric label, so every render produces the same wiggle.
 *
 * Pure, no React, no DOM. Server-safe.
 */

/**
 * Mulberry32 — 32-bit seeded PRNG. Tiny, fast, deterministic. Good enough
 * for visual jitter; not for anything cryptographic.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash an arbitrary string into a 32-bit integer seed. djb2-style. Stable
 * across runtimes so a metric label always yields the same trend shape.
 */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

/**
 * Generate an N-point series that starts near `start`, ends near `end`, and
 * wiggles around the linear interpolation between them. The endpoints are
 * pinned exactly so the last sparkline dot always lands on the printed
 * number. Noise scale defaults to 5% of the |start - end| span (with a
 * floor so flat series still get a tiny shape).
 *
 * Determinism: with no seed, the PRNG is seeded from the rounded start/end
 * so identical inputs reproduce identical outputs.
 */
export function generateTrend(
  start: number,
  end: number,
  points: number,
  noise: number = 0.05,
  seed?: string | number,
): number[] {
  if (points <= 0) return [];
  if (points === 1) return [end];

  const seedNum =
    typeof seed === "string"
      ? hashString(seed)
      : typeof seed === "number"
        ? seed >>> 0
        : hashString(`${Math.round(start * 1000)}:${Math.round(end * 1000)}:${points}`);

  const rand = mulberry32(seedNum);
  const span = Math.abs(end - start);
  const baseAmplitude = span > 0 ? span * noise : Math.max(Math.abs(end), 1) * 0.02;

  const out: number[] = new Array(points);
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const linear = start + (end - start) * t;
    if (i === 0) {
      out[i] = start;
    } else if (i === points - 1) {
      out[i] = end;
    } else {
      // Centered jitter in [-amp, +amp]
      const jitter = (rand() - 0.5) * 2 * baseAmplitude;
      out[i] = linear + jitter;
    }
  }
  return out;
}

/**
 * Pull the leading numeric portion out of a printed metric value. Handles:
 *   "$11,520"  → 11520
 *   "5.9%"     → 5.9
 *   "8m"       → 8
 *   "1,040"    → 1040
 *   "−2pt"     → -2
 * Returns null when the string contains no parseable number.
 */
export function parseMetricValue(value: string): number | null {
  if (typeof value !== "string") return null;
  // Normalize unicode minus to ASCII so the regex picks it up as a sign.
  const normalized = value.replace(/[−–—]/g, "-");
  const cleaned = normalized.replace(/[$,]/g, "");
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}
