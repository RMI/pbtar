import { Scenario, SearchFilters } from "../types";

export const filterScenarios = (
  scenarios: Scenario[],
  filters: SearchFilters,
): Scenario[] => {
  return scenarios.filter((scenario) => {
    // Category filter
    if (filters.category && scenario.category !== filters.category) {
      return false;
    }

    // Target year filter
    if (filters.target_year && scenario.target_year !== filters.target_year) {
      return false;
    }

    // Target temperature filter
    if (
      filters.modeled_temperature_increase &&
      scenario.modeled_temperature_increase !==
        filters.modeled_temperature_increase
    ) {
      return false;
    }

    // Region filter
    if (filters.region && !scenario.regions.includes(filters.region)) {
      return false;
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
        scenario.category,
        scenario.target_year,
        scenario.modeled_temperature_increase,
        ...scenario.regions,
        ...scenario.sectors.map((s) => s.name),
        ...scenario.sectors.map((s) => s.tooltip || ""),
        scenario.publisher,
        scenario.published_date,
      ];

      return searchFields.some((field) =>
        String(field).toLowerCase().includes(searchTerm),
      );
    }

    return true;
  });
};
