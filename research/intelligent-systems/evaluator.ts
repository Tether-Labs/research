import type { OutcomeKind } from "./types.js";

/**
 * Evaluator: maps raw outcomes to trust-update signals.
 * v0 is identity — kept as a seam for richer scoring later.
 */
export function evaluateOutcome(outcome: OutcomeKind): OutcomeKind {
  return outcome;
}
