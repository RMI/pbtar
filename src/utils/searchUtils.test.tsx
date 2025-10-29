import { describe, it, expect } from "vitest";
import { filterScenarios } from "./searchUtils";
import type { FiltersWithArrays } from "./searchUtils";
import { ABSENT_FILTER_TOKEN } from "./absent";
import { Scenario, SearchFilters } from "../types";

import sample01 from "../../testdata/valid/pathwayMetadata_sample_01.json" assert { type: "json" };
import sample02 from "../../testdata/valid/pathwayMetadata_sample_02.json" assert { type: "json" };
import sample03 from "../../testdata/valid/pathwayMetadata_sample_03.json" assert { type: "json" };
import sample04 from "../../testdata/valid/pathwayMetadata_sample_04.json" assert { type: "json" };
const mockScenarios: Scenario[] = [sample01, sample02, sample03, sample04];

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
      const filters: SearchFilters = { modelYearNetzero: 2050 };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(2);
      expect(result.map((x) => x.id)).toEqual(["sample-01", "sample-04"]);
    });

    it("filters by modeled temperature increase", () => {
      const filters: SearchFilters = { modelTempIncrease: 1 };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("filters by geography", () => {
      const filters: SearchFilters = { geography: "Global" };
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

    it("filters by metric", () => {
      const filters: SearchFilters = { metric: "Capacity" };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(2);
      expect(result.map((x) => x.id)).toEqual(["sample-01", "sample-02"]);
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
        geography: "Global",
      };
      const result = filterScenarios(mockScenarios, filters);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe("sample-01");
    });

    it("returns empty array when no scenarios match filters", () => {
      const filters: SearchFilters = {
        pathwayType: "Policy",
        modelYearNetzero: "2030",
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
      //scenario 3 in the mock data has no modelYearNetzero
      const filters: SearchFilters = {
        modelYearNetzero: 2050,
      };

      const result = filterScenarios(mockScenarios, filters);
      expect(result.length).toBe(2);
      expect(result.map((x) => x.id)).toEqual(["sample-01", "sample-04"]);
    });
  });
});

import rawFullScenario from "../../testdata/valid/pathwayMetadata_full.json" assert { type: "json" };
const mockFullScenarios: Scenario[] = [rawFullScenario];

