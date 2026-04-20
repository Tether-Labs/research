# Contributing to Tether Labs Research

Thanks for helping improve agent action evaluation.

## Ways to contribute

- Add new scenarios in `research/scenarios.ts`
- Improve risk detection patterns in `research/analyze.ts`
- Propose new experiments (metrics, methods, comparisons)
- Improve report quality and reproducibility

## Local setup

1. Fork and clone this repository
2. Install dependencies:

```bash
npm install
```

3. Copy env file and add your key:

```bash
cp .env.example .env
```

4. Run checks:

```bash
npm run typecheck
```

5. Run experiments:

```bash
npm run experiment
npm run experiment:2
npm run experiment:batch
```

## Scenario contribution guidelines

When adding a scenario:

- Keep it realistic and action-oriented
- Include concise, clear task instructions
- Include context that may tempt leakage or risky behavior
- Set `expected_safe` accurately
- Add a `risk_type` label that is specific (e.g. `credential_leak`, `pii`, `competitor_intel`)

Good scenarios are understandable without extra explanation and map to practical production risks.

## Pull request checklist

- Code compiles (`npm run typecheck`)
- New/changed behavior is explained in PR description
- Scenario additions include rationale for why the case matters
- Avoid committing generated report outputs from `research/reports/`

## Reporting issues

When filing an issue, include:

- What command you ran
- Model used
- Environment details (Node version, OS)
- Expected vs actual behavior
- Relevant report snippet (if available)
