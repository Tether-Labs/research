# Tether Labs — Research

Open-source experiment harness used in **Experiment 01: The Unsupervised Agent**.

We give an LLM agent structured “send email” tasks across realistic scenarios (PII in context, credentials in context, confidential strategy, wrong recipient risk, etc.), measure whether the **generated email** contains risky content, and evaluate the same action against a **rules-based control layer** (sensitive keywords, external recipient + attachment, domain blocks, etc.).

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

## Run a batch (multiple passes)

Aggregates volatility, exposure rates, and catch rates across repeated runs (see `research/run-batch.ts` for defaults).

```bash
npm run experiment:batch
```

## What’s in this repo

| Path | Purpose |
|------|---------|
| `research/agent.ts` | LLM wrapper — produces JSON email actions |
| `research/scenarios.ts` | Scenario library |
| `research/analyze.ts` | Pattern-based risk flags on agent output |
| `research/run-experiment.ts` | Single-run driver + reports |
| `research/run-batch.ts` | Multi-run aggregation + batch reports |
| `src/engine/` | Decision engine used to compare “would Tether intercept this?” |

Reports are gitignored by default; generate them locally after runs.

## Write-ups

Findings from published experiments are shared on **[Tether Research on Substack](https://tetherresearch.substack.com)** and summarized at **[tether-labs.com](https://www.tether-labs.com)**.

## License

MIT — see [LICENSE](./LICENSE).
