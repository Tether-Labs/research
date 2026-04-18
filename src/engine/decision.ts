import type { ActionType, ActionPayload, Decision } from "../lib/types.js";
import { getV1Rules, type Rule } from "./rules.js";

export type DecisionResult = {
  decision: Decision;
  reason: string;
  rule_id: string | null;
};

export function evaluate(actionType: ActionType, payload: ActionPayload): DecisionResult {
  const rules = getV1Rules();

  const applicable = rules
    .filter((r) => r.action_type === actionType)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of applicable) {
    if (rule.condition(payload)) {
      return {
        decision: rule.decision,
        reason: rule.reason,
        rule_id: rule.id,
      };
    }
  }

  return {
    decision: "allow",
    reason: "No rules triggered",
    rule_id: null,
  };
}
