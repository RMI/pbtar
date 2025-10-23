// scripts/build-timeseries-index.ts
// Build a compact linkage index from arbitrary JSON under src/data/**.
// - Identifies timeseries by $schema containing "pathwayTimeseries.v1.json" (or full URL).
// - Normalizes fields:
//     datasetId  := datasetId | id
//     pathwayIDs := pathwayID (string|array) | pathwayIds | pathwayId
//     label      := label | name
// - Silently skips non-timeseries and unparsable JSON.
// - Writes src/data/index.json with { byPathway, byDataset, schema }.

import { promises as fs } from "node:fs";
import * as path from "node:path";

type Header = {
  $schema?: string;
  datasetId?: string;
  id?: string;
  // You said you use *singular* key "pathwayID" but the value is an array (or string).
  pathwayID?: string | string[];
  // Also accept alternate spellings just in case:
  pathwayIds?: string[];
  pathwayId?: string | string[];
  label?: string;
  name?: string;
  summary?: unknown;
};

type IndexItem = {
  datasetId: string;
  label?: string;
  path: string;
  summary?: unknown;
};

type TimeseriesIndex = {
  byPathway: Record<string, IndexItem[]>;
  byDataset: Record<
    string,
    { datasetId: string; pathwayIds: string[]; label?: string; path: string; summary?: unknown }
  >;
  schema: { version: 1; generatedAt: string };
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const OUT_FILE = path.join(DATA_DIR, "index.json");

const TS_SCHEMA_MATCHERS = [
  "pathwayTimeseries.v1.json",
  "http://pathways-library.rmi.org/schema/pathwayTimeseries.v1.json",
];

async function isDir(p: string) {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) yield full;
  }
}

// Minimal comment stripping to tolerate // and /* */ in JSON files.
function parseJsonWithComments(raw: string): any {
  // Remove /* block */ comments:
  let s = raw.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove // line comments (not string-safe but sufficient for our data layout):
  s = s.replace(/(^|\s)\/\/.*$/gm, "");
  return JSON.parse(s);
}

function isTimeseriesHeader(h: Header | null | undefined): h is Header {
  if (!h || typeof h !== "object") return false;
  const s = h.$schema;
  if (typeof s !== "string") return false;
  return TS_SCHEMA_MATCHERS.some((m) => s.includes(m));
}

// Map absolute file path under src/data/** to a web path, defaulting to "/data/..."
function toWebPath(abs: string): string {
  const marker = `${path.sep}src${path.sep}data${path.sep}`;
  const i = abs.lastIndexOf(marker);
  if (i >= 0) {
    const tail = abs.slice(i + `${path.sep}src${path.sep}`.length).split(path.sep).join("/");
    // tail starts with "data/..."
    return "/" + tail; // "/data/..."
  }
  // Fallback—shouldn't happen in this repo.
  return "/data/" + path.basename(abs);
}

function toArray(v: unknown): string[] | null {
  if (typeof v === "string") return [v];
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  return null;
}

async function main() {
  if (!(await isDir(DATA_DIR))) {
    console.error(`[timeseries-index] Not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const byPathway: TimeseriesIndex["byPathway"] = {};
  const byDataset: TimeseriesIndex["byDataset"] = {};

  const invalidTimeseries: string[] = [];

  for await (const file of walk(DATA_DIR)) {
    let parsed: Header | null = null;

    // Silently skip JSON we can't parse; metadata files often include comments or different shapes.
    try {
      const raw = await fs.readFile(file, "utf8");
      parsed = parseJsonWithComments(raw) as Header;
    } catch {
      continue; // silent
    }

    if (!isTimeseriesHeader(parsed)) continue; // not a timeseries → skip silently

    // ---- Normalize keys per your BAS file shape ----
    const datasetId = (parsed.datasetId ?? parsed.id) as string | undefined;

    // pathwayIDs: prefer singular key "pathwayID", else fallback to other common keys.
    let pids: string[] | null =
      toArray(parsed.pathwayID) ??
      (Array.isArray(parsed.pathwayIds) ? parsed.pathwayIds : toArray(parsed.pathwayId));

    if (!datasetId || !pids || pids.length === 0) {
      invalidTimeseries.push(file);
      continue; // skip this malformed timeseries without noise
    }

    // Normalize label/summary/path
    const label = (parsed.label ?? parsed.name) as string | undefined;
    const summary = parsed.summary;
    const webPath = toWebPath(file);

    const item: IndexItem = { datasetId, label, summary, path: webPath };

    // byDataset (last one wins if duplicates; datasetId should be unique)
    byDataset[datasetId] = {
      datasetId,
      pathwayIds: [...new Set(pids)].sort(),
      label,
      summary,
      path: webPath,
    };

    // byPathway
    for (const pid of pids) {
      if (!byPathway[pid]) byPathway[pid] = [];
      byPathway[pid].push(item);
    }
  }

  // Deterministic ordering
  for (const pid of Object.keys(byPathway)) {
    byPathway[pid].sort((a, b) => a.datasetId.localeCompare(b.datasetId));
  }

  const out: TimeseriesIndex = {
    byPathway,
    byDataset,
    schema: { version: 1, generatedAt: new Date().toISOString() },
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf8");

  // Keep logs minimal/non-noisy: one success line, plus an optional concise summary.
  console.log(`[timeseries-index] Wrote ${path.relative(ROOT, OUT_FILE)}`);
  if (invalidTimeseries.length) {
    const sample = invalidTimeseries.slice(0, 5).map((f) => path.relative(ROOT, f));
    console.log(
      `[timeseries-index] Skipped ${invalidTimeseries.length} invalid timeseries (missing datasetId/pathwayIDs). Example(s): ${sample.join(
        ", "
      )}`
    );
  }
}

main().catch((e) => {
  console.error("[timeseries-index] Fatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
