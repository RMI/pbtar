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
    if (filters.targetYear && scenario.targetYear !== filters.targetYear) {
      return false;
    }

    // Target temperature filter
    if (
      filters.targetTemperature &&
      scenario.targetTemperature !== filters.targetTemperature
    ) {
      return false;
    }

    // Region filter
    if (filters.region && !scenario.regions.includes(filters.region)) {
      return false;
    }

    // Sector filter
    if (filters.sector && !scenario.sectors.includes(filters.sector)) {
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
        scenario.target_temperature,
        ...scenario.regions,
        ...scenario.sectors,
        scenario.publisher,
        scenario.published_date,
        scenario.overview,
        scenario.expertRecommendation,
      ];

      return searchFields.some((field) =>
        field.toLowerCase().includes(searchTerm),
      );
    }

    return true;
  });
};
