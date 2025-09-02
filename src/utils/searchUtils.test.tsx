import { describe, it, expect } from "vitest";
import { filterScenarios } from "./searchUtils";
import { Scenario, SearchFilters } from "../types";

import rawScenarioArray from "../../testdata/valid/scenarios_metadata_sample_array.json" assert { type: "json" };
const mockScenarios: Scenario[] = rawScenarioArray;

describe("searchUtils", () => {
  // Mock scenario data

  describe("filterScenarios", () => {
    it("returns all scenarios when no filters are applied", () => {
      const emptyFilters: SearchFilters = {};
      const result = filterScenarios(mockScenarios, emptyFilters);

      expect(result).toEqual(mockScenarios);
    });

    it("filters by pathway type", () => {
      const filters: SearchFilters = { pathwayType: "Exploratory" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-02");
    });

    it("filters by target year", () => {
      const filters: SearchFilters = { modelYearEnd: 2050 };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(3);
      expect(result.map((x) => x.id)).toEqual([
        "sample-01",
        "sample-02",
        "sample-04",
      ]);
    });

    it("filters by modeled temperature increase", () => {
      const filters: SearchFilters = { modelTempIncrease: 1 };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("filters by region", () => {
      const filters: SearchFilters = { region: "Global" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("filters by sector", () => {
      const filters: SearchFilters = { sector: "Agriculture" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-02");
    });

    it("filters by search term in name", () => {
      const filters: SearchFilters = { searchTerm: "Scenario 01" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("filters by search term in description", () => {
      const filters: SearchFilters = { searchTerm: "qwerty description" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("combines multiple filters", () => {
      const filters: SearchFilters = {
        pathwayType: "Normative",
        region: "Global",
      };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("returns empty array when no scenarios match filters", () => {
      const filters: SearchFilters = {
        pathwayType: "Policy",
        modelYearEnd: "2030",
      };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it("handles empty search term", () => {
      const filters: SearchFilters = { searchTerm: "" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(mockScenarios.length);
      expect(result).toEqual(mockScenarios);
    });

    it("handles whitespace-only search term", () => {
      const filters: SearchFilters = { searchTerm: "   " };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(mockScenarios.length);
      expect(result).toEqual(mockScenarios);
    });
  });

  describe("Schema compliance scenarios", () => {
    it("returns matches on extant fields", () => {
      const filters: SearchFilters = {
        publisher: "Example Publisher",
      };

      const result = filterScenarios(mockScenarios, filters);
      expect(result.length).toBe(mockScenarios.length);
      expect(result).toEqual(mockScenarios);
    });

    it("safely omits results for non-existing fields", () => {
      //scenario 3 in the mock data has no modelYearEnd
      const filters: SearchFilters = {
        modelYearEnd: 2050,
      };

      const result = filterScenarios(mockScenarios, filters);
      expect(result.length).toBe(3);
      expect(result.map((x) => x.id)).toEqual([
        "sample-01",
        "sample-02",
        "sample-04",
      ]);
    });
  });
});

import rawFullScenarioArray from "../../testdata/valid/scenarios_metadata_full.json" assert { type: "json" };
const mockFullScenarios: Scenario[] = rawFullScenarioArray;

describe("searchUtils - array results", () => {
  //
  // Mock scenario data
  const regions: string[] = [
    "Global",
    "EU",
    "Americas",
    "Asia Pacific",
    "SEA",
    "Country-Specific",
  ];

  const sectors: string[] = [
    "Land Use",
    "Agriculture",
    "Buildings",
    "Industry",
    "Steel",
    "Cement",
    "Chemicals",
    "Coal Mining",
    "Oil (Upstream)",
    "Gas (Upstream)",
    "Power",
    "Transport",
    "Road transport",
    "Aviation",
    "Rail",
    "Shipping",
    "Other",
  ];

  //These tests are to ensure that search works for all array values, even when
  //they would not be surface directly in the UI (e.g. "Power, Transport, + 15
  //more")
  describe("filterScenarios for many array values", () => {
    regions.forEach((region) => {
      it(`options for regions - ${region}`, () => {
        const filters: SearchFilters = { region: region };
        const result = filterScenarios(mockFullScenarios, filters);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe("scenario-simple-full");
      });
    });

    sectors.forEach((sector) => {
      it(`filters by sector - ${sector}`, () => {
        const filters: SearchFilters = { sector: sector };
        const result = filterScenarios(mockFullScenarios, filters);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe("scenario-simple-full");
      });
    });
  });
});
