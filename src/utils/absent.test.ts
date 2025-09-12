import { describe, expect, it } from "vitest";
import {
  ABSENT,
  isAbsent,
  coalesceOptional,
  toFilterToken,
  fromFilterToken,
  toDisplay,
  ABSENT_FILTER_TOKEN,
} from "./absent";

describe("ABSENT sentinel + helpers", () => {
  it("isAbsent correctly detects the sentinel", () => {
    //true
    expect(isAbsent(ABSENT)).toBe(true);
    //false
    expect(isAbsent(undefined)).toBe(false);
    expect(isAbsent(null)).toBe(false);
    expect(isAbsent("None")).toBe(false);
    expect(isAbsent("")).toBe(false);
    expect(isAbsent(0)).toBe(false);
    expect(isAbsent(false)).toBe(false);
  });

  it("coalesceOptional converts undefined/null to ABSENT and keeps other values intact", () => {
    expect(isAbsent(coalesceOptional(undefined))).toBe(true);
    expect(isAbsent(coalesceOptional(null))).toBe(true);

    expect(coalesceOptional(0)).toBe(0);
    expect(coalesceOptional("")).toBe("");
    expect(coalesceOptional(false)).toBe(false);
    expect(coalesceOptional("2°C")).toBe("2°C");
  });

  it("toFilterToken maps ABSENT to the stable token and preserves primitives", () => {
    expect(toFilterToken(ABSENT)).toBe(ABSENT_FILTER_TOKEN);
    expect(toFilterToken("2°C")).toBe("2°C");
    expect(toFilterToken(2050)).toBe(2050);
  });

  it("fromFilterToken maps the token back to ABSENT and preserves primitives", () => {
    expect(isAbsent(fromFilterToken(ABSENT_FILTER_TOKEN))).toBe(true);
    expect(fromFilterToken("2°C")).toBe("2°C");
    expect(fromFilterToken(2050)).toBe(2050);
  });

  it("roundtrips through toFilterToken/fromFilterToken", () => {
    const roundTrip = <T extends string | number>(v: T): T | typeof ABSENT =>
      fromFilterToken(toFilterToken(v));

    expect(roundTrip("2°C")).toBe("2°C");
    expect(roundTrip(2030)).toBe(2030);

    const absentRound = fromFilterToken(toFilterToken(ABSENT));
    expect(isAbsent(absentRound)).toBe(true);
  });

  it("toDisplay returns 'None' by default and allows custom label", () => {
    expect(toDisplay(ABSENT)).toBe("None");
    expect(toDisplay(ABSENT, { noneLabel: "N/A" })).toBe("N/A");
    expect(toDisplay("2°C")).toBe("2°C");
    expect(toDisplay(0)).toBe("0");
  });
});
