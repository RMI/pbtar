import { describe, it, expect } from "vitest";
import { geographyKind } from "./geographyUtils";

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