describe("searchUtils - array results", () => {
  //
  // Mock scenario data
  const geography: string[] = [
    "Global",
    "EU",
    "Americas",
    "Asia Pacific",
    "US",
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
    geography.forEach((geography) => {
      it(`options for geography - ${geography}`, () => {
        const filters: SearchFilters = { geography: geography };
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

describe("filterScenarios (array-backed facets)", () => {
  const scenarios: Scenario[] = [
    {
      id: "A",
      name: "A",
      sectors: undefined,
      geography: undefined,
      modelTempIncrease: undefined,
      pathwayType: undefined,
      modelYearNetzero: undefined,
      publisher: undefined,
      publicationYear: undefined,
      description: undefined,
    },
    {
      id: "B",
      name: "B",
      sectors: [{ name: "Power" }],
      geography: ["Europe"],
      modelTempIncrease: 2.0,
      pathwayType: "Direct Policy",
      modelYearNetzero: 2040,
      publisher: "X",
      publicationYear: 2020,
      description: "",
    },
    {
      id: "C",
      name: "C",
      sectors: [{ name: "Industry" }],
      geography: ["Asia"],
      modelTempIncrease: 1.5,
      pathwayType: "Exploratory",
      modelYearNetzero: 2030,
      publisher: "X",
      publicationYear: 2020,
      description: "",
    },
  ];

  it("pathwayType: OR over multiple selections; empty array = no filter", () => {
    let out = filterScenarios(scenarios, {
      pathwayType: ["Direct Policy", "Exploratory"],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["B", "C"]);

    out = filterScenarios(scenarios, { pathwayType: [] } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["A", "B", "C"]);
  });

  it("pathwayType: ABSENT token matches missing value only", () => {
    const out = filterScenarios(scenarios, {
      pathwayType: [ABSENT_FILTER_TOKEN],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["A"]);
  });

  it("numeric (modelYearNetzero): OR over numbers, with ABSENT", () => {
    let out = filterScenarios(scenarios, {
      modelYearNetzero: [2040, 2030],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["B", "C"]);
    out = filterScenarios(scenarios, {
      modelYearNetzero: [2040, ABSENT_FILTER_TOKEN],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["A", "B"]);
    out = filterScenarios(scenarios, {
      modelYearNetzero: [ABSENT_FILTER_TOKEN],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["A"]);
    out = filterScenarios(scenarios, {
      modelYearNetzero: [9999],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual([]);
  });

  it("numeric (temperature): OR over numbers, with ABSENT", () => {
    let out = filterScenarios(scenarios, {
      modelTempIncrease: [1.5, 2.0],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["B", "C"]);
    out = filterScenarios(scenarios, {
      modelTempIncrease: [ABSENT_FILTER_TOKEN],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["A"]);
  });

  it("geography: ALL mode requires all tokens; ANY is default", () => {
    // Add a scenario with two geos
    const many: Scenario[] = [
      ...scenarios,
      {
        ...scenarios[1],
        id: "B2",
        name: "B2",
        geography: ["Europe", "Asia"],
      },
    ];
    // ANY (default): Europe OR Asia → B, C, B2
    let out = filterScenarios(many, {
      geography: ["Europe", "Asia"],
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["B", "C", "B2"]);
    // ALL: must have both → only B2
    out = filterScenarios(many, {
      geography: ["Europe", "Asia"],
      modes: { geography: "ALL" },
    } as FiltersWithArrays);
    expect(out.map((s) => s.id)).toEqual(["B2"]);
  });

  it("pathwayType: ALL with two tokens yields no results (single-valued facet)", () => {
    const out = filterScenarios(
      [
        {
          id: "A",
          name: "A",
          sectors: [],
          geography: [],
          modelTempIncrease: 2,
          pathwayType: "Net Zero",
          modelYearNetzero: 2050,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
        {
          id: "B",
          name: "B",
          sectors: [],
          geography: [],
          modelTempIncrease: 1.5,
          pathwayType: "BAU",
          modelYearNetzero: 2030,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
      ] as Scenario[],
      { pathwayType: ["Net Zero", "BAU"], modes: { pathwayType: "ALL" } },
    );
    expect(out).toHaveLength(0);
  });

  it("modelYearNetzero: ALL with [2030,2050] yields no results (single-valued facet)", () => {
    const out = filterScenarios(
      [
        {
          id: "A",
          name: "A",
          sectors: [],
          geography: [],
          modelTempIncrease: 2,
          pathwayType: "X",
          modelYearNetzero: 2030,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
        {
          id: "B",
          name: "B",
          sectors: [],
          geography: [],
          modelTempIncrease: 2,
          pathwayType: "Y",
          modelYearNetzero: 2050,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
      ] as Scenario[],
      { modelYearNetzero: [2030, 2050], modes: { modelYearNetzero: "ALL" } },
    );
    expect(out).toHaveLength(0);
  });

  it("modelTempIncrease: ALL with [1.5,2.0] yields no results (single-valued facet)", () => {
    const out = filterScenarios(
      [
        {
          id: "A",
          name: "A",
          sectors: [],
          geography: [],
          modelTempIncrease: 1.5,
          pathwayType: "X",
          modelYearNetzero: 2030,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
        {
          id: "B",
          name: "B",
          sectors: [],
          geography: [],
          modelTempIncrease: 2.0,
          pathwayType: "Y",
          modelYearNetzero: 2050,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
      ] as Scenario[],
      { modelTempIncrease: [1.5, 2.0], modes: { modelTempIncrease: "ALL" } },
    );
    expect(out).toHaveLength(0);
  });

  it("single-valued facets: ALL with one token behaves like equality; ABSENT-only matches null", () => {
    const out1 = filterScenarios(
      [
        {
          id: "A",
          name: "A",
          sectors: [],
          geography: [],
          modelTempIncrease: null,
          pathwayType: null,
          modelYearNetzero: null,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
      ] as Scenario[],
      { pathwayType: [ABSENT_FILTER_TOKEN], modes: { pathwayType: "ALL" } },
    );
    expect(out1.map((s) => s.id)).toEqual(["A"]);

    const out2 = filterScenarios(
      [
        {
          id: "B",
          name: "B",
          sectors: [],
          geography: [],
          modelTempIncrease: 2.0,
          pathwayType: "Net Zero",
          modelYearNetzero: 2030,
          publisher: "",
          publicationYear: 2020,
          description: "",
        },
      ] as Scenario[],
      { modelTempIncrease: [2.0], modes: { modelTempIncrease: "ALL" } },
    );
    expect(out2.map((s) => s.id)).toEqual(["B"]);
  });
});
