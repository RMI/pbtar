import { describe, it, expect } from "vitest";
import {
  geographyKind,
  sortGeographiesForDetails,
  normalizeGeography,
  assertKnownCountryISO2,
} from "./geographyUtils";
import { makeGeographyOptions } from "./searchUtils";
import type { PathwayMetadataType } from "../types";

describe("normalizeGeography", () => {
  it("normalizeGeography drops zero-width and NBSP then trims", () => {
    expect(normalizeGeography("\u200B CN \u00A0")).toBe("CN");
  });
});

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

describe("assertKnownCountryISO2 (strict ISO2 validation)", () => {
  it("throws for a 2-letter code that doesn't map to a country (EU)", () => {
    expect(() => assertKnownCountryISO2("EU")).toThrow(/unknown iso-?2/i);
  });

  it("returns normalized ISO2 for valid codes", () => {
    expect(assertKnownCountryISO2("cn")).toBe("CN");
    expect(assertKnownCountryISO2("US")).toBe("US");
  });

  it("throws for non-ISO2 inputs", () => {
    expect(() => assertKnownCountryISO2("Europe")).toThrow(/not an iso-?2/i);
  });
});

const mkPathway = (id: string, geography: string[]): PathwayMetadataType =>
  ({
    id,
    name: `Pathway ${id}`,
    description: "",
    pathwayType: "Mitigation",
    modelYearEnd: 2050,
    modelTempIncrease: 1.5,
    geography,
    sectors: [],
    publisher: "RMI",
    publicationYear: 2024,
  }) as unknown as PathwayMetadataType;

describe("makeGeographyOptions", () => {
  it("uses full names for ISO2 and preserves badge ordering", () => {
    const pathways = [
      mkPathway("A", ["US", "Europe", "Global"]),
      mkPathway("B", ["DE", "APAC", "CN"]),
      mkPathway("C", ["US"]), // duplicate, should be deduped
    ];

    const opts = makeGeographyOptions(pathways);

    // Expect order: Global → Regions (first-seen order: Europe, APAC) → Countries (A→Z by ISO2: CN, DE, US)
    expect(opts.map((o) => o.value)).toEqual([
      "Global",
      "Europe",
      "APAC",
      "CN",
      "DE",
      "US",
    ]);
    expect(opts.map((o) => o.label)).toEqual([
      "Global",
      "Europe",
      "APAC",
      "People's Republic of China",
      "Germany",
      "United States of America",
    ]);
  });

  it("treats unknown 2-letter strings as regions (e.g., 'EU')", () => {
    const pathways = [mkPathway("X", ["EU", "Global"])];
    const opts = makeGeographyOptions(pathways);
    expect(opts.map((o) => o.value)).toEqual(["Global", "EU"]);
    expect(opts.map((o) => o.label)).toEqual(["Global", "EU"]);
  });

  it("drops empty / whitespace entries", () => {
    const pathways = [mkPathway("X", ["", "  ", "\u200B", "CN"])];
    const opts = makeGeographyOptions(pathways);
    expect(opts.map((o) => o.value)).toEqual(["CN"]);
    expect(opts.map((o) => o.label)).toEqual(["People's Republic of China"]);
  });
});
