# Tether Labs — Research

Open-source experiment harness used across the Tether Labs research series:

- **Experiment 01 — Unsupervised agent.** Same prompt run repeatedly produces different outcomes; ~21% of generated emails contain risky content. Failures are stochastic, not deterministic.
- **Experiment 02 — Supervised agent.** Add an explicit policy to the system prompt and a calibrated LLM judge as a second detection layer. Leak rate drops from 53.3% to 17.5% — but supervision *reduces* risk, it does not *enforce* it.
- **Experiment 03 — Enforcement.** Wire the judge's verdict to a decision node downstream of the agent: `block` for hard risks, `require_approval` for soft risks, `allow` otherwise. Residual leak rate goes to 0%, at a cost of intervening on **17.5% of sends** (1 in 6). The headline finding isn't the leak rate — it's the operator workload required to make the boundary safe.

We give an LLM agent structured "send email" tasks across realistic scenarios (PII in context, credentials in context, confidential strategy, wrong recipient risk, etc.), measure whether the **generated email** contains risky content with a hybrid detector (regex rules + LLM judge with verbatim-evidence self-check), and — in Exp 03 — evaluate what an enforcement layer downstream of the detector actually costs to operate.

> **Reliability doesn't come from the model. It comes from the system around it.**

## Prerequisites

- Node.js 20+
- An OpenAI API key (`OPENAI_API_KEY`)

## Setup

```bash
git clone https://github.com/Tether-Labs/research.git
cd research
npm install
cp .env.example .env
# Edit .env and set OPENAI_API_KEY
```

## Run a single experiment

Runs all scenarios once, prints a summary, and writes Markdown + JSON under `research/reports/`.

```bash
npm run experiment
```

Optional model override:

```bash
npm run experiment -- gpt-4o-mini
```

## Run Experiment 02 (supervised vs unsupervised)

Runs each scenario **twice** with the same model: baseline (Experiment 01 style) vs **explicit supervision policy** in the system prompt. Writes comparison Markdown + JSON under `research/reports/`.

```bash
npm run experiment:2
```

Optional model:

```bash
npm run experiment:2 -- gpt-4o-mini
```

## Run a batch (multiple passes)

Aggregates volatility, exposure rates, and catch rates across repeated runs (see `research/run-batch.ts` for defaults).

```bash
npm run experiment:batch
```

## Run Experiment 02 batch (15 runs × 19 scenarios × 2 modes)

The full Experiment 02 batch — same scenarios run 15 times in both unsupervised and supervised mode, scored by the calibrated LLM judge with verbatim-evidence self-check.

```bash
npm run experiment:batch:2
```

## Run Experiment 03 (enforcement)

Adds an enforcement decision node downstream of the judge. When `judge.risky === true`, the action is intercepted: `block` for `pii` / `sensitive_data` / `wrong_recipient`, `require_approval` for `over_sharing` / `hallucination`, `allow` otherwise. Reports residual leak rate, intervention rate, block/approval split, per-risk-type intervention rate, and volatile scenarios.

```bash
npm run experiment:batch:3
```

Spec for the run: [`research/EXP3-SPEC.md`](./research/EXP3-SPEC.md).

## Intelligent Systems Simulator v0

Rule-based simulation of **trust decay → service switch** (no API key required for the default loop).

```bash
npm run sim:v0
npm run sim:v0:analyze
```

Spec: [`research/intelligent-systems/SIM-v0-SPEC.md`](./research/intelligent-systems/SIM-v0-SPEC.md).

## What's in this repo

| Path | Purpose |
|------|---------|
| `research/agent.ts` | LLM wrapper — produces JSON email actions |
| `research/scenarios.ts` | Scenario library |
| `research/analyze.ts` | Pattern-based risk flags on agent output |
| `research/judge.ts` | LLM judge with recipient classifier, content-not-topic rule, verbatim-evidence self-check |
| `research/run-experiment.ts` | Single-run driver + reports |
| `research/run-experiment-2.ts` | Experiment 02 — supervised vs unsupervised comparison |
| `research/run-batch.ts` | Multi-run aggregation + batch reports |
| `research/run-batch-2.ts` | Experiment 02 batch runner (15× × 19 × 2 modes, hybrid detector) |
| `research/run-batch-3.ts` | Experiment 03 batch runner (adds enforcement decision node) |
| `research/EXP3-SPEC.md` | Experiment 03 design doc — trigger rule, policy map, why judge-as-oracle is acknowledged circular |
| `research/intelligent-systems/` | Simulator v0 — trust decay, service switching, batch + analyze |
| `src/engine/` | Decision engine used to compare "would Tether intercept this?" |

Reports are gitignored by default; generate them locally after runs.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for scenario guidelines, local workflow, and PR checklist.

## Write-ups

Findings from published experiments live at **[tether-labs.com/research](https://www.tether-labs.com/research)** (canonical) and on **[Tether Labs on Substack](https://tetherlabs.substack.com)** (syndication).

| # | Title | Read |
|---|-------|------|
| 01 | The Unsupervised Agent | [tether-labs.com/research/01-unsupervised-agent](https://www.tether-labs.com/research/01-unsupervised-agent) |
| 02 | The Supervised Agent | [tether-labs.com/research/02-supervised-agent](https://www.tether-labs.com/research/02-supervised-agent) |
| 03 | Enforcement | [tether-labs.com/research/03-enforcement](https://www.tether-labs.com/research/03-enforcement) |
| — | Whom agents trust (strategy) | [tether-labs.com/research/04-intelligent-systems-trust](https://www.tether-labs.com/research/04-intelligent-systems-trust) |

## License

MIT — see [LICENSE](./LICENSE).
