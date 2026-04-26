/**
 * Crude token estimator + cost math for the /prompt-debugger surface.
 *
 * The chars / 4 heuristic is OpenAI's own back-of-envelope rule for English
 * text. It's wrong by ~10% on either side for code-like content but it's
 * deterministic, dependency-free, and good enough for "is this prompt about
 * to blow our context window" debugging on the demo.
 *
 * Whitespace coalescing (collapsing runs of spaces / newlines to a single
 * space before counting) keeps multi-line prompts from getting double-billed
 * for indentation that the tokenizer would merge anyway.
 */

export type SupportedModel = "gpt-4o-mini" | "gpt-4o" | "gpt-4-turbo";

type Pricing = {
  /** USD per 1M input tokens. */
  input: number;
  /** USD per 1M output tokens. */
  output: number;
};

export const MODEL_PRICING: Record<SupportedModel, Pricing> = {
  // Source: openai.com/api/pricing as of 2026-04. Numbers match the page's
  // header copy so the cost line stays trustworthy under "view source".
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4-turbo": { input: 10, output: 30 },
};

/**
 * Estimate token count for `text` using the chars / 4 rule with whitespace
 * coalescing. Returns 0 for empty / whitespace-only input.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length === 0) return 0;
  return Math.ceil(collapsed.length / 4);
}

/**
 * Estimate USD cost for an input + output token pair under one of the
 * supported model price sheets. Defaults to gpt-4o-mini, the model the demo
 * actually calls in /api/draft.
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: SupportedModel = "gpt-4o-mini",
): number {
  const pricing = MODEL_PRICING[model];
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

/**
 * Format a USD cost as a string with sensible precision for tiny numbers.
 * 0.00012 -> "$0.000120", 0.4 -> "$0.4000", etc. Used by the debugger UI;
 * lifted out of the component so it's unit-testable.
 */
export function formatCost(usd: number): string {
  if (usd === 0) return "$0";
  if (usd < 0.001) return `$${usd.toFixed(6)}`;
  if (usd < 1) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}
