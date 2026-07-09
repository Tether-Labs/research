/**
 * Summarize a Simulator v0 batch JSON artifact.
 *
 * Usage:
 *   npx tsx research/intelligent-systems/analyze-sim-v0.ts research/intelligent-systems/results/<run>.json
 */
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { BatchResult } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadBatch(path: string): BatchResult {
  return JSON.parse(readFileSync(path, "utf8")) as BatchResult;
}

function latestResult(): string {
  const dir = join(__dirname, "results");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    throw new Error(`No JSON results in ${dir}`);
  }
  return join(dir, files[files.length - 1]!);
}

function main() {
  const path = process.argv[2] ?? latestResult();
  const batch = loadBatch(path);

  const outcomeCounts: Record<string, number> = {};
  const serviceUse: Record<string, number> = {};
  for (const ep of batch.episodes) {
    for (const c of ep.calls) {
      outcomeCounts[c.outcome] = (outcomeCounts[c.outcome] ?? 0) + 1;
      serviceUse[c.serviceId] = (serviceUse[c.serviceId] ?? 0) + 1;
    }
  }

  console.log(`Run: ${batch.runId}`);
  console.log(`Created: ${batch.createdAt}`);
  console.log(`File: ${path}`);
  console.log("\nSummary:");
  console.log(JSON.stringify(batch.summary, null, 2));
  console.log("\nOutcome counts:");
  console.log(JSON.stringify(outcomeCounts, null, 2));
  console.log("\nService use (call counts):");
  console.log(JSON.stringify(serviceUse, null, 2));

  const sample = batch.episodes[0];
  if (sample) {
    console.log("\nSample episode final trust:");
    console.log(JSON.stringify(sample.finalTrustByService, null, 2));
    console.log(`timeToFirstSwitch: ${sample.timeToFirstSwitch}`);
    console.log(`switchesPerEpisode: ${sample.switchesPerEpisode}`);
  }
}

main();
