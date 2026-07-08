// src/utils/timeseriesAvailability.ts
import { SECTORS_BY_KEY } from "./timeseriesTaxonomy";
import { geographyLabel, normalizeGeography } from "./geographyUtils";

interface TimeseriesSummary {
  sectors?: string[];
  geographies?: string[];
  metrics?: string[];
}

function parseSummary(summary: unknown): TimeseriesSummary {
  if (!summary || typeof summary !== "object") return {};
  return summary;
}

function sectorDisplayNames(summary: unknown): Set<string> {
  const names = new Set<string>();
  for (const key of parseSummary(summary).sectors ?? []) {
    const def = SECTORS_BY_KEY[key];
    if (def) names.add(def.displayName);
  }
  return names;
}

function metricDisplayNames(summary: unknown): Set<string> {
  const s = parseSummary(summary);
  const names = new Set<string>();
  for (const sectorKey of s.sectors ?? []) {
    const sectorDef = SECTORS_BY_KEY[sectorKey];
    if (!sectorDef) continue;
    for (const metricKey of s.metrics ?? []) {
      const metricDef = sectorDef.metrics[metricKey];
      if (metricDef) names.add(metricDef.displayName);
    }
  }
  return names;
}

export interface PathwayToolAvailability {
  hasSector: (sectorDisplayName: string) => boolean;
  hasMetric: (metricDisplayName: string) => boolean;
  hasGeography: (rawGeo: string) => boolean;
}

const NO_DATA: PathwayToolAvailability = {
  hasSector: () => false,
  hasMetric: () => false,
  hasGeography: () => false,
};

export function pathwayToolAvailability(
  datasets: Array<{ summary?: unknown }>,
): PathwayToolAvailability {
  if (datasets.length === 0) return NO_DATA;

  const sectorNames = new Set<string>();
  const metricNames = new Set<string>();
  const geoStrings = new Set<string>();

  for (const ds of datasets) {
    for (const v of sectorDisplayNames(ds.summary)) sectorNames.add(v);
    for (const v of metricDisplayNames(ds.summary)) metricNames.add(v);
    for (const v of parseSummary(ds.summary).geographies ?? [])
      geoStrings.add(v);
  }

  return {
    hasSector: (name) => sectorNames.has(name),
    hasMetric: (name) => metricNames.has(name),
    hasGeography: (rawGeo) => {
      const label = geographyLabel(normalizeGeography(rawGeo));
      return geoStrings.has(label) || geoStrings.has(rawGeo);
    },
  };
}

export const TOOL_AVAILABILITY_TOOLTIP =
  "Solid/filled badges indicate that benchmark data is available for visualization and download in this tool. Outlined badges indicate the data point is available in the publication, but not currently in this tool.";
