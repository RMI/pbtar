import { describe, it, expect } from "vitest";
import { getSectorIcon } from "./sectorIcons";

describe("sectorIcons utility", () => {
  it("returns an icon for canonical sector Power", () => {
    const icon = getSectorIcon("Power");
    expect(icon).not.toBeNull();
  });

  it("returns an icon for extended sector Industry", () => {
    const icon = getSectorIcon("Industry");
    expect(icon).not.toBeNull();
  });

  it("returns an icon for extended sector Real Estate", () => {
    const icon = getSectorIcon("Real Estate");
    expect(icon).not.toBeNull();
  });

  it("returns null for unknown sector", () => {
    const icon = getSectorIcon("Totally Unknown Sector");
    expect(icon).toBeNull();
  });
});