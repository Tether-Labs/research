import { evaluateOutcome } from "./evaluator.js";
import { callService, createRng } from "./services.js";
import { TrustState } from "./trust.js";
import type {
  CallRecord,
  EpisodeConfig,
  EpisodeResult,
  ServiceId,
  ServiceProfile,
} from "./types.js";

function pickService(
  current: ServiceId,
  trust: TrustState,
  services: ServiceProfile[],
  switchThreshold: number,
): { serviceId: ServiceId; switched: boolean } {
  const currentProfile = services.find((s) => s.id === current);
  if (!currentProfile) {
    throw new Error(`Current service missing: ${current}`);
  }

  const currentEffective = trust.effectiveTrust(
    current,
    currentProfile.reputationBonus ?? 0,
  );

  if (currentEffective >= switchThreshold) {
    return { serviceId: current, switched: false };
  }

  let bestId = current;
  let bestScore = currentEffective;
  for (const s of services) {
    const score = trust.effectiveTrust(s.id, s.reputationBonus ?? 0);
    if (score > bestScore) {
      bestScore = score;
      bestId = s.id;
    }
  }

  return { serviceId: bestId, switched: bestId !== current };
}

export function runEpisode(config: EpisodeConfig): EpisodeResult {
  const rng = createRng(config.seed);
  const trust = new TrustState(
    config.services.map((s) => s.id),
    config.trust,
  );

  let current = config.primaryServiceId;
  const calls: CallRecord[] = [];
  let switchesPerEpisode = 0;
  let timeToFirstSwitch: number | null = null;

  for (let step = 0; step < config.steps; step++) {
    const { serviceId, switched } = pickService(
      current,
      trust,
      config.services,
      config.trust.switchThreshold,
    );
    if (switched) {
      switchesPerEpisode += 1;
      if (timeToFirstSwitch === null) timeToFirstSwitch = step;
      current = serviceId;
    }

    const profile = config.services.find((s) => s.id === serviceId);
    if (!profile) throw new Error(`Service not found: ${serviceId}`);

    const trustBefore = trust.get(serviceId);
    const raw = callService(profile, step, rng);
    const outcome = evaluateOutcome(raw);
    const trustAfter = trust.update(serviceId, outcome);

    calls.push({
      step,
      serviceId,
      outcome,
      trustBefore,
      trustAfter,
      switched,
    });
  }

  const threshold = config.trust.switchThreshold;
  let residualNumer = 0;
  let residualDenom = 0;
  if (timeToFirstSwitch !== null) {
    for (const c of calls) {
      if (c.step < timeToFirstSwitch) continue;
      residualDenom += 1;
      if (c.trustBefore < threshold) residualNumer += 1;
    }
  }

  return {
    config: {
      steps: config.steps,
      seed: config.seed,
      primaryServiceId: config.primaryServiceId,
      trust: config.trust,
      services: config.services.map((s) => ({ id: s.id, label: s.label })),
    },
    calls,
    timeToFirstSwitch,
    switchesPerEpisode,
    residualBadServiceUse:
      residualDenom === 0 ? 0 : residualNumer / residualDenom,
    finalTrustByService: trust.snapshot(),
  };
}
