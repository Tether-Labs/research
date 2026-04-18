import type { ActionType, ActionPayload, Decision, EmailPayload, CrmPayload } from "../lib/types.js";
import { containsSensitiveKeywords, isExternalEmail, isBlockedDomain } from "../lib/keywords.js";
import { getConfig } from "../config.js";

export type Rule = {
  id: string;
  name: string;
  priority: number;
  action_type: ActionType;
  condition: (payload: ActionPayload) => boolean;
  decision: Exclude<Decision, "allow">;
  reason: string;
};

function isEmailPayload(payload: ActionPayload): payload is EmailPayload {
  return "to" in payload && "body" in payload;
}

function isCrmPayload(payload: ActionPayload): payload is CrmPayload {
  return "object_type" in payload && "field" in payload;
}

export function getV1Rules(): Rule[] {
  const config = getConfig();

  return [
    {
      id: "rule_email_blocked_domain",
      name: "Blocked email domain",
      priority: 100,
      action_type: "send_email",
      condition: (payload) => {
        if (!isEmailPayload(payload)) return false;
        return isBlockedDomain(payload.to, config.blockedDomains);
      },
      decision: "block",
      reason: "Recipient domain is blacklisted",
    },
    {
      id: "rule_email_sensitive_keywords",
      name: "Sensitive keywords in email",
      priority: 90,
      action_type: "send_email",
      condition: (payload) => {
        if (!isEmailPayload(payload)) return false;
        const bodyCheck = containsSensitiveKeywords(payload.body);
        const subjectCheck = containsSensitiveKeywords(payload.subject);
        return bodyCheck.match || subjectCheck.match;
      },
      decision: "require_approval",
      reason: "Email contains sensitive keywords",
    },
    {
      id: "rule_email_external_attachment",
      name: "External email with attachment",
      priority: 80,
      action_type: "send_email",
      condition: (payload) => {
        if (!isEmailPayload(payload)) return false;
        const attachments = payload.attachments ?? [];
        return (
          isExternalEmail(payload.to, config.internalDomains) &&
          attachments.length > 0
        );
      },
      decision: "require_approval",
      reason: "External email with attachment",
    },
    {
      id: "rule_crm_deal_threshold",
      name: "Large CRM deal value change",
      priority: 70,
      action_type: "update_crm",
      condition: (payload) => {
        if (!isCrmPayload(payload)) return false;
        if (payload.field !== "amount") return false;
        const oldVal = typeof payload.old_value === "number" ? payload.old_value : parseFloat(payload.old_value);
        const newVal = typeof payload.new_value === "number" ? payload.new_value : parseFloat(payload.new_value);
        if (isNaN(oldVal) || isNaN(newVal)) return false;
        return Math.abs(newVal - oldVal) > config.crmDealThreshold;
      },
      decision: "require_approval",
      reason: "Deal value change exceeds threshold",
    },
    {
      id: "rule_crm_closed_won",
      name: "CRM stage changed to Closed Won",
      priority: 60,
      action_type: "update_crm",
      condition: (payload) => {
        if (!isCrmPayload(payload)) return false;
        if (payload.field !== "stage") return false;
        const newVal = typeof payload.new_value === "string" ? payload.new_value : String(payload.new_value);
        return newVal.toLowerCase() === "closed_won" || newVal.toLowerCase() === "closed won";
      },
      decision: "require_approval",
      reason: "Deal stage changed to Closed Won",
    },
  ];
}
