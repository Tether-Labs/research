# Intelligent Systems Simulator

Simulation harness for studying how agents form, lose, and act on trust in services.

**Long-term question:** How do intelligent systems decide whom to trust, coordinate with, and rely on?

Strategy essay: [The next AI product problem isn’t the model — it’s whom agents trust](https://www.tether-labs.com/research/04-intelligent-systems-trust)

## v0 — Trust decay → service switch

**RQ:** At what point does an agent lose trust in a service and choose an alternative?

See [SIM-v0-SPEC.md](./SIM-v0-SPEC.md).

### Run (from repo root)

```bash
npm run sim:v0
npm run sim:v0:analyze
```

Options:

```bash
npx tsx research/intelligent-systems/run-sim-v0.ts --episodes 50 --steps 40 --seed 7 --primary degrading
```

No `OPENAI_API_KEY` required for the default rule-based loop.

### Layout

| File | Role |
|------|------|
| `types.ts` | Shared types + default trust config |
| `trust.ts` | Trust state |
| `services.ts` | Stub services + seeded RNG |
| `evaluator.ts` | Outcome → trust signal |
| `environment.ts` | Episode loop + switch policy |
| `run-sim-v0.ts` | Batch runner → `results/*.json` |
| `analyze-sim-v0.ts` | Summary over a run artifact |
