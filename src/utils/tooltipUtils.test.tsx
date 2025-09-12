import { describe, test, expect } from "vitest";
import rawSchema from "../schema/schema.json";
import {
  pathwayTypeTooltips,
  sectorTooltips,
  getPathwayTypeTooltip,
  getSectorTooltip,
  unknownTooltip,
} from "./tooltipUtils";

const schema: unknown = rawSchema;

// ✅ Type guards to keep ESLint happy about "unsafe" usage
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

// Safe enum walker (no `any`, no unsafe access)
const getEnumAtPath = (root: unknown, path: readonly string[]): string[] => {
  // Walk the path safely and return [] if missing
  let node: unknown = root;
  for (const segment of path) {
    if (!isRecord(node) || !(segment in node)) return [];
    node = node[segment];
  }
  return isStringArray(node) ? node : [];
};

// ----------------------------------------
// Coverage helper
// ----------------------------------------

type CoverageOpts = {
  label: string;
  schemaValues: readonly string[];
  record: Record<string, string>;
  getter?: (v: string) => string;
};

const expectTooltipCoverage = (opts: CoverageOpts) => {
  const { label, schemaValues, record, getter } = opts;
  const fallback: string = unknownTooltip;

  describe(`${label} tooltip coverage`, () => {
    test("every schema enum value has a tooltip", () => {
      const missing = schemaValues.filter((v) => !(v in record));
      expect(missing).toEqual([]);
    });

    test("no extra keys in tooltip record (kept in sync with schema)", () => {
      const extras = Object.keys(record).filter(
        (k) => !schemaValues.includes(k),
      );
      expect(extras).toEqual([]);
    });

    test("all tooltips are non-empty strings", () => {
      const empties = Object.entries(record)
        .filter(([, val]) => typeof val !== "string" || val.trim().length === 0)
        .map(([k]) => k);
      expect(empties).toEqual([]);
    });

    test("all tooltips end with a period", () => {
      const bad = Object.entries(record)
        .filter(
          ([, val]) => typeof val === "string" && !val.trim().endsWith("."),
        )
        .map(([k]) => k);
      expect(bad).toEqual([]);
    });

    if (getter) {
      test("public getter never falls back for valid enum values", () => {
        const bad = schemaValues
          .map((v) => [v, getter(v)] as const)
          .filter(([, tip]) => tip === fallback);
        expect(bad).toEqual([]);
      });

      test("public getter falls back correctly with unknown value", () => {
        const bad = getter("___this_is_not_a_real_enum_value___");
        expect(bad).toEqual(fallback);
      });

      test("public getter outputs strings ending with period", () => {
        const bad = [...schemaValues, "___this_is_not_a_real_enum_value___"]
          .map((v) => [v, getter(v)] as const)
          .filter(
            ([, tip]) => typeof tip === "string" && !tip.trim().endsWith("."),
          );
        expect(bad).toEqual([]);
      });
    }
  });
};

// ----------------------------------------
// Checks
// ----------------------------------------
const CHECKS: Array<{
  label: string;
  schemaPath: readonly string[];
  record: Record<string, string>;
  getter?: (v: string) => string;
}> = [
  {
    label: "pathwayType",
    schemaPath: ["items", "properties", "pathwayType", "enum"] as const,
    record: pathwayTypeTooltips,
    getter: getPathwayTypeTooltip,
  },
  {
    label: "sectors.name",
    // schema.items.properties.sectors.items.properties.name.enum
    schemaPath: [
      "items",
      "properties",
      "sectors",
      "items",
      "properties",
      "name",
      "enum",
    ] as const,
    record: sectorTooltips,
    getter: getSectorTooltip,
  },
  // If/when you add tooltip Records for other enums, add them here:
  // ssp
  // metric
  // technologies
];

describe("Tooltip <-> JSON Schema enum integration", () => {
  CHECKS.forEach(({ label, schemaPath, record, getter }) => {
    const values = getEnumAtPath(schema, schemaPath);
    expectTooltipCoverage({
      label,
      schemaValues: values,
      record,
      getter,
    });
  });
});
