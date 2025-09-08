import { describe, it, expect } from "vitest";
import { geographyKind, sortGeographiesForDetails } from "./geographyUtils";

// NOTE: These cover *classification only*. No label mapping assertions yet.
describe("geographyKind", () => {
  it("returns 'global' for Global (case-insensitive)", () => {
    expect(geographyKind("Global")).toBe("global");
    expect(geographyKind("global")).toBe("global");
  });

  it("returns 'country' for 2-letter codes that exist", () => {
    // Don't assert the mapped name here—mapping is out of scope for now
    expect(geographyKind("US")).toBe("country");
    expect(geographyKind("de")).toBe("country");
  });

  it("returns 'region' for anything else", () => {
    expect(geographyKind("Europe")).toBe("region");
    expect(geographyKind("APAC")).toBe("region");
    expect(geographyKind("")).toBe("region");
  });

  it("is defensive about non-strings", () => {
    // If you kept the String(...) coercion in the util, this stays stable
    expect(geographyKind(undefined as unknown as string)).toBe("region");
    expect(geographyKind(null as unknown as string)).toBe("region");
  });
});

describe("sortGeographiesForDetails", () => {
  it("orders Global, then regions (default order), then countries (A→Z)", () => {
    const input = ["US", "Global", "APAC", "DE", "Europe"];
    const out = sortGeographiesForDetails(input);
    // Regions stay in original order: APAC before Europe
    // Countries by label: (will be "DE" vs "US" until mapping -> "Germany" vs "United States")
    expect(out).toEqual(["Global", "APAC", "Europe", "DE", "US"]);
  });

  it("preserves default order among Regions", () => {
    const regions = ["Zeta Region", "Alpha Region", "Middle East"];
    const input = ["Global", ...regions, "US", "DE"];
    const out = sortGeographiesForDetails(input);
    expect(out.slice(1, 4)).toEqual(regions); // same order, not alphabetized
  });

  it("sorts Countries case-insensitively", () => {
    const input = ["us", "DE", "fr"];
    const out = sortGeographiesForDetails(input);
    expect(out).toEqual(["DE", "fr", "us"]); // A→Z by label/code (mapping comes later)
  });

  it("treats unknown 2-letter codes as Regions", () => {
    const input = ["ZZ", "Global", "US"];
    const out = sortGeographiesForDetails(input);
    // ZZ is not a known ISO-2 → Region bucket, before countries
    expect(out).toEqual(["Global", "ZZ", "US"]);
  });

  it("drops blanks (spaces, NBSP, zero-width)", () => {
    const input = ["", "  ", "\u00A0", "\u200B", "Global", "US"];
    const out = sortGeographiesForDetails(input);
    expect(out).toEqual(["Global", "US"]);
  });

  it("does not mutate the input array", () => {
    const input = ["US", "Global", "APAC", "DE"];
    const copy = [...input];
    sortGeographiesForDetails(input);
    expect(input).toEqual(copy);
  });

  it("is stable within buckets (keeps original order for same-kind ties)", () => {
    // Two regions and two countries with same first letter—regions keep order,
    // countries are alphabetized, but ties (identical labels) keep input order.
    const input = ["Region B", "Region A", "DE", "DK", "Global"];
    const out = sortGeographiesForDetails(input);
    expect(out).toEqual(["Global", "Region B", "Region A", "DE", "DK"]);
  });
});
