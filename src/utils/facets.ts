/**
 * Utilities for building filter/facet option arrays with an "Absent" bucket.
 * Pairs with ABSENT/ABSENT_FILTER_TOKEN from ./absent.
 */
import {
  ABSENT,
  ABSENT_FILTER_TOKEN,
  isAbsent,
  coalesceOptional,
  toDisplay,
} from "./absent";

export type OptionValue = string | number | typeof ABSENT;
export type OptionToken = string | number;

export interface LabeledOption {
  label: string;
  value: OptionToken;
}

export interface BuildOptionsOpts<T extends string | number> {
  /** If true, always include a "None" option even if no values are absent. */
  forceIncludeAbsent?: boolean;
  /** Custom labelling for non-ABSENT values. */
  makeLabel?: (v: T) => string;
  /** Override the "None" display label (default: "None"). */
  noneLabel?: string;
  /** If true, sort non-ABSENT values by their label. Default: true. */
  sort?: boolean;
}

/**
 * Build label/value options from raw values while injecting an ABSENT bucket.
 * - Dedupes values.
 * - Converts null/undefined to ABSENT.
 * - Emits { label, value } where value is primitive or "__ABSENT__".
 */
export function buildOptionsFromValues<T extends string | number>(
  values: Array<T | null | undefined>,
  opts: BuildOptionsOpts<T> = {},
): LabeledOption[] {
  const {
    forceIncludeAbsent = false,
    makeLabel,
    noneLabel,
    sort = true,
  } = opts;

  // Normalize values: coalesce to ABSENT, keep valid falsy like "" or 0
  const normalized = values.map((v) => coalesceOptional(v));

  const seen = new Set<string | number>();
  const concrete: T[] = [];
  let sawAbsent = false;

  for (const v of normalized) {
    if (isAbsent(v)) {
      sawAbsent = true;
      continue;
    }
    // Deduplicate preserving insertion order
    const key = v;
    if (!seen.has(key)) {
      seen.add(key);
      concrete.push(key);
    }
  }

  const labelFor = (v: T) => (makeLabel ? makeLabel(v) : String(v));

  const concreteOptions = concrete.map<LabeledOption>((v) => ({
    label: labelFor(v),
    value: v,
  }));

  if (sort) {
    concreteOptions.sort((a, b) => a.label.localeCompare(b.label));
  }

  const options: LabeledOption[] = [...concreteOptions];

  if (sawAbsent || forceIncludeAbsent) {
    options.push({
      label: toDisplay(ABSENT, { noneLabel }),
      value: ABSENT_FILTER_TOKEN,
    });
  }

  return options;
}
