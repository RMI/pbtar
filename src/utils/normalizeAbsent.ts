/**
 * Normalize selected optional properties by coalescing `undefined|null` to ABSENT.
 * - Shallow only (top-level keys). Compose if you need nested normalization.
 * - Does NOT mutate the input object.
 */
import { Absent, coalesceOptional } from "./absent";

type WithNormalized<T, K extends keyof T> = T & {
  [P in K]-?: Exclude<T[P], null | undefined> | Absent;
};

/** Normalize a single object. */
export function normalizeOptionalFields<
  T extends Record<string, unknown>,
  K extends keyof T,
>(obj: T, keys: readonly K[]): WithNormalized<T, K> {
  const out: Record<string, unknown> = { ...obj };
  for (const k of keys) {
    // preserve falsy-but-valid values like 0, "" and false
    out[k as string] = coalesceOptional(out[k as string]);
  }
  return out as WithNormalized<T, K>;
}

/** Normalize a list of objects. */
export function normalizeList<
  T extends Record<string, unknown>,
  K extends keyof T,
>(list: readonly T[], keys: readonly K[]): WithNormalized<T, K>[] {
  return list.map((item) => normalizeOptionalFields(item, keys));
}
