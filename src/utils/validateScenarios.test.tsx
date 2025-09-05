import { describe, it, expect } from "vitest";
import { promises as fs } from "node:fs";
import { resolve, join } from "node:path";
import { validateScenarios, FileEntry } from "./validateScenarios";
import { Scenario } from "../types";

function ok(entry: FileEntry) {
  expect(() => validateScenarios([entry])).not.toThrow();
}

function fail(entry: FileEntry, rx: RegExp | string) {
  expect(() => validateScenarios([entry])).toThrowError(rx);
}

describe("validate files on disk", () => {
  it("all src/data/*.json data files conform to schema", async () => {
    const dir = resolve(__dirname, "../data");
    const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    const entries: FileEntry[] = await Promise.all(
      names.map(async (name) => ({
        name,
        data: JSON.parse(await fs.readFile(join(dir, name), "utf8")) as
          | Scenario[]
          | unknown[],
      })),
    );
    expect(() => validateScenarios(entries)).not.toThrow();
  });

  it("all testdata/valid/*.json data files conform to schema", async () => {
    const dir = resolve(__dirname, "../../testdata/valid");
    const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    const entries: FileEntry[] = await Promise.all(
      names.map(async (name) => ({
        name,
        data: JSON.parse(await fs.readFile(join(dir, name), "utf8")) as
          | Scenario[]
          | unknown[],
      })),
    );
    expect(() => validateScenarios(entries)).not.toThrow();
  });
});

import rawScenarioArray from "../../testdata/valid/scenarios_metadata_standard.json" assert { type: "json" };
const baseScenario: Scenario = rawScenarioArray[0];

describe("scenario schema enforces expected limits", () => {
  it("accepts a minimal valid array (minItems=1)", () => {
    ok({ name: "ok.json", data: [baseScenario] });
  });

  it("fails when the array is empty (minItems=1)", () => {
    fail({ name: "empty.json", data: [] }, /must NOT have fewer than/);
  });

  // Type guard: data must be an array of objects
  it("fails when top-level is not an array", () => {
    fail(
      { name: "not-array.json", data: { ...baseScenario } as Scenario },
      /must be array/i,
    );
  });

  it("fails when field is wrong type", () => {
    fail(
      {
        name: "start.json",
        data: [
          {
            ...baseScenario,
            modelYearStart: "1950" as string, // should be a number
          },
        ],
      },
      /modelYearStart/,
    );
  });

  it("accepts boundaries", () => {
    ok({
      name: "bounds.json",
      data: [
        {
          ...baseScenario,
          modelYearStart: 1900,
          modelYearEnd: 2100,
          publicationYear: 2030,
          modelYearNetzero: 2030,
          carbonBudget: 0,
          modelTempIncrease: 0.5, // min
          ssp: "SSP5",
          regions: ["EU"],
        },
      ],
    });
  });

  it("accepts multiple items & unique regions", () => {
    ok({
      name: "multi.json",
      data: [
        baseScenario,
        {
          ...baseScenario,
          id: "scn-2",
          name: "Other",
          regions: ["Global", "EU"],
        },
      ],
    });
  });

  const REQ = [
    "id",
    "name",
    "description",
    "pathwayType",
    "regions",
    "sectors",
    "publisher",
    "publicationYear",
    "overview",
    "expertRecommendation",
    "dataSource",
  ];

  for (const key of REQ) {
    it(`fails when required property '${key}' is missing`, () => {
      const rest = { ...baseScenario };
      delete (rest as Scenario)[key]; // remove the key
      fail({ name: "missing.json", data: [rest] }, new RegExp(`${key}`));
    });
  }

  it("fails on invalid pathwayType enum", () => {
    fail(
      {
        name: "pathwayType.json",
        data: [{ ...baseScenario, pathwayType: "Wrong" }],
      },
      /pathwayType/,
    );
  });

  it("fails on invalid SSP enum", () => {
    fail(
      {
        name: "ssp.json",
        data: [{ ...baseScenario, ssp: "SSP6" }],
      },
      /ssp/,
    );
  });

  it("enforces maxLength for short strings", () => {
    const long = "x".repeat(101);
    fail(
      {
        name: "maxlength.json",
        data: [{ ...baseScenario, name: long }],
      },
      /name must NOT have more than 100 characters/,
    );
  });

  it("fails when modelYearStart < 1900", () => {
    fail(
      {
        name: "start.json",
        data: [{ ...baseScenario, modelYearStart: 1899 }],
      },
      /modelYearStart/,
    );
  });

  it("fails when modelYearEnd > 2100", () => {
    fail(
      {
        name: "end.json",
        data: [{ ...baseScenario, modelYearEnd: 2101 }],
      },
      /modelYearEnd/,
    );
  });

  it("fails when modelYearNetzero present but < 2030", () => {
    fail(
      {
        name: "netzero.json",
        data: [{ ...baseScenario, modelYearNetzero: 2029 }],
      },
      /modelYearNetzero/,
    );
  });

  it("fails when modelTempIncrease not multiple of 0.1", () => {
    fail(
      {
        name: "temp.json",
        data: [{ ...baseScenario, modelTempIncrease: 0.55 }],
      },
      /multiple of/,
    );
  });

  it("fails when regions has duplicates (uniqueItems)", () => {
    fail(
      {
        name: "regions.json",
        data: [{ ...baseScenario, regions: ["EU", "EU"] }],
      },
      /must NOT have duplicate items/,
    );
  });

  it("fails when sectors item missing required fields", () => {
    fail(
      {
        name: "sectors.json",
        data: [
          {
            ...baseScenario,
            sectors: [{ name: "Power" }], // missing technologies
          },
        ],
      },
      /required.*technologies/i,
    );
  });

  it("fails when unknown sector name", () => {
    fail(
      {
        name: "sector-name.json",
        data: [
          {
            ...baseScenario,
            sectors: [{ name: "Yak Shaving", technologies: ["Other"] }],
          },
        ],
      },
      /must be equal to one of the allowed values/,
    );
  });

  it("fails when technology not in enum", () => {
    fail(
      {
        name: "tech.json",
        data: [
          {
            ...baseScenario,
            sectors: [{ name: "Power", technologies: ["Cold Fusion"] }],
          },
        ],
      },
      /must be equal to one of the allowed values/,
    );
  });

  it("fails on extra unknown top-level property", () => {
    fail(
      {
        name: "extra-top.json",
        data: [{ ...baseScenario, foobar: 1 } as Scenario],
      },
      /must NOT have additional properties/,
    );
  });

  it("fails on extra property inside sectors[*] object", () => {
    fail(
      {
        name: "extra-sector.json",
        data: [
          {
            ...baseScenario,
            sectors: [{ name: "Power", technologies: ["Solar"], foobar: 1 }],
          },
        ],
      },
      /must NOT have additional properties/,
    );
  });

  it("fails on extra property in dataSource", () => {
    fail(
      {
        name: "extra-ds.json",
        data: [
          {
            ...baseScenario,
            dataSource: { ...baseScenario.dataSource, foobar: "x" },
          },
        ],
      },
      /must NOT have additional properties/,
    );
  });
});
