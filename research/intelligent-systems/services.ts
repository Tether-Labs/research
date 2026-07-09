import type { OutcomeKind, ServiceProfile } from "./types.js";

/** Mulberry32 — small seeded PRNG for reproducible episodes. */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function effectiveRates(
  profile: ServiceProfile,
  step: number,
): { incorrectRate: number; latencyRate: number } {
  let incorrectRate = profile.incorrectRate;
  let latencyRate = profile.latencyRate;
  if (profile.degrade && step >= profile.degrade.afterStep) {
    incorrectRate = Math.min(1, incorrectRate * profile.degrade.factor);
    latencyRate = Math.min(1, latencyRate * profile.degrade.factor);
  }
  return { incorrectRate, latencyRate };
}

export function callService(
  profile: ServiceProfile,
  step: number,
  rng: () => number,
): OutcomeKind {
  const { incorrectRate, latencyRate } = effectiveRates(profile, step);
  const u = rng();
  if (u < incorrectRate) return "incorrect";
  if (u < incorrectRate + latencyRate) return "latency";
  return "success";
}

export const DEFAULT_SERVICES: ServiceProfile[] = [
  {
    id: "reliable",
    label: "Reliable service",
    incorrectRate: 0.05,
    latencyRate: 0.05,
    reputationBonus: 0.05,
  },
  {
    id: "degrading",
    label: "Degrading service (starts OK)",
    incorrectRate: 0.1,
    latencyRate: 0.1,
    degrade: { afterStep: 8, factor: 4 },
  },
  {
    id: "fast_wrong",
    label: "Fast but often wrong",
    incorrectRate: 0.45,
    latencyRate: 0.02,
  },
];
