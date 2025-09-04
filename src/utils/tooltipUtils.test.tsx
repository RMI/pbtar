import schema from "../schema/schema.json";
import {
  pathwayTypeTooltips,
  sectorTooltips,
  getPathwayTypeTooltip,
  getSectorTooltip,
  unknownTooltip,
} from "./tooltipUtils";

type Json = Record<string, any>;

const getEnumAtPath = (root: Json, path: string[]): string[] => {
  // Walk the path safely and return [] if missing
  let node: any = root;
  for (const segment of path) {
    if (!node || typeof node !== "object" || !(segment in node)) return [];
    node = node[segment];
  }
  return Array.isArray(node) ? node : [];
};

const expectTooltipCoverage = (opts: {
  label: string;
  schemaValues: string[];
  record: Record<string, string>;
  getter: (v: any) => string;
}) => {
  const { label, schemaValues, record, getter } = opts;
  const fallback = unknownTooltip;

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

      test("public getter correctly ends with period", () => {
        const bad = [schemaValues, "___this_is_not_a_real_enum_value___"]
          .flat()
          .map((v) => [v, getter(v)] as const)
          .filter(
            ([, tip]) => typeof tip === "string" && !tip.trim().endsWith("."),
          );
        expect(bad).toEqual([]);
      });
    }

    test("all tooltips end with a period", () => {
      const bad = Object.entries(record)
        .filter(
          ([, val]) => typeof val === "string" && !val.trim().endsWith("."),
        )
        .map(([k]) => k);
      expect(bad).toEqual([]);
    });
  });
};

const CHECKS: Array<{
  label: string;
  schemaPath: string[];
  record: Record<string, string>;
  getter?: (v: string) => string;
}> = [
  {
    label: "pathwayType",
    // schema.items.properties.pathwayType.enum
    schemaPath: ["items", "properties", "pathwayType", "enum"],
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
    ],
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
    const values = getEnumAtPath(schema as Json, schemaPath);

    expectTooltipCoverage({
      label,
      schemaValues: values,
      record,
      getter,
    });
  });
});
