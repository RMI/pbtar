import { PathwayMetadataType } from "../types";
import {
  normalizeGeography,
  geographyLabel,
  sortGeographiesForDetails,
} from "./geographyUtils";
import { matchesOptionalFacetAny, matchesOptionalFacetAll } from "./facets";
import { ABSENT_FILTER_TOKEN } from "./absent";
import { buildOptionsFromValues, hasAbsent, withAbsentOption } from "./facets";
import type { LabeledOption } from "./facets";
import { index } from "../data/index.gen";

// ───────────────────────────────────────────────────────────────────────────────
// Global facet option provider
// Builds the dropdown option lists from pathway data in one place,
// including consistent ABSENT/missing handling.
// ───────────────────────────────────────────────────────────────────────────────
export function getGlobalFacetOptions(pathways: PathwayMetadataType[]) {
  // Pathway Type
  const pathwayTypeOptions = buildOptionsFromValues(
    pathways.map((d) => d.pathwayType),
  );

  // Net Zero Year
  const modelYearNetzeroOptions = buildOptionsFromValues(
    pathways.map((d) => d.modelYearNetzero),
  );

  // Temperature
  const temperatureOptions = buildOptionsFromValues(
    pathways.map((d) => d.modelTempIncrease),
  );

  // Geography (structured options via makeGeographyOptions)
  const geographyOptionsRaw: GeoOption[] = makeGeographyOptions(pathways);
  const sawAbsentGeography = hasAbsent(pathways.map((d) => d.geography));
  const geographyOptions = withAbsentOption(
    geographyOptionsRaw as LabeledOption[],
    sawAbsentGeography,
  );

  // Sector (flat names; include ABSENT when some pathways have no sectors)
  const sectorNames = pathways.flatMap(
    (d) => d.sectors?.map((s) => s.name) ?? [],
  );
  const sectorOptionsBase = buildOptionsFromValues(sectorNames);
  const sawAbsentSectors = pathways.some(
    (d) => !d.sectors || d.sectors.length === 0,
  );
  const sectorOptions = withAbsentOption(sectorOptionsBase, sawAbsentSectors);

  // Metric
  const metricOptions = buildOptionsFromValues(
    pathways.map((d) => d.metric).flat(),
  );

  // emissionsTrajectory
  const emissionsTrajectoryOptions = buildOptionsFromValues(
    pathways.map((d) => d.keyFeatures.emissionsTrajectory).flat(),
  );

  // Policy ambition
  const policyAmbitionOptions = buildOptionsFromValues(
    pathways.map((d) => d.keyFeatures.policyAmbition).flat(),
  );

  const dataAvailabilityOptions = buildOptionsFromValues(
    pathways.map((d) => availabilityFor(d)).flat(),
  );

  return {
    pathwayTypeOptions,
    modelYearNetzeroOptions,
    temperatureOptions,
    geographyOptions,
    sectorOptions,
    metricOptions,
    emissionsTrajectoryOptions,
    policyAmbitionOptions,
    dataAvailabilityOptions,
  };
}

export interface GeoOption {
  value: string; // raw (e.g., "CN", "Europe", "Global")
  label: string; // display (e.g., "China", "Europe", "Global")
}

// New: allow AND/OR per facet. Defaults to "ANY" for backwards compatibility.
export type FacetMode = "ANY" | "ALL";
export type FilterModes = Partial<{
  pathwayType: FacetMode;
  modelYearNetzero: FacetMode;
  modelTempIncrease: FacetMode;
  geography: FacetMode;
  sector: FacetMode;
  metric: FacetMode;
  emissionsTrajectory: FacetMode;
  policyAmbition: FacetMode;
}>;

// Extend your existing Filters type minimally:
// - geography/sector may be string | string[]
// - optionally accept a modes map
export type Arrayable =
  | string
  | string[]
  | number
  | number[]
  | null
  | undefined;

export type FiltersWithArrays = {
  geography?: Arrayable;
  sector?: Arrayable;
  metric?: Arrayable;
  emissionsTrajectory?: Arrayable;
  policyAmbition?: Arrayable;
  dataAvailability?: Arrayable;
  pathwayType?: Arrayable;
  modelYearNetzero?: Arrayable;
  modelTempIncrease?: Arrayable;
  searchTerm?: string;
  // optional
  modes?: FilterModes;
};

function toArray(v: Arrayable): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [String(v)];
}

function toArrayMixed(v: Arrayable): (string | number)[] {
  if (v == null) return [];
  return Array.isArray(v)
    ? v.filter((x) => x !== null && x !== undefined)
    : [v];
}

function hasAbsentToken(arr: (string | number)[]): boolean {
  return arr.some((t) => String(t) === ABSENT_FILTER_TOKEN);
}

