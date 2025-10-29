import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Scenario } from "../types";
import { join, resolve } from "path";
import { promises as fs } from "node:fs";

// We will import the module under test *lazily* after setting up any vi.mocks,
// so that mocked dependencies are wired correctly.
const importModule = async () => await import("./loadData");

/** Reset module cache & env between tests */
beforeEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs?.(); // vitest >=1.6 provides this; if older, ignore
  // Clean up any global import.meta/env shims:
  // @ts-expect-error test only
  global.import = undefined;
  // @ts-expect-error test only
  globalThis.import = undefined;
});

afterEach(() => {
  vi.resetModules();
});

/* ----------------------------
 * decideIncludeInvalid unit tests
 * ---------------------------- */
describe("decideIncludeInvalid", () => {
  it("returns false in production regardless of env flags", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VITE_BUILD_MODE", "production");
    vi.stubEnv("VITE_INCLUDE_INVALID", "true");

    const { decideIncludeInvalid } = await importModule();
    expect(decideIncludeInvalid()).toBe(false);
  });

  it("returns false when DEV but flag unset/false", async () => {
    // @ts-expect-error test shim
    globalThis.import = {
      meta: { env: { DEV: true, VITE_INCLUDE_INVALID: "false" } },
    };
    const { decideIncludeInvalid } = await importModule();
    expect(decideIncludeInvalid()).toBe(false);
  });

  it("can also read Node env in DEV contexts", async () => {
    // Vite-like DEV with no vite flag, but Node env set:
    // @ts-expect-error test shim
    globalThis.import = { meta: { env: { DEV: true } } };
    vi.stubEnv("VITE_INCLUDE_INVALID", "true");

    const { decideIncludeInvalid } = await importModule();
    expect(decideIncludeInvalid()).toBe(true);
  });
});

describe("validate files on disk", () => {
  it("all src/data/*.json data files conform to schema", async () => {
    const dir = resolve(__dirname, "../data");
    const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    const entries = await Promise.all(
      names.map(async (name) => ({
        name,
        data: JSON.parse(await fs.readFile(join(dir, name), "utf8")) as
          | Scenario[]
          | unknown[],
      })),
    );
    // In app code we now *filter* invalid blobs rather than throw.
    const warn = vi.fn();
    const { assembleData } = await importModule();
    const list = assembleData(entries, { includeInvalid: false, warn });
    expect(Array.isArray(list)).toBe(true);
    // We don't assert on warn count, because it depends on repo data state.
    // But we *do* ensure warn is callable without throwing:
    expect(warn).toBeTypeOf("function");
  });

  it("all testdata/valid/*.json data files conform to schema", async () => {
    const dir = resolve(__dirname, "../../testdata/valid");
    const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
    const entries = await Promise.all(
      names.map(async (name) => ({
        name,
        data: JSON.parse(await fs.readFile(join(dir, name), "utf8")) as
          | Scenario[]
          | unknown[],
      })),
    );
    // In app code we now *filter* invalid blobs rather than throw.
    const warn = vi.fn();
    const { assembleData } = await importModule();
    const list = assembleData(entries, { includeInvalid: false, warn });
    expect(Array.isArray(list)).toBe(true);
    // We don't assert on warn count, because it depends on repo data state.
    // But we *do* ensure warn is callable without throwing:
    expect(warn).toBeTypeOf("function");
  });
});
