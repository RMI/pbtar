import { Scenario, SearchFilters } from "../types";
import {
  normalizeGeography,
  geographyLabel,
  sortGeographiesForDetails,
} from "./geographyUtils";

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
    if (filters.pathwayType && scenario.pathwayType !== filters.pathwayType) {
      return false;
    }

    // Target year filter
    if (
      filters.modelYearEnd &&
      scenario.modelYearEnd !== filters.modelYearEnd
    ) {
      return false;
    }

    // Target temperature filter
    if (
      filters.modelTempIncrease &&
      scenario.modelTempIncrease !== filters.modelTempIncrease
    ) {
      return false;
    }

    // Geography filter
    if (filters.geography) {
      const want = normalizeGeography(filters.geography).toUpperCase();
      const hit = (scenario.geography ?? []).some(
        (g) => normalizeGeography(g).toUpperCase() === want,
      );
      if (!hit) return false;
    }

    // Sector filter
    if (
      filters.sector &&
      !scenario.sectors.some((s) => s.name === filters.sector)
    ) {
      return false;
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
