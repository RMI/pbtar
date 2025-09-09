import { describe, it, expect } from "vitest";
import { prioritizeGeographies } from "../utils/sortUtils";

describe("prioritizeGeographies", () => {
  it("moves CN to front for 'China' or 'CN'", () => {
    const base = ["Global", "APAC", "CN", "US"];
    expect(prioritizeGeographies(base, "China")[0]).toBe("CN");
    expect(prioritizeGeographies(base, "CN")[0]).toBe("CN");
  });
});