function toNumberSet(arr: (string | number)[]): Set<number> {
  const out = new Set<number>();
  for (const t of arr) {
    if (String(t) === ABSENT_FILTER_TOKEN) continue;
    const n = typeof t === "number" ? t : Number(t);
    if (Number.isFinite(n)) out.add(n);
  }
  return out;
}

function pickMode(facet: keyof FilterModes, modes?: FilterModes): FacetMode {
  return modes?.[facet] ?? "ANY";
}

export function makeGeographyOptions(
  pathways: PathwayMetadataType[],
): GeoOption[] {
  const seen = new Set<string>();
  for (const s of pathways) {
    for (const g of s.geography ?? []) {
      const v = normalizeGeography(g);
      if (v) seen.add(v);
    }
  }
  const uniques = Array.from(seen);
  const sorted = sortGeographiesForDetails(uniques);

  // ✅ value stays raw, label is full name (or passthrough for regions/Global)
  return sorted.map((v) => ({ value: v, label: geographyLabel(v) }));
}

// Determine data availability per pathway using the generated index
// - "download": pathway id exists in index.byPathway
// - "link": has link to data set
// - "unavailable": otherwise
export type DataAvailability = "Download" | "Foo" | "Unavailable";

function availabilityFor(pathway: PathwayMetadataType): DataAvailability {
  const hasDownload = Boolean(index?.byPathway?.[pathway.id]);
  if (hasDownload) return "Download";
  const hasLink =
    Array.isArray(pathway.publication?.links) &&
    pathway.publication.links.some(
      (l) =>
        typeof l?.description === "string" &&
        ["dataset", "data"].includes(l.description.toLowerCase()),
    );
  if (hasLink) return "Link";
  return "Unavailable";
}

