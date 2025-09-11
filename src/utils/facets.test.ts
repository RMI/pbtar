import { describe, it, expect } from "vitest";
import { buildOptionsFromValues, matchesOptionalFacet } from "./facets";
import { ABSENT_FILTER_TOKEN } from "./absent";

describe("buildOptionsFromValues", () => {
  it("dedupes and sorts by label by default", () => {
    const options = buildOptionsFromValues(["b", "a", "b"]);
    expect(options.map((o) => o.label)).toEqual(["a", "b"]);
    expect(options.map((o) => o.value)).toEqual(["a", "b"]);
  });

  it("preserves numeric values and 0", () => {
    const options = buildOptionsFromValues([2030, 0, 2020, 0]);
    expect(options.map((o) => o.value)).toEqual([0, 2020, 2030]);
  });

  it("includes ABSENT bucket when null/undefined are present", () => {
    const options = buildOptionsFromValues(["2°C", undefined, "1.5°C", null]);
    const last = options[options.length - 1];
    expect(last.value).toBe(ABSENT_FILTER_TOKEN);
    expect(last.label).toBe("None");
  });

  it("can force include ABSENT even if not present", () => {
    const options = buildOptionsFromValues(["2°C", "1.5°C"], {
      forceIncludeAbsent: true,
    });
    expect(options.some((o) => o.value === ABSENT_FILTER_TOKEN)).toBe(true);
  });

  it("accepts custom labeler and noneLabel", () => {
    const options = buildOptionsFromValues([2030, 2050, null], {
      makeLabel: (y) => `${y} target`,
      noneLabel: "Unspecified",
    });

    const labels = options.map((o) => o.label);
    expect(labels).toContain("2030 target");
    expect(labels).toContain("2050 target");
    expect(labels).toContain("Unspecified");
  });

  it("can disable sorting", () => {
    const options = buildOptionsFromValues(["b", "a"], { sort: false });
    expect(options.map((o) => o.label)).toEqual(["b", "a"]);
  });
});

describe("matchesOptionalFacet", () => {
  it("matches absent when __ABSENT__ is selected", () => {
    expect(matchesOptionalFacet([ABSENT_FILTER_TOKEN], undefined)).toBe(true);
    expect(matchesOptionalFacet([ABSENT_FILTER_TOKEN], null)).toBe(true);
    expect(matchesOptionalFacet([ABSENT_FILTER_TOKEN], "2°C")).toBe(false);
  });

  it("matches concrete values when present", () => {
    expect(matchesOptionalFacet(["2°C"], "2°C")).toBe(true);
    expect(matchesOptionalFacet(["2°C"], "1.5°C")).toBe(false);
    expect(matchesOptionalFacet(["2°C"], undefined)).toBe(false);
  });

  it("supports mixed selections (concrete + __ABSENT__)", () => {
    expect(matchesOptionalFacet(["2°C", ABSENT_FILTER_TOKEN], undefined)).toBe(
      true,
    );
    expect(matchesOptionalFacet(["2°C", ABSENT_FILTER_TOKEN], "2°C")).toBe(
      true,
    );
    expect(matchesOptionalFacet(["2°C", ABSENT_FILTER_TOKEN], "1.5°C")).toBe(
      false,
    );
  });
});
