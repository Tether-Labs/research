import { getConfig } from "../config.js";

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function containsSensitiveKeywords(text: string): { match: boolean; keyword?: string } {
  const config = getConfig();
  const normalized = normalizeText(text);

  for (const keyword of config.sensitiveKeywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalized.includes(normalizedKeyword)) {
      return { match: true, keyword };
    }
  }

  return { match: false };
}

export function isExternalEmail(email: string, internalDomains: string[]): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return true;
  return !internalDomains.some((d) => domain === d.toLowerCase());
}

export function isBlockedDomain(email: string, blockedDomains: string[]): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return blockedDomains.some((d) => domain === d.toLowerCase());
}
