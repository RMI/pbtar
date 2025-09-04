import {
  pathwayTypeTooltips,
  sectorTooltips,
  getPathwayTypeTooltip,
  getSectorTooltip,
} from "./tooltipUtils";

const expectTooltipCoverage = (opts: {
  label: string;
  record: Record<string, string>;
  getter: (v: any) => string;
}) => {
  const { label, record, getter } = opts;

  describe(`${label} tooltip coverage`, () => {
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
  record: Record<string, string>;
  getter?: (v: string) => string;
}> = [
  {
    label: "pathwayType",
    record: pathwayTypeTooltips,
    getter: getPathwayTypeTooltip,
  },
  {
    label: "sectors.name",
    record: sectorTooltips,
    getter: getSectorTooltip,
  },
];

describe("Tooltip <-> JSON Schema enum integration", () => {
  CHECKS.forEach(({ label, record, getter }) => {
    // Guard to make debugging clearer if path breaks

    expectTooltipCoverage({
      label,
      record,
      getter,
    });
  });
});
