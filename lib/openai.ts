/**
 * Tiny wrapper around the OpenAI client so callers don't have to think about
 * key presence. If the key is missing, `openai` is null and `aiConfigured()`
 * returns false. The draft route uses these to decide between live generation
 * and a cached/mocked sequence.
 */

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai: OpenAI | null = apiKey ? new OpenAI({ apiKey }) : null;

export function aiConfigured(): boolean {
  return Boolean(apiKey);
}

/** Default model. gpt-4o-mini is the cost/latency sweet spot for short copy. */
export const DRAFT_MODEL = "gpt-4o-mini";
