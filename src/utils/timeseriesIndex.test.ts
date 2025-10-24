// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { datasetsForPathway, summarizeSummary } from "./timeseriesIndex";
import type { TimeseriesIndex } from "./timeseriesIndex";

describe("timeseriesIndex helpers", () => {
  it("datasetsForPathway returns empty for null index", () => {
    expect(datasetsForPathway(null, "foo")).toEqual([]);
  });

  it("datasetsForPathway returns items for a pathway", () => {
    const idx: TimeseriesIndex = {
      byPathway: {
        "ACE-BAS-2024": [
          {
            datasetId: "ACE-BAS-2024_TS",
            path: "/data/BAS-2024_timeseries.json",
          },
        ],
      },
      byDataset: {
        "ACE-BAS-2024_TS": {
          datasetId: "ACE-BAS-2024_TS",
          pathwayIds: ["ACE-BAS-2024"],
          path: "/data/BAS-2024_timeseries.json",
        },
      },
      schema: { version: 1, generatedAt: new Date().toISOString() },
    };

    expect(datasetsForPathway(idx, "ACE-BAS-2024")).toEqual([
      { datasetId: "ACE-BAS-2024_TS", path: "/data/BAS-2024_timeseries.json" },
    ]);
    expect(datasetsForPathway(idx, "NOPE")).toEqual([]);
  });

  it("summarizeSummary prints yearRange, sectors, geographies, rows", () => {
    const s = summarizeSummary({
      yearRange: [1990, 2050],
      sectorCount: 5,
      geographyCount: 3,
      rowCount: 1620,
    });
    expect(s).toContain("1990");
    expect(s).toContain("2050");
    expect(s).toContain("5 sectors");
    expect(s).toContain("3 geographies");
    expect(s).toContain("1620 rows");
  });

  it("summarizeSummary tolerates partial objects", () => {
    // missing fields -> defined but concise
    const s = summarizeSummary({ yearRange: [2000, 2010] });
    expect(s).toBe("2000 → 2010");
  });

  it("summarizeSummary returns undefined for empty/unknown shapes", () => {
    expect(summarizeSummary(null)).toBeUndefined();
    expect(summarizeSummary({})).toBeUndefined();
    expect(summarizeSummary({ foo: "bar" })).toBeUndefined();
  });
});
