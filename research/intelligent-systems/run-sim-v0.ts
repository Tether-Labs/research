/**
 * Intelligent Systems Simulator v0 — batch runner.
 *
 * RQ: At what point does an agent lose trust in a service and choose an alternative?
 * Default: rule-based trust, deterministic stub services, no LLM.
 */
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { runEpisode } from "./environment.js";
import { DEFAULT_SERVICES } from "./services.js";
import {
  DEFAULT_TRUST_CONFIG,
  type BatchResult,
  type EpisodeResult,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv: string[]) {
  let episodes = 20;
  let steps = 40;
  let seed = 42;
  let primary = "degrading";
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--episodes" && argv[i + 1]) episodes = Number(argv[++i]);
    else if (a === "--steps" && argv[i + 1]) steps = Number(argv[++i]);
    else if (a === "--seed" && argv[i + 1]) seed = Number(argv[++i]);
    else if (a === "--primary" && argv[i + 1]) primary = argv[++i]!;
  }
  return { episodes, steps, seed, primary };
}

function summarize(episodes: EpisodeResult[]): BatchResult["summary"] {
  const withSwitch = episodes.filter((e) => e.timeToFirstSwitch !== null);
  const meanTime =
    withSwitch.length === 0
      ? null
      : withSwitch.reduce((s, e) => s + (e.timeToFirstSwitch as number), 0) /
        withSwitch.length;

  return {
    episodeCount: episodes.length,
    meanTimeToFirstSwitch: meanTime,
    switchRate: withSwitch.length / episodes.length,
    meanSwitchesPerEpisode:
      episodes.reduce((s, e) => s + e.switchesPerEpisode, 0) / episodes.length,
    meanResidualBadServiceUse:
      episodes.reduce((s, e) => s + e.residualBadServiceUse, 0) /
      episodes.length,
  };
}

function main() {
  const { episodes: n, steps, seed, primary } = parseArgs(process.argv.slice(2));

  if (!DEFAULT_SERVICES.some((s) => s.id === primary)) {
    console.error(
      `Unknown primary "${primary}". Options: ${DEFAULT_SERVICES.map((s) => s.id).join(", ")}`,
    );
    process.exit(1);
  }

  const results: EpisodeResult[] = [];
  for (let i = 0; i < n; i++) {
    results.push(
      runEpisode({
        steps,
        seed: seed + i,
        primaryServiceId: primary,
        services: DEFAULT_SERVICES,
        trust: DEFAULT_TRUST_CONFIG,
      }),
    );
  }

  const runId = `sim-v0-${seed}-${n}x${steps}-${Date.now()}`;
  const batch: BatchResult = {
    runId,
    createdAt: new Date().toISOString(),
    episodes: results,
    summary: summarize(results),
  };

  const outDir = join(__dirname, "results");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${runId}.json`);
  writeFileSync(outPath, JSON.stringify(batch, null, 2));

  console.log(JSON.stringify(batch.summary, null, 2));
  console.log(`Wrote ${outPath}`);
}

main();
