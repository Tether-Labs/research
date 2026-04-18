import "dotenv/config";

export type AppConfig = {
  port: number;
  apiKey: string;
  dashboardSecret: string;
  databaseUrl: string;
  slackBotToken: string;
  slackSigningSecret: string;
  slackApprovalChannel: string;
  internalDomains: string[];
  blockedDomains: string[];
  sensitiveKeywords: string[];
  crmDealThreshold: number;
  mockLatencyMs: number;
  mockFailureRate: number;
};

let _config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (_config) return _config;

  _config = {
    port: parseInt(process.env.PORT || "3001", 10),
    apiKey: process.env.GATEAI_API_KEY || "",
    dashboardSecret: process.env.DASHBOARD_SECRET || "",
    databaseUrl: process.env.DATABASE_URL || "",
    slackBotToken: process.env.SLACK_BOT_TOKEN || "",
    slackSigningSecret: process.env.SLACK_SIGNING_SECRET || "",
    slackApprovalChannel: process.env.SLACK_APPROVAL_CHANNEL || "gateai-approvals",
    internalDomains: (process.env.ORG_INTERNAL_DOMAINS || "").split(",").filter(Boolean),
    blockedDomains: (process.env.BLOCKED_DOMAINS || "").split(",").filter(Boolean),
    sensitiveKeywords: (process.env.SENSITIVE_KEYWORDS || "").split(",").filter(Boolean),
    crmDealThreshold: parseInt(process.env.CRM_DEAL_THRESHOLD || "10000", 10),
    mockLatencyMs: parseInt(process.env.MOCK_LATENCY_MS || "500", 10),
    mockFailureRate: parseFloat(process.env.MOCK_FAILURE_RATE || "0"),
  };

  return _config;
}

export function resetConfig(): void {
  _config = null;
}
