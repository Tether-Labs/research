/**
 * Intelligent Systems Simulator v0 — shared types.
 * See SIM-v0-SPEC.md.
 */

export type OutcomeKind = "success" | "incorrect" | "latency";

export type ServiceId = string;

export interface ServiceProfile {
  id: ServiceId;
  label: string;
  /** Probability of incorrect answer (0–1). */
  incorrectRate: number;
  /** Probability of slow-but-correct when not incorrect (0–1). */
  latencyRate: number;
  /** Optional static reputation bonus (hypothesis #3 stub). */
  reputationBonus?: number;
  /**
   * Optional degradation schedule: after `afterStep`, multiply incorrectRate
   * and latencyRate by `factor` (capped at 1).
   */
  degrade?: { afterStep: number; factor: number };
}

export interface TrustConfig {
  initialTrust: number;
  switchThreshold: number;
  successDelta: number;
  incorrectPenalty: number;
  latencyPenalty: number;
  /** Clamp trust to [min, max]. */
  minTrust: number;
  maxTrust: number;
}

export interface CallRecord {
  step: number;
  serviceId: ServiceId;
  outcome: OutcomeKind;
  trustBefore: number;
  trustAfter: number;
  switched: boolean;
}

export interface EpisodeConfig {
  steps: number;
  seed: number;
  primaryServiceId: ServiceId;
  services: ServiceProfile[];
  trust: TrustConfig;
}

export interface EpisodeResult {
  config: Omit<EpisodeConfig, "services"> & {
    services: Array<Pick<ServiceProfile, "id" | "label">>;
  };
  calls: CallRecord[];
  timeToFirstSwitch: number | null;
  switchesPerEpisode: number;
  residualBadServiceUse: number;
  finalTrustByService: Record<ServiceId, number>;
}

export interface BatchResult {
  runId: string;
  createdAt: string;
  episodes: EpisodeResult[];
  summary: {
    episodeCount: number;
    meanTimeToFirstSwitch: number | null;
    switchRate: number;
    meanSwitchesPerEpisode: number;
    meanResidualBadServiceUse: number;
  };
}

export const DEFAULT_TRUST_CONFIG: TrustConfig = {
  initialTrust: 0.8,
  switchThreshold: 0.4,
  successDelta: 0.05,
  incorrectPenalty: 0.2,
  latencyPenalty: 0.08,
  minTrust: 0,
  maxTrust: 1,
};
