// scripts/build-timeseries-index.ts
// Build a compact linkage index from arbitrary JSON under src/data/**.
//
// Behavior (env flags):
//   - TS_INDEX_STRICT=1 : exit(1) if any timeseries is malformed (missing datasetId/id or pathwayID)
//   - TS_INDEX_DEBUG=1  : verbose logs for skipped files & reasons
//
// Detection & normalization:
//   - Identify timeseries by $schema containing "pathwayTimeseries.v1.json" (or full URL).
//   - datasetId  := datasetId | id
//   - pathwayIDs := pathwayID (string|array) | pathwayIds | pathwayId
//   - label      := label | name
//
// Output:
//   - Writes src/data/index.json with { byPathway, byDataset, schema }.

import { promises as fs } from "node:fs";
import * as path from "node:path";

const STRICT = process.env.TS_INDEX_STRICT === "1";
const DEBUG = process.env.TS_INDEX_DEBUG === "1";

type Header = {
  $schema?: string;
  datasetId?: string;
  id?: string;
  // You use singular key "pathwayID" (array or string). We also accept common variants.
  pathwayID?: string | string[];
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
    {
      datasetId: string;
      pathwayIds: string[];
      label?: string;
      path: string;
      summary?: unknown;
    }
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

function logDebug(...args: any[]) {
  if (DEBUG) console.log("[timeseries-index][debug]", ...args);
}
function logInfo(...args: any[]) {
  console.log("[timeseries-index]", ...args);
}
function logWarn(...args: any[]) {
  console.warn("[timeseries-index]", ...args);
}
function logError(...args: any[]) {
  console.error("[timeseries-index]", ...args);
}

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
  let s = raw.replace(/\/\*[\s\S]*?\*\//g, ""); // remove /* block */ comments
  s = s.replace(/(^|\s)\/\/.*$/gm, ""); // remove // line comments (line-wise)
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
    const tail = abs
      .slice(i + `${path.sep}src${path.sep}`.length)
      .split(path.sep)
      .join("/");
    // tail starts with "data/..."
    return "/" + tail; // "/data/..."
  }
  // Fallback—shouldn't happen in this repo.
  return "/data/" + path.basename(abs);
}

function toArray(v: unknown): string[] | null {
  if (typeof v === "string") return [v];
  if (Array.isArray(v) && v.every((x) => typeof x === "string"))
    return v as string[];
  return null;
}

async function main() {
  if (!(await isDir(DATA_DIR))) {
    logError(`Not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const byPathway: TimeseriesIndex["byPathway"] = {};
  const byDataset: TimeseriesIndex["byDataset"] = {};

  const invalidTimeseries: string[] = [];
  const debugParseErrors: string[] = [];
  const debugNonTimeseries: string[] = [];

  for await (const file of walk(DATA_DIR)) {
    let parsed: Header | null = null;

    // Silently skip JSON we can't parse; optionally record debug info.
    try {
      const raw = await fs.readFile(file, "utf8");
      parsed = parseJsonWithComments(raw) as Header;
    } catch (e: any) {
      if (DEBUG)
        debugParseErrors.push(
          `${path.relative(ROOT, file)} :: ${e?.message ?? "parse error"}`,
        );
      continue;
    }

    if (!isTimeseriesHeader(parsed)) {
      if (DEBUG) debugNonTimeseries.push(path.relative(ROOT, file));
      continue; // not a timeseries → skip silently (or debug-log)
    }

    // ---- Normalize keys per your BAS file shape ----
    const datasetId = (parsed.datasetId ?? parsed.id) as string | undefined;

    // pathwayIDs: prefer singular key "pathwayID", else fallback to other common keys.
    let pids: string[] | null =
      toArray(parsed.pathwayID) ??
      (Array.isArray(parsed.pathwayIds)
        ? parsed.pathwayIds
        : toArray(parsed.pathwayId));

    if (!datasetId || !pids || pids.length === 0) {
      invalidTimeseries.push(path.relative(ROOT, file));
      continue; // skip malformed timeseries; strict mode may fail later
    }

    // Normalize label/path
    const label = (parsed.label ?? parsed.name) as string | undefined;
    const webPath = toWebPath(file);

    // ---------- Compute lightweight summary ----------
    // We avoid heavy work; single pass over data if it exists.
    const rawData: unknown = (parsed as any)?.data;
    let computed: Record<string, unknown> = {};
    if (Array.isArray(rawData) && rawData.length > 0) {
      let minYear: number | undefined;
      let maxYear: number | undefined;
      let rowCount = 0;
      const sectors = new Set<string>();
      const geos = new Set<string>();

      for (const row of rawData as any[]) {
        rowCount++;
        // Year from explicit 'year' or from 'date'
        const y =
          typeof row?.year === "number"
            ? row.year
            : row?.date
              ? new Date(row.date).getUTCFullYear()
              : undefined;
        if (typeof y === "number" && Number.isFinite(y)) {
          if (minYear === undefined || y < minYear) minYear = y;
          if (maxYear === undefined || y > maxYear) maxYear = y;
        }
        // Unique sectors
        if (typeof row?.sector === "string" && row.sector)
          sectors.add(row.sector);
        // Unique geographies (prefer 'geography', fallback 'region')
        const g =
          typeof row?.geography === "string"
            ? row.geography
            : typeof row?.region === "string"
              ? row.region
              : undefined;
        if (g) geos.add(g);
      }

      if (rowCount > 0) computed.rowCount = rowCount;
      if (minYear !== undefined && maxYear !== undefined) {
        computed.yearRange = [minYear, maxYear];
      }
      if (sectors.size > 0) computed.sectorCount = sectors.size;
      if (geos.size > 0) computed.geographyCount = geos.size;
    }

    // Merge with any author-provided summary in the file (computed wins on conflicts)
    const userSummary =
      parsed.summary && typeof parsed.summary === "object"
        ? (parsed.summary as Record<string, unknown>)
        : {};
    const summary = { ...userSummary, ...computed };

    const item: IndexItem = { datasetId, label, summary, path: webPath };

    // byDataset (datasetId should be unique; last one wins deterministically by traversal)
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

  // Logs
  logInfo(`Wrote ${path.relative(ROOT, OUT_FILE)}`);

  if (DEBUG) {
    if (debugParseErrors.length) {
      logDebug(`Parse-skipped files (${debugParseErrors.length}):`);
      for (const m of debugParseErrors) logDebug("  -", m);
    }
    if (debugNonTimeseries.length) {
      logDebug(`Non-timeseries JSON skipped (${debugNonTimeseries.length}):`);
      for (const f of debugNonTimeseries) logDebug("  -", f);
    }
  }

  if (invalidTimeseries.length) {
    const sample = invalidTimeseries.slice(0, 5);
    logWarn(
      `Skipped ${invalidTimeseries.length} invalid timeseries (missing datasetId/id or pathwayID). Example(s): ${sample.join(
        ", ",
      )}`,
    );
    if (STRICT) {
      logError("STRICT mode: failing due to invalid timeseries.");
      process.exit(1);
    }
  }
}

main().catch((e) => {
  logError("Fatal:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});
