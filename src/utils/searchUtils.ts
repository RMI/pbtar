import { Scenario } from "../types";
import {
  normalizeGeography,
  geographyLabel,
  sortGeographiesForDetails,
} from "./geographyUtils";
import {
  matchesOptionalFacet,
  matchesOptionalFacetAny,
  matchesOptionalFacetAll,
} from "./facets";
import { ABSENT_FILTER_TOKEN } from "./absent";

export interface GeoOption {
  value: string; // raw (e.g., "CN", "Europe", "Global")
  label: string; // display (e.g., "China", "Europe", "Global")
}

// New: allow AND/OR per facet. Defaults to "ANY" for backwards compatibility.
export type FacetMode = "ANY" | "ALL";
export type FilterModes = Partial<{
  geography: FacetMode;
  sector: FacetMode;
}>;

// Extend your existing Filters type minimally:
// - geography/sector may be string | string[]
// - optionally accept a modes map
export type Arrayable = string | string[] | null | undefined;
export type FiltersWithArrays = {
  geography?: Arrayable;
  sector?: Arrayable;
  pathwayType?: string | null;
  modelYearEnd?: string | null;
  modelTempIncrease?: string | null;
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

export function makeGeographyOptions(scenarios: Scenario[]): GeoOption[] {
  const seen = new Set<string>();
  for (const s of scenarios) {
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

export const filterScenarios = (
  scenarios: Scenario[],
  filters: FiltersWithArrays,
): Scenario[] => {
  return scenarios.filter((scenario) => {
    // Pathway type filter
    if (
      !matchesOptionalFacet(
        filters.pathwayType == null ? [] : [String(filters.pathwayType)],
        scenario.pathwayType,
      )
    )
      return false;

    // Target year filter
    if (
      !matchesOptionalFacet(
        filters.modelYearEnd == null ? [] : [String(filters.modelYearEnd)],
        scenario.modelYearEnd,
      )
    )
      return false;

    // Target temperature filter (missing-aware: supports "__ABSENT__")
    if (
      !matchesOptionalFacet(
        filters.modelTempIncrease == null
          ? [] // no selection => don't filter by temperature
          : [String(filters.modelTempIncrease)], // single-select dropdown -> 1 token
        scenario.modelTempIncrease,
      )
    ) {
      return false;
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
              scenario.geography ?? [],
              (g) => norm(g),
            )
          : matchesOptionalFacetAny(
              normalizedSelected,
              scenario.geography ?? [],
              (g) => norm(g),
            );
      if (!ok) return false;
    }

    // Sector filter (array + mode + missing-aware)
    {
      const selected = toArray(filters.sector);
      const normalizedSelected = selected; // sector tokens look canonical already
      const mode = pickMode("sector", filters.modes);
      const values = (scenario.sectors ?? []).map((s) => s.name);
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
        scenario.name,
        scenario.description,
        scenario.pathwayType,
        scenario.modelYearEnd,
        scenario.modelTempIncrease,
        ...scenario.geography,
        ...scenario.geography.map((s) => geographyLabel(s)),
        ...scenario.sectors.map((s) => s.name),
        scenario.publisher,
        scenario.publicationYear,
      ];

      return searchFields.some((field) =>
        String(field).toLowerCase().includes(searchTerm),
      );
    }

    return true;
  });
};
