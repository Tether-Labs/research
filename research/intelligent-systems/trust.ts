import type { OutcomeKind, ServiceId, TrustConfig } from "./types.js";

export class TrustState {
  private scores: Map<ServiceId, number>;
  private readonly config: TrustConfig;

  constructor(serviceIds: ServiceId[], config: TrustConfig) {
    this.config = config;
    this.scores = new Map(
      serviceIds.map((id) => [id, config.initialTrust]),
    );
  }

  get(serviceId: ServiceId): number {
    const v = this.scores.get(serviceId);
    if (v === undefined) {
      throw new Error(`Unknown service: ${serviceId}`);
    }
    return v;
  }

  /** Apply reputation bonus for selection only (does not mutate stored trust). */
  effectiveTrust(serviceId: ServiceId, reputationBonus = 0): number {
    return this.clamp(this.get(serviceId) + reputationBonus);
  }

  update(serviceId: ServiceId, outcome: OutcomeKind): number {
    const before = this.get(serviceId);
    let next = before;
    switch (outcome) {
      case "success":
        next = before + this.config.successDelta;
        break;
      case "incorrect":
        next = before - this.config.incorrectPenalty;
        break;
      case "latency":
        next = before - this.config.latencyPenalty;
        break;
    }
    next = this.clamp(next);
    this.scores.set(serviceId, next);
    return next;
  }

  snapshot(): Record<ServiceId, number> {
    return Object.fromEntries(this.scores.entries());
  }

  private clamp(n: number): number {
    return Math.min(this.config.maxTrust, Math.max(this.config.minTrust, n));
  }
}