export const filterPathways = (
  pathways: PathwayMetadataType[],
  filters: FiltersWithArrays,
): PathwayMetadataType[] => {
  return pathways.filter((pathway) => {
    // ---- Pathway type: ANY/ALL over selected tokens; empty array => no filter; ABSENT-aware
    {
      const selected = toArray(filters.pathwayType);
      if (selected.length) {
        const hasAbsent = selected.includes(ABSENT_FILTER_TOKEN);
        const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
        const v = pathway.pathwayType ?? null;
        const mode = pickMode("pathwayType", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && (concrete.length ? concrete.includes(v) : false));
        } else {
          // ALL: for single-valued fields, all selected tokens must hold.
          // That is only possible when exactly one token is selected:
          //  - [ABSENT]  -> v == null
          //  - [X]       -> v == X
          // Any combination (ABSENT + X, or X + Y) cannot be satisfied.
          if (hasAbsent && concrete.length === 0) {
            ok = v == null;
          } else if (!hasAbsent && concrete.length === 1) {
            ok = v != null && v === concrete[0];
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // ---- Target year: OR over numbers; empty array => no filter; ABSENT-aware
    {
      const selected = toArrayMixed(filters.modelYearNetzero);
      if (selected.length) {
        const hasAbsent = hasAbsentToken(selected);
        const numericChoices = toNumberSet(selected);
        const v = pathway.modelYearNetzero; // number | null | undefined
        const mode = pickMode("modelYearNetzero", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && numericChoices.has(Number(v)));
        } else {
          // ALL: only possible when exactly one condition is chosen:
          //  - [ABSENT]        -> v == null
          //  - [single number] -> v == number
          // Any other combination (ABSENT + number, or two numbers) is impossible.
          if (hasAbsent && numericChoices.size === 0) {
            ok = v == null;
          } else if (!hasAbsent && numericChoices.size === 1) {
            ok = v != null && numericChoices.has(Number(v));
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // ---- Temperature: OR over numbers; empty array => no filter; ABSENT-aware
    {
      const selected = toArrayMixed(filters.modelTempIncrease);
      if (selected.length) {
        const hasAbsent = hasAbsentToken(selected);
        const numericChoices = toNumberSet(selected);
        const v = pathway.modelTempIncrease; // number | null | undefined
        const mode = pickMode(
          "modelTempIncrease",
          filters.modes as FilterModes,
        );
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && numericChoices.has(Number(v)));
        } else {
          if (hasAbsent && numericChoices.size === 0) {
            ok = v == null;
          } else if (!hasAbsent && numericChoices.size === 1) {
            ok = v != null && numericChoices.has(Number(v));
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // Geography filter (array + mode + missing-aware + normalization)
    {
      const selected = toArray(filters.geography);
      const norm = (s: string) => normalizeGeography(s).toUpperCase();
      // IMPORTANT: preserve the ABSENT token; only normalize concrete selections
      const normalizedSelected = selected.map((t) =>
        t === ABSENT_FILTER_TOKEN ? t : norm(t),
      );
      const mode = pickMode("geography", filters.modes);
      const ok =
        mode === "ALL"
          ? matchesOptionalFacetAll(
              normalizedSelected,
              pathway.geography ?? [],
              (g) => norm(g),
            )
          : matchesOptionalFacetAny(
              normalizedSelected,
              pathway.geography ?? [],
              (g) => norm(g),
            );
      if (!ok) return false;
    }

    // Sector filter (array + mode + missing-aware)
    {
      const selected = toArray(filters.sector);
      const normalizedSelected = selected; // sector tokens look canonical already
      const mode = pickMode("sector", filters.modes);
      const values = (pathway.sectors ?? []).map((s) => s.name);
      const ok =
        mode === "ALL"
          ? matchesOptionalFacetAll(normalizedSelected, values, (s) => s)
          : matchesOptionalFacetAny(normalizedSelected, values, (s) => s);
      if (!ok) return false;
    }

    // metric filter
    {
      const selected = toArray(filters.metric);
      const normalizedSelected = selected;
      const mode = pickMode("metric", filters.modes);
      const values = pathway.metric ?? [];
      const ok =
        mode === "ALL"
          ? matchesOptionalFacetAll(normalizedSelected, values, (s) => s)
          : matchesOptionalFacetAny(normalizedSelected, values, (s) => s);
      if (!ok) return false;
    }

    // emissionsTrajectory filter
    {
      const selected = toArray(filters.emissionsTrajectory);
      if (selected.length) {
        const hasAbsent = selected.includes(ABSENT_FILTER_TOKEN);
        const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
        const v = pathway.keyFeatures?.emissionsTrajectory ?? null;
        const mode = pickMode(
          "emissionsTrajectory",
          filters.modes as FilterModes,
        );
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && (concrete.length ? concrete.includes(v) : false));
        } else {
          // ALL: for single-valued fields, all selected tokens must hold.
          // That is only possible when exactly one token is selected:
          //  - [ABSENT]  -> v == null
          //  - [X]       -> v == X
          // Any combination (ABSENT + X, or X + Y) cannot be satisfied.
          if (hasAbsent && concrete.length === 0) {
            ok = v == null;
          } else if (!hasAbsent && concrete.length === 1) {
            ok = v != null && v === concrete[0];
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // policyAmbition filter
    {
      const selected = toArray(filters.policyAmbition);
      if (selected.length) {
        const hasAbsent = selected.includes(ABSENT_FILTER_TOKEN);
        const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
        const v = pathway.keyFeatures?.policyAmbition ?? null;
        const mode = pickMode("policyAmbition", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && (concrete.length ? concrete.includes(v) : false));
        } else {
          // ALL: for single-valued fields, all selected tokens must hold.
          // That is only possible when exactly one token is selected:
          //  - [ABSENT]  -> v == null
          //  - [X]       -> v == X
          // Any combination (ABSENT + X, or X + Y) cannot be satisfied.
          if (hasAbsent && concrete.length === 0) {
            ok = v == null;
          } else if (!hasAbsent && concrete.length === 1) {
            ok = v != null && v === concrete[0];
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // dataAvailability filter
    // Expect `filters.dataAvailability` to be an array of DataAvailability values.
    // Empty array or undefined => do not filter on availability.
    {
      const selected = toArray(filters.dataAvailability ?? []);
      if (selected.length) {
        const hasAbsent = selected.includes(ABSENT_FILTER_TOKEN);
        const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
        const v = availabilityFor(pathway) ?? null;
        const mode = pickMode("dataAvailability", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && (concrete.length ? concrete.includes(v) : false));
        } else {
          // ALL: for single-valued fields, all selected tokens must hold.
          // That is only possible when exactly one token is selected:
          //  - [ABSENT]  -> v == null
          //  - [X]       -> v == X
          // Any combination (ABSENT + X, or X + Y) cannot be satisfied.
          if (hasAbsent && concrete.length === 0) {
            ok = v == null;
          } else if (!hasAbsent && concrete.length === 1) {
            ok = v != null && v === concrete[0];
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // Search term
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchFields = [
        pathway.name.full,
        pathway.name.short,
        pathway.description,
        pathway.pathwayType,
        pathway.modelYearNetzero,
        pathway.modelTempIncrease,
        ...pathway.geography,
        ...pathway.geography.map((s) => geographyLabel(s)),
        ...pathway.sectors.map((s) => s.name),
        ...pathway.metric,
        pathway.publication.publisher.full,
        pathway.publication.publisher.short,
        pathway.publication.year,
      ];

      return searchFields.some((field) =>
        String(field).toLowerCase().includes(searchTerm),
      );
    }

    return true;
  });
};
