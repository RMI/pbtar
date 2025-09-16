import { Scenario, SearchFilters } from "../types";
import {
  normalizeGeography,
  geographyLabel,
  sortGeographiesForDetails,
} from "./geographyUtils";
import { matchesOptionalFacet, matchesOptionalFacetAny } from "./facets";
import { ABSENT_FILTER_TOKEN } from "./absent";

export interface GeoOption {
  value: string; // raw (e.g., "CN", "Europe", "Global")
  label: string; // display (e.g., "China", "Europe", "Global")
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
  filters: SearchFilters,
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
        filters.modelYearNetzero == null
          ? []
          : [String(filters.modelYearNetzero)],
        scenario.modelYearNetzero,
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

    // Geography filter (array + missing-aware + normalization)
    {
      // Single-select dropdown → array of 1 (or [] if none)
      const selected =
        filters.geography == null ? [] : [String(filters.geography)];
      const norm = (s: string) => normalizeGeography(s).toUpperCase();
      // IMPORTANT: preserve the ABSENT token; only normalize concrete selections
      const normalizedSelected = selected.map((t) =>
        t === ABSENT_FILTER_TOKEN ? t : norm(t),
      );
      const ok = matchesOptionalFacetAny(
        normalizedSelected,
        scenario.geography ?? [],
        (g) => norm(g),
      );
      if (!ok) return false;
    }

    // Sector filter (array + missing-aware)
    {
      const selected = filters.sector == null ? [] : [String(filters.sector)];
      const ok = matchesOptionalFacetAny(
        selected,
        scenario.sectors ?? [],
        (s) => s.name,
      );
      if (!ok) return false;
    }

    // Search term
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchFields = [
        scenario.name,
        scenario.description,
        scenario.pathwayType,
        scenario.modelYearNetzero,
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
