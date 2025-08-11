import { describe, it, expect } from "vitest";
import { filterScenarios } from "./searchUtils";
import { Scenario, SearchFilters } from "../types";

describe("searchUtils", () => {
  // Mock scenario data
  const mockScenarios: Scenario[] = [
    {
      id: "scenario-1",
      name: "Net Zero 2050",
      description:
        "A scenario describing the path to net zero emissions by 2050.",
      pathway_type: "Policy",
      modelYearEnd: "2050",
      modeled_temperature_increase: 1.5,
      regions: ["Global", "Europe"],
      sectors: [{ name: "Power" }, { name: "Transport" }],
      publisher: "IEA",
      publicationYear: "Jan 2023",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: true,
      },
    },
    {
      id: "scenario-2",
      name: "Current Policies",
      description: "A scenario based on current implemented policies.",
      pathway_type: "Projection",
      modelYearEnd: "2030",
      modeled_temperature_increase: 2.7,
      regions: ["Global", "Asia"],
      sectors: [
        {
          name: "Industrial",
        },
        { name: "Buildings" },
      ],
      publisher: "IPCC",
      publicationYear: "Mar 2022",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: false,
      },
    },
  ];

  describe("filterScenarios", () => {
    it("returns all scenarios when no filters are applied", () => {
      const emptyFilters: SearchFilters = {};
      const result = filterScenarios(mockScenarios, emptyFilters);

      expect(result).toEqual(mockScenarios);
      expect(result.length).toBe(2);
    });

    it("filters by pathway type", () => {
      const filters: SearchFilters = { pathway_type: "Policy" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("filters by target year", () => {
      const filters: SearchFilters = { modelYearEnd: "2030" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-2");
    });

    it("filters by modeled temperature increase", () => {
      const filters: SearchFilters = { modeled_temperature_increase: 1.5 };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("filters by region", () => {
      const filters: SearchFilters = { region: "Asia" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-2");
    });

    it("filters by sector", () => {
      const filters: SearchFilters = { sector: "Power" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("filters by search term in name", () => {
      const filters: SearchFilters = { searchTerm: "zero" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("filters by search term in description", () => {
      const filters: SearchFilters = { searchTerm: "current implemented" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-2");
    });

    it("filters by search term in sector tooltip", () => {
      const filters: SearchFilters = { searchTerm: "electricity" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("combines multiple filters", () => {
      const filters: SearchFilters = {
        modelYearEnd: "2050",
        region: "Europe",
      };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("scenario-1");
    });

    it("returns empty array when no scenarios match filters", () => {
      const filters: SearchFilters = {
        pathway_type: "Policy",
        modelYearEnd: "2030",
      };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it("handles empty search term", () => {
      const filters: SearchFilters = { searchTerm: "" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(2);
      expect(result).toEqual(mockScenarios);
    });

    it("handles whitespace-only search term", () => {
      const filters: SearchFilters = { searchTerm: "   " };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(2);
      expect(result).toEqual(mockScenarios);
    });
  });
});
