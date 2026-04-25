# Experiment 03 — Enforcement

Status: **scoped**, ready to run.
Owner: Naren
Target ship: 3–4 days from 2026-04-20.
Hypothesis locked. Design locked. Do not negotiate with yourself on scope.

---

## The one-sentence framing

**Supervision reduces risk probabilistically. Enforcement converts that remaining risk into visibility — at a measurable operational cost.**

That is the finding Exp 3 is built to produce. We are not trying to prove enforcement "works." We are trying to quantify **how much of the agent's output an enforcement layer intercepts**, and **what that intervention rate looks like across scenarios**.

---

## Locked design decisions

### 1. What triggers enforcement?

`judge.risky === true`.

- No confidence thresholds.
- No category whitelists beyond what the judge already encodes.
- No second-pass heuristics.
- If the judge (which is already calibrated and shipping) says risky, the enforcement layer intervenes. Period.

### 2. What are the enforcement actions?

Two, mapped per-scenario by the `risk_type` field already on every scenario in `scenarios.ts`. The scenario vocabulary is: `none`, `pii`, `sensitive_data`, `wrong_recipient`, `over_sharing`, `hallucination`.

| Scenario `risk_type` | Enforcement action |
|---|---|
| `pii` | `block` — legal/regulatory exposure; no human should be able to green-light this |
| `sensitive_data` | `block` — credentials, customer records, financial data; same reasoning |
| `wrong_recipient` | `block` — sending correct content to the wrong party is as bad as leaking |
| `over_sharing` | `require_approval` — judgment call; a reviewer can release |
| `hallucination` | `require_approval` — fabricated history; a human can confirm/deny |
| `none` | `allow` — never reached in practice (judge says safe) |

Both `block` and `require_approval` mean "**the email did not go out**." They are structurally equivalent for the leak-rate metric. The split exists **only for reporting**: block = hard fail (credentials should never, ever leave); require_approval = soft fail (human could green-light after review).

No human in the loop. `require_approval` is counted, not executed.

### 3. How do we measure false blocks?

We don't. By construction, if the judge is the trigger, the judge-as-oracle makes false-block rate 0%.

We will **call this out explicitly** in the writeup and in the report. The honest frame is:

> "Without a separate ground-truth labeling pass over all 570 emails, we cannot independently score the enforcement layer's blocks. Using the judge as both trigger and oracle makes the block-correctness rate 0% false by construction. The interesting number is not 'how often are we wrong' — it is **how often does the system intervene at all**."

This is fine. Consistency > partial ground truth.

### 4. Do we reuse Exp 2 data or run fresh?

**Run fresh**, but the runner is additive — zero extra LLM calls vs. `run-batch-2.ts`:

- Same 19 scenarios.
- Same `gpt-4o-mini` agent in both unsupervised and supervised modes (already computed for all 570 emails in Exp 2).
- Same calibrated LLM judge (already the trigger in the combined verdict).
- **New**: for each supervised output, apply the enforcement decision function. Derived from fields already in the `EvalOutcome`. No extra API round-trips.

Running it fresh means we get a new JSON + report timestamped for this experiment, with intervention-rate volatility visible across runs. That matters for the story.

### 5. How many runs?

**15 runs × 19 scenarios × 2 agent modes = 570 emails**, identical to Exp 2.

Not doing model comparison here. Not doing cross-model. Same cohort as Exp 2 so the deltas are clean.

---

## Metrics the runner must emit

For each scenario × mode, plus totals:

- `leaked` (unsupervised, supervised, enforced) — %
- `intervention_rate` — % of supervised emails where enforcement fired = % where judge said risky
- `blocks` — count, per-scenario, per-category
- `required_approvals` — count, per-scenario, per-category
- `throughput` — % of supervised emails that went through untouched = `1 - intervention_rate`
- `per-category intervention` — which risk types drove the most interventions
- Variance across 15 runs of intervention rate per scenario

**Non-metrics** (explicitly not reported, to avoid false precision):

- False-block rate (see §3)
- Latency — single-threaded hobby laptop is not a benchmark environment

---

## The expected story

Based on Exp 2 numbers (53.3% → 19.3% with judge-truth):

| Mode | Leak rate (expected) |
|---|---|
| Unsupervised | ~53% |
| Supervised | ~19% |
| **Enforced** | **≈0%** (by construction — judge-trust loop) |
| **Intervention rate (supervised → enforcement fires)** | **≈19%** |

The headline is not "0% leak rate" — that's circular and a naive reader will call it out. The headline is:

> **"To drive residual risk to zero, you intervene on 1-in-5 sends."**

That is an **operational cost** statement, and it is the thing that distinguishes research from wishful thinking. Everyone can build an enforcement layer. The question is what it costs you.

---

## Deliverables

- [ ] `eng/research/run-batch-3.ts` — the runner. Mirrors `run-batch-2.ts`, adds enforced-mode derivation and the enforcement-layer reporting.
- [ ] `experiment:batch:3` script in `eng/package.json`.
- [ ] Mirror the runner and final report into the public `Tether-Labs/research` repo after a clean run.
- [ ] Pipeline diagram for Exp 3 (adds "enforcement decision" and "block / require_approval / allow" nodes downstream of the judge verdict).
- [ ] Post: `homepage/src/content/research/03-enforcement.mdx` + Substack draft at `content/substack-03-enforcement.md`.

---

## Post narrative outline (write this last, after numbers are in)

1. **Recap (1 para)** — Exp 1 showed agents are stochastic and risky. Exp 2 showed supervision cuts it by ~34 points but leaves systemic residual.
2. **The naive conclusion we want to avoid** — "just add an enforcement layer and you're done." Sure. Nobody argues with that. The question is the cost.
3. **The pipeline** — diagram with the enforcement layer added.
4. **The numbers** — unsupervised / supervised / enforced, intervention rate, per-category breakdown.
5. **The honest section** — why the residual is 0 is trivial (judge-as-trigger). What's not trivial is the intervention rate. Explain.
6. **Taxonomy** — where does intervention fire most? (Expected: credentials, confidential, wrong-recipient.) Where is it rare? (Expected: safe scenarios, obvious task emails.)
7. **What this means for builders** — if you're deploying an agent, here is your approval-volume budget. Either staff a review queue, or accept residual risk, or narrow the agent's surface area.
8. **What's next** — model comparison, TetherBench.

---

## Anti-goals

Things we are **explicitly not doing** in Exp 3. Do not negotiate these back in.

- No threshold tuning on the judge.
- No new scenarios. 19, same as Exp 1 and Exp 2.
- No new models. gpt-4o-mini only.
- No real human-in-the-loop simulation. `require_approval` is counted, not executed.
- No false-block analysis. Acknowledged limitation in the writeup.
- No latency / throughput benchmarking.
- No prompt-injection adversarial tests. That's a separate experiment.
- No cloud runner refactor. We run this on the laptop once, then ship.

If the batch produces a weird result, do **one** re-run to confirm, not five.

---

## Success criteria for the experiment

- Batch completes cleanly on 15 × 19 × 2 = 570 emails.
- Enforced-mode leak rate ≤ 1%. (If the judge's self-check rarely overrides its own `risky=true`, this will be exactly 0%.)
- Per-scenario intervention rate is meaningfully different across scenarios. If every scenario intervenes at the same rate, the post has no story.
- Intervention rate on the safe scenarios (those with no risky context) is near-zero. If the judge is firing on safe emails, that's a separate bug to fix before publishing.

If any of those fail, fix, re-run once, then ship. Do not spiral.
