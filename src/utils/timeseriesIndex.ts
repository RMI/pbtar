// src/utils/timeseriesIndex.ts
export type TimeseriesIndexItem = {
  datasetId: string;
  label?: string;
  path: string;
  summary?: unknown;
};

export type TimeseriesIndex = {
  byPathway: Record<string, TimeseriesIndexItem[]>;
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
  schema: { version: number; generatedAt: string };
};

// Try preferred "/data/index.json", then fallback to "/src/data/index.json".
const CANDIDATE_URLS = ["/data/index.json", "/src/data/index.json"];

/**
 * Fetch the generated timeseries linkage index.
 * Returns the full index (or null if not available).
 */
export async function fetchTimeseriesIndex(): Promise<TimeseriesIndex | null> {
  for (const url of CANDIDATE_URLS) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return (await res.json()) as TimeseriesIndex;
      }
    } catch {
      // try next
    }
  }
  return null;
}

/**
 * Return datasets for a given pathway id (slug).
 */
export function datasetsForPathway(
  index: TimeseriesIndex | null,
  pathwayId: string,
): TimeseriesIndexItem[] {
  if (!index) return [];
  return index.byPathway[pathwayId] ?? [];
}

/**
 * Optional: render a compact one-line summary from a dataset's summary object.
 * Supports { dateRange: [start, end], seriesCount: number, rows: number } if present.
 */
export function summarizeSummary(summary: unknown): string | undefined {
  if (!summary || typeof summary !== "object") return undefined;
  const s = summary as Record<string, unknown>;
  const parts: string[] = [];

  // Support yearRange: [minYear, maxYear]
  const yr = Array.isArray(s["yearRange"])
    ? (s["yearRange"] as unknown[])
    : null;
  if (
    yr &&
    yr.length === 2 &&
    typeof yr[0] === "number" &&
    typeof yr[1] === "number"
  ) {
    parts.push(`${yr[0]} → ${yr[1]}`);
  }
  // Back-compat: dateRange: [startISO, endISO]
  const dr = Array.isArray(s["dateRange"])
    ? (s["dateRange"] as unknown[])
    : null;
  if (
    dr &&
    dr.length === 2 &&
    typeof dr[0] === "string" &&
    typeof dr[1] === "string"
  ) {
    parts.push(`${dr[0]} → ${dr[1]}`);
  }
  if (typeof s["sectorCount"] === "number")
    parts.push(`${s["sectorCount"]} sectors`);
  if (typeof s["geographyCount"] === "number")
    parts.push(`${s["geographyCount"]} geographies`);
  if (typeof s["rowCount"] === "number") parts.push(`${s["rowCount"]} rows`);

  return parts.length ? parts.join(" · ") : undefined;
}
