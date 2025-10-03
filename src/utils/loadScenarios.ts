// src/utils/loadScenarios.ts
import type { Scenario } from "../types";
import { validateScenariosCollect } from "./validateScenarios";
import type { FileEntry } from "./validateScenarios";

type ViteEnv =
  | {
      DEV?: boolean;
      VITE_INCLUDE_INVALID?: string | boolean;
    }
  | undefined;

type EnvValue = string | boolean | undefined;

// Decider reads both Vite and Node envs so it works in browser & Node contexts.
export function decideIncludeInvalid(): boolean {
  // Try to read a Vite-like env if present (works in browser/preview and in tests with a shim)
  // Access to import.meta must not use `typeof import` (keyword) — esbuild will error.
  let viteEnv: ViteEnv = undefined;

  try {
    // @ts-expect-error: import.meta is not defined in Node tests
    viteEnv = import.meta?.env as ViteEnv;
  } catch {
    // Fallback to a test shim placed at globalThis.import.meta.env
    viteEnv = ((globalThis?.import as EnvValue)?.meta as EnvValue)
      ?.env as ViteEnv;
  }

  const viteDev = !!viteEnv?.DEV;
  const viteFlag =
    viteEnv?.VITE_INCLUDE_INVALID !== undefined &&
    String(viteEnv.VITE_INCLUDE_INVALID).toLowerCase() === "true";

  const nodeFlag =
    typeof process !== "undefined" &&
    process.env?.VITE_INCLUDE_INVALID?.toLowerCase() === "true";

  // In prod builds we never include invalid scenarios.
  const nodeProd =
    typeof process !== "undefined" &&
    (process.env?.NODE_ENV === "production" ||
      process.env?.VITE_BUILD_MODE === "production");
  const nodeDev =
    typeof process !== "undefined" &&
    !(
      process.env?.NODE_ENV === "production" ||
      process.env?.VITE_BUILD_MODE === "production"
    );

  if (nodeProd) return false;
  return viteFlag || (viteDev && nodeFlag) || (!viteEnv && nodeDev && nodeFlag);
}

/**
 * Core assembly: takes already-parsed entries, validates them, and returns the
 * scenarios list. When includeInvalid=true, invalid blobs are appended.
 */
export function assembleScenarios(
  entries: FileEntry[],
  opts?: {
    includeInvalid?: boolean;
    warn?: (msg: string) => void;
  },
): Scenario[] {
  const includeInvalid = !!opts?.includeInvalid;

  const { valid, invalid } = validateScenariosCollect(entries);

  if (invalid.length && opts?.warn) {
    const totalInvalid = invalid.reduce(
      (sum, p) => sum + (p.data?.length ?? 0),
      0,
    );
    opts.warn(
      `[loadScenarios] Warning: ${totalInvalid} invalid scenario${
        totalInvalid !== 1 ? "s" : ""
      } found in ${invalid.length} file${invalid.length !== 1 ? "s" : ""}. ${
        includeInvalid
          ? "These will be included in the output."
          : "These will be excluded from the output."
      }`,
    );
  }

  if (!includeInvalid) return valid;
  return [...valid, ...invalid.flatMap((p) => p.data ?? [])];
}
