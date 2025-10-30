import { describe, it, expect } from "vitest";
import { validateDataCollect, FileEntry } from "./validateData";
import { PathwayMetadataType } from "../types";
import pathwayMetadata from "../schema/pathwayMetadata.v1.json" with { type: "json" };

function ok(entry: FileEntry | FileEntry[]) {
  const arr = Array.isArray(entry) ? entry : [entry];
  const { valid, invalid } = validateDataCollect(arr, pathwayMetadata);
  expect(valid.length).toBeGreaterThan(0);
  expect(invalid.length).toBe(0);
}

function fail(entry: FileEntry | FileEntry[], rx?: RegExp | string) {
  const arr = Array.isArray(entry) ? entry : [entry];
  const rawValidation = validateDataCollect(arr, pathwayMetadata);
  const invalid = rawValidation.invalid;
  expect(invalid.length).toBeGreaterThan(0);
  if (rx) {
    const messages = invalid.flatMap((p) => p.errors).join("\n");
    expect(messages).toMatch(rx);
  }
}

import basePathway from "../../testdata/valid/pathwayMetadata_standard.json" assert { type: "json" };

describe("pathway schema enforces expected limits", () => {
  it("accepts a valid object", () => {
    ok({ name: "ok.json", data: basePathway });
  });

  it("fails when field is wrong type", () => {
    fail(
      {
        name: "start.json",
        data: {
          ...basePathway,
          modelYearStart: "1950" as string, // should be a number
        },
      },
      /modelYearStart/,
    );
  });

  it("accepts boundaries", () => {
    ok({
      name: "bounds.json",
      data: {
        ...basePathway,
        modelYearStart: 1900,
        modelYearEnd: 2100,
        publicationYear: 2030,
        modelYearNetzero: 2030,
        carbonBudget: 0,
        modelTempIncrease: 0.5, // min
        ssp: "SSP5",
        geography: ["EU"],
      },
    });
  });

  it("accepts multiple items & unique geography", () => {
    ok([
      {
        name: "multi.json",
        data: { ...basePathway },
      },
      {
        name: "multi.json",
        data: {
          ...basePathway,
          id: "scn-2",
          name: "Other",
          geography: ["Global", "EU"],
        },
      },
    ]);
  });

  const REQ = [
    "id",
    "name",
    "description",
    "pathwayType",
    "geography",
    "sectors",
    "publisher",
    "publicationYear",
    "expertOverview",
    "dataSource",
  ];

  for (const key of REQ) {
    it(`fails when required property '${key}' is missing`, () => {
      const rest = { ...basePathway };
      delete (rest as PathwayMetadataType)[key]; // remove the key
      fail({ name: "missing.json", data: rest }, new RegExp(`${key}`));
    });
  }

  it("fails on invalid pathwayType enum", () => {
    fail(
      {
        name: "pathwayType.json",
        data: { ...basePathway, pathwayType: "Wrong" },
      },
      /pathwayType/,
    );
  });

  it("fails on invalid SSP enum", () => {
    fail(
      {
        name: "ssp.json",
        data: { ...basePathway, ssp: "SSP6" },
      },
      /ssp/,
    );
  });

  it("enforces maxLength for short strings", () => {
    const long = "x".repeat(101);
    fail(
      {
        name: "maxlength.json",
        data: { ...basePathway, name: long },
      },
      /name must NOT have more than 100 characters/,
    );
  });

  it("fails when modelYearStart < 1900", () => {
    fail(
      {
        name: "start.json",
        data: { ...basePathway, modelYearStart: 1899 },
      },
      /modelYearStart/,
    );
  });

  it("fails when modelYearEnd > 2100", () => {
    fail(
      {
        name: "end.json",
        data: { ...basePathway, modelYearEnd: 2101 },
      },
      /modelYearEnd/,
    );
  });

  it("fails when modelYearNetzero present but < 2030", () => {
    fail(
      {
        name: "netzero.json",
        data: { ...basePathway, modelYearNetzero: 2029 },
      },
      /modelYearNetzero/,
    );
  });

  it("fails when modelTempIncrease not multiple of 0.1", () => {
    fail(
      {
        name: "temp.json",
        data: { ...basePathway, modelTempIncrease: 0.55 },
      },
      /multiple of/,
    );
  });

  it("fails when geography has duplicates (uniqueItems)", () => {
    fail(
      {
        name: "geography.json",
        data: { ...basePathway, geography: ["EU", "EU"] },
      },
      /must NOT have duplicate items/,
    );
  });

  it("fails when sectors item missing required fields", () => {
    fail(
      {
        name: "sectors.json",
        data: {
          ...basePathway,
          sectors: [{ name: "Power" }], // missing technologies
        },
      },
      /required.*technologies/i,
    );
  });

  it("fails when unknown sector name", () => {
    fail(
      {
        name: "sector-name.json",
        data: {
          ...basePathway,
          sectors: [{ name: "Yak Shaving", technologies: ["Other"] }],
        },
      },
      /must be equal to one of the allowed values/,
    );
  });

  it("fails when technology not in enum", () => {
    fail(
      {
        name: "tech.json",
        data: {
          ...basePathway,
          sectors: [{ name: "Power", technologies: ["Cold Fusion"] }],
        },
      },
      /must be equal to one of the allowed values/,
    );
  });

  it("fails on extra unknown top-level property", () => {
    fail(
      {
        name: "extra-top.json",
        data: { ...basePathway, foobar: 1 } as PathwayMetadataType,
      },
      /must NOT have additional properties/,
    );
  });

  it("fails on extra property inside sectors[*] object", () => {
    fail(
      {
        name: "extra-sector.json",
        data: {
          ...basePathway,
          sectors: [{ name: "Power", technologies: ["Solar"], foobar: 1 }],
        },
      },
      /must NOT have additional properties/,
    );
  });

  it("fails on extra property in dataSource", () => {
    fail(
      {
        name: "extra-ds.json",
        data: {
          ...basePathway,
          dataSource: { ...basePathway.dataSource, foobar: "x" },
        },
      },
      /must NOT have additional properties/,
    );
  });
});
