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

  return {
    pathwayTypeOptions,
    modelYearNetzeroOptions,
    temperatureOptions,
    geographyOptions,
    sectorOptions,
    metricOptions,
  };
}

// (Optional compatibility) If other code expects raw arrays, derive them here.
export function getUniqueFilterValuesFromGlobalOptions(
  pathways: PathwayMetadataType[],
) {
  const {
    pathwayTypeOptions,
    modelYearNetzeroOptions,
    temperatureOptions,
    geographyOptions,
    sectorOptions,
    metricOptions,
  } = getGlobalFacetOptions(pathways);

  return {
    pathwayTypes: pathwayTypeOptions.map((o) => String(o.value)),
    targetYears: modelYearNetzeroOptions.map((o) => Number(o.value)),
    temperatures: temperatureOptions.map((o) => Number(o.value)),
    geographies: geographyOptions.map((o: LabeledOption) => String(o.value)),
    sectors: sectorOptions.map((o) => String(o.value)),
    metrics: metricOptions.map((o) => String(o.value)),
  };
}

export interface GeoOption {
  value: string; // raw (e.g., "CN", "Europe", "Global")
  label: string; // display (e.g., "China", "Europe", "Global")
}

// New: allow AND/OR per facet. Defaults to "ANY" for backwards compatibility.
export type FacetMode = "ANY" | "ALL" | "RANGE";

export type NumericRange = {
  mode: "RANGE";
  min?: number; // open-ended lower bound ok
  max?: number; // open-ended upper bound ok
};

export type FilterModes = Partial<{
  pathwayType: FacetMode;
  modelYearNetzero: FacetMode;
  modelTempIncrease: FacetMode;
  geography: FacetMode;
  sector: FacetMode;
  metric: FacetMode;
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

function pickMode(facet: keyof FilterModes, modes?: FilterModes): FacetMode {
  return modes?.[facet] ?? "ANY";
}

function matchesNumericRange(
  value: number | undefined | null,
  range: { min?: number; max?: number } | null | undefined,
): boolean {
  if (value == null) return false;
  const gteMin = range?.min == null || value >= range.min;
  const lteMax = range?.max == null || value <= range.max;
  return gteMin && lteMax;
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

export const filterPathways = (
  pathways: PathwayMetadataType[],
  filters: FiltersWithArrays,
): PathwayMetadataType[] => {
  return pathways.filter((pathway) => {
    // --- Helpers
    const isNil = (v: unknown): v is null | undefined =>
      v === null || v === undefined;
    const modeOf = (facet: keyof NonNullable<(typeof filters)["modes"]>) =>
      filters.modes?.[facet] === "ALL" ? "ALL" : "ANY";

    // ----- A) Primitive (single-value) numeric facets behave as equality
    if (typeof filters.modelTempIncrease === "number") {
      const want = filters.modelTempIncrease;
      if (
        isNil(pathway.modelTempIncrease) ||
        pathway.modelTempIncrease !== want
      )
        return false;
    }
    if (typeof filters.modelYearNetzero === "number") {
      const want = filters.modelYearNetzero;
      if (isNil(pathway.modelYearNetzero) || pathway.modelYearNetzero !== want)
        return false;
    }

    // ----- B) Array-backed numerics (OR by default; respect ABSENT; ALL for single-valued facets)
    const numericFacet = <K extends "modelTempIncrease" | "modelYearNetzero">(
      key: K,
    ) => {
      const sel = filters[key] as unknown[];
      if (!Array.isArray(sel) || sel.length === 0) return true; // no filter for this facet

      const hasAbsent = sel.includes(ABSENT_FILTER_TOKEN);
      const nums = sel.filter((v): v is number => typeof v === "number");
      const val = pathway[key] as number | null | undefined;
      const mode = modeOf(key); // "ANY" | "ALL"

      // Single-valued facet: a pathway can have at most one numeric value
      // ANY: matches if val equals any selected number (OR), or if ABSENT is selected and val is nil
      // ALL: matches only if:
      //   - nums.length === 1 and val equals that single number; AND
      //   - if hasAbsent is also selected, that would require val to be both present and absent -> impossible,
      //     so treat it as no match when nums.length >= 1.
      const matchNumber =
        !isNil(val) &&
        (mode === "ALL"
          ? nums.length === 1 && val === nums[0]
          : nums.length > 0 && nums.includes(val));

      const matchAbsent = hasAbsent && isNil(val);

      // If user selected some numbers but not ABSENT, nil values must NOT pass.
      // If user selected only ABSENT, only nil values pass.
      return matchNumber || matchAbsent;
    };

    if (!numericFacet("modelTempIncrease")) return false;
    if (!numericFacet("modelYearNetzero")) return false;

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

    // --- Net Zero By: ALWAYS RANGE for this facet ---
    {
      const r = (
        !Array.isArray(filters.modelYearNetzero)
          ? filters.modelYearNetzero
          : null
      ) as { min?: number; max?: number; includeAbsent?: boolean } | null;

      if (r) {
        const v = pathway?.modelYearNetzero;
        const hasValue = v != null;
        const pass =
          (hasValue && matchesNumericRange(v, r)) ||
          (!hasValue && !!r.includeAbsent);
        if (!pass) return false;
      }
    }

    // --- Temperature (°C): ALWAYS RANGE for this facet ---
    {
      const r = (
        !Array.isArray(filters.modelTempIncrease)
          ? filters.modelTempIncrease
          : null
      ) as { min?: number; max?: number; includeAbsent?: boolean } | null;

      if (r) {
        const v = pathway?.modelTempIncrease;
        const hasValue = v != null;
        const pass =
          (hasValue && matchesNumericRange(v, r)) ||
          (!hasValue && !!r.includeAbsent);
        if (!pass) return false;
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
