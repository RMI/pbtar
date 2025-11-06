import { describe, it, expect } from "vitest";
import { isAbsent } from "./absent";
import { normalizeOptionalFields, normalizeList } from "./normalizeAbsent";

type MockObject = {
  name: string;
  temperature?: string | null | undefined;
  targetYear?: number | null | undefined;
  targetType?: "absolute" | "intensity" | null | undefined;
  abool?: boolean | null | undefined;
  zero?: number | null | undefined;
  empty?: string | null | undefined;
  missing?: string | undefined;
};

describe("normalizeOptionalFields", () => {
  const base: MockObject = {
    name: "S",
    temperature: undefined,
    targetYear: null,
    targetType: null,
    abool: null,
    zero: 0,
    empty: "",
  };

  it("coalesces undefined/null to ABSENT only for selected keys", () => {
    const n = normalizeOptionalFields(base, [
      "temperature",
      "targetYear",
      "targetType",
      "missing",
      "zero",
      "empty",
    ] as const);
    expect(isAbsent(n.temperature)).toBe(true);
    expect(isAbsent(n.targetYear)).toBe(true);
    expect(isAbsent(n.targetType)).toBe(true);
    expect(isAbsent(n.missing)).toBe(true);

    // untouched fields (not in keys)
    expect(n.name).toBe("S");
    // valid falsy preserved
    expect(n.zero).toBe(0);
    expect(n.empty).toBe("");
  });

  it("leaves non-selected undefined fields as-is", () => {
    const n = normalizeOptionalFields(base, ["temperature"] as const);
    expect(isAbsent(n.temperature)).toBe(true);
    // not selected -> remains null
    expect(n.targetYear).toBeNull();
  });
});

describe("normalizeList", () => {
  it("normalizes each item in a list", () => {
    const list: MockObject[] = [
      { name: "A", temperature: undefined },
      { name: "B", temperature: "2°C" },
      { name: "C" }, // missing
    ];
    const out = normalizeList(list, ["temperature"] as const);
    if (!out[0] || !out[1] || !out[2])
      throw new Error("Expected array to have 3 items");
    expect(isAbsent(out[0].temperature)).toBe(true);
    expect(out[1].temperature).toBe("2°C");
    expect(isAbsent(out[2].temperature)).toBe(true);
  });
});
