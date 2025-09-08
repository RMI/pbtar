import { Scenario, SearchFilters } from "../types";
import { geographyLabel } from "./geographyUtils";

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
    if (filters.geography && !scenario.geography.includes(filters.geography)) {
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
