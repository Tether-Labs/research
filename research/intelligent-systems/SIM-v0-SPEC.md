# Intelligent Systems Simulator v0 — Spec

Status: **scaffolded**, runnable without LLM API.
Owner: Naren
Hypothesis locked for v0. Do not expand theme coverage until metrics ship.

---

## One-sentence framing

**We measure when an agent abandons a degrading service and switches to an alternative — not whether a single model “is accurate.”**

---

## Research question

> At what point does an agent lose trust in a service and choose an alternative?

---

## Locked design decisions

### 1. Agent policy (v0)

Rule-based trust updates (no LLM required for the default loop).

- Start with a preferred primary service.
- After each call, update per-service trust from outcome (success / incorrect / latency).
- Switch when current service trust falls below `switchThreshold` **and** an alternative has higher trust.

Optional later: `--llm` flag for model-driven switch decisions (hypothesis: models differ).

### 2. Failure modes

| Mode | Meaning | Trust impact (default) |
|------|---------|------------------------|
| `success` | Correct, timely | +`successDelta` |
| `incorrect` | Wrong answer | −`incorrectPenalty` |
| `latency` | Correct but slow | −`latencyPenalty` (smaller than incorrect) |

Hypothesis under test: **latency ≠ incorrectness** in trust dynamics.

### 3. Services

Deterministic stub profiles (seeded RNG for reproducibility):

- `reliable` — high success, low latency
- `degrading` — starts OK, then rising incorrect / latency rates
- `fast_wrong` — low latency, high incorrect rate

### 4. Metrics (required)

| Metric | Definition |
|--------|------------|
| `timeToFirstSwitch` | Step index of first switch away from initial primary (or `null`) |
| `switchesPerEpisode` | Count of service changes |
| `residualBadServiceUse` | Fraction of steps after first switch that still call a service with trust &lt; threshold |
| `finalTrustByService` | Ending trust scores |

### 5. Out of scope for v0

- Multi-agent reputation markets
- Peer gossip (hypothesis #3 stubbed as optional `reputationBonus` constant, not a live market)
- Rich governance UI
- Homepage project page

---

## Entities

```
Agent → chooses service → Environment executes stub → Evaluator scores → Trust State updates → Agent may switch
```

| Entity | File |
|--------|------|
| Types | `types.ts` |
| Trust state | `trust.ts` |
| Services | `services.ts` |
| Environment + loop | `environment.ts` |
| Evaluator | `evaluator.ts` |
| Runner | `run-sim-v0.ts` |
| Analyzer | `analyze-sim-v0.ts` |

---

## How to run

From the `Tether-Labs/research` repo root:

```bash
npm run sim:v0
npm run sim:v0:analyze
```

Artifacts write to `research/intelligent-systems/results/`.

Private iteration copy also lives in the outer monorepo at `eng/research/intelligent-systems/`.

---

## Hypotheses checklist

| # | Hypothesis | v0 approach |
|---|------------|-------------|
| 1 | Trust decays with repeated failures | Incorrect outcomes lower trust; measure time-to-switch |
| 2 | Latency ≠ incorrect answers | Separate penalties; compare switch timing under latency-heavy vs incorrect-heavy profiles |
| 3 | Peer reputation influences decisions | Optional static `reputationBonus` per service (not live multi-agent yet) |
| 4 | Models differ | Deferred to LLM agent mode |

---

## Success for this scaffold

- [x] Spec locked
- [x] Deterministic episode loop
- [x] JSON run artifact + analyzer
- [ ] First published finding (later)
