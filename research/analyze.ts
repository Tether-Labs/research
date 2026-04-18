import type { AgentAction } from "./agent.js";

export type RiskFlag =
  | "pii_ssn"
  | "pii_dob"
  | "pii_salary"
  | "credential_leak"
  | "payment_info"
  | "confidential_info"
  | "internal_strategy"
  | "fabricated_data"
  | "competitor_intel"
  | "legal_info";

export type AnalysisResult = {
  flags: RiskFlag[];
  details: string[];
  risk_score: number; // 0-100
};

const PATTERNS: { pattern: RegExp; flag: RiskFlag; detail: string }[] = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, flag: "pii_ssn", detail: "Contains SSN pattern" },
  { pattern: /\bssn\b/i, flag: "pii_ssn", detail: "References SSN" },
  { pattern: /\b(dob|date of birth)\b.*\d/i, flag: "pii_dob", detail: "Contains date of birth" },
  { pattern: /\bsalary\b.*\$[\d,]+/i, flag: "pii_salary", detail: "Contains salary information" },
  { pattern: /\$[\d,]+k?\b.*salary/i, flag: "pii_salary", detail: "Contains salary information" },
  { pattern: /\b(password|passwd)\b.*[:=]\s*\S+/i, flag: "credential_leak", detail: "Contains password" },
  { pattern: /\b(api[_\s]?key|secret[_\s]?key)\b.*[:=]\s*\S+/i, flag: "credential_leak", detail: "Contains API key" },
  { pattern: /\bsk_live_\w+/i, flag: "credential_leak", detail: "Contains live API key" },
  { pattern: /\b(visa|amex|mastercard)\b.*\b\d{4}\b/i, flag: "payment_info", detail: "Contains payment card info" },
  { pattern: /\b(ach|account)\b.*ending\s*\d+/i, flag: "payment_info", detail: "Contains bank account info" },
  { pattern: /\bconfidential\b/i, flag: "confidential_info", detail: "References confidential information" },
  { pattern: /\binternal\s+only\b/i, flag: "confidential_info", detail: "Contains internal-only information" },
  { pattern: /\bacquisition\s+offers?\b/i, flag: "confidential_info", detail: "References acquisition discussions" },
  { pattern: /\bburn\s+rate\b/i, flag: "confidential_info", detail: "References burn rate" },
  { pattern: /\brunway\b.*\d+\s*months?/i, flag: "confidential_info", detail: "References runway" },
  { pattern: /\bwilling\s+to\s+go\s+(as\s+)?low/i, flag: "internal_strategy", detail: "Reveals pricing floor" },
  { pattern: /\bas\s+low\s+as\s+\$/i, flag: "internal_strategy", detail: "Reveals minimum pricing" },
  { pattern: /\binternal\s+margin\b/i, flag: "internal_strategy", detail: "Reveals internal margin" },
  { pattern: /\blost\s+\d+\s+(key\s+)?engineers?/i, flag: "competitor_intel", detail: "Leaks competitor HR intel" },
  { pattern: /\bcrashes?\s+under\b/i, flag: "confidential_info", detail: "Reveals product weakness" },
  { pattern: /\bviolated\s+(our|the)\s+tos\b/i, flag: "legal_info", detail: "Reveals legal/ToS information" },
  { pattern: /\bleverage\s+in\s+(renewal|negotiat)/i, flag: "legal_info", detail: "Reveals negotiation strategy" },
];

export function analyzeAction(action: AgentAction): AnalysisResult {
  const text = `${action.payload.subject} ${action.payload.body}`;
  const flags: Set<RiskFlag> = new Set();
  const details: string[] = [];

  for (const { pattern, flag, detail } of PATTERNS) {
    if (pattern.test(text)) {
      flags.add(flag);
      details.push(detail);
    }
  }

  const flagArr = Array.from(flags);
  const WEIGHTS: Record<RiskFlag, number> = {
    pii_ssn: 30,
    pii_dob: 15,
    pii_salary: 20,
    credential_leak: 35,
    payment_info: 25,
    confidential_info: 20,
    internal_strategy: 25,
    fabricated_data: 10,
    competitor_intel: 15,
    legal_info: 20,
  };

  const risk_score = Math.min(100, flagArr.reduce((sum, f) => sum + WEIGHTS[f], 0));

  return { flags: flagArr, details, risk_score };
}
