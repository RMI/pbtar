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

/**
 * Missing-aware matcher for optional facets.
 * - selected: array of tokens from FilterDropdown (e.g., ["2°C", "__ABSENT__"])
 * - value: field value from the scenario (string | number | null | undefined)
 */
export function matchesOptionalFacet<T extends string | number>(
  selected: readonly string[] | undefined,
  value: T | null | undefined,
): boolean {
  const sel = selected ?? [];
  if (sel.length === 0) return true; // no filter applied

  const wantAbsent = sel.includes(ABSENT_FILTER_TOKEN);
  const concrete = sel.filter((v) => v !== ABSENT_FILTER_TOKEN);

  const isMissing = value == null;
  if (wantAbsent && isMissing) return true;
  if (!isMissing && concrete.length > 0) {
    return concrete.includes(String(value));
  }
  return false;
}

/**
 * Missing-aware matcher for ARRAY facets (e.g., sectors[]).
 * - selected: tokens from a FilterDropdown (e.g., ["Power", "__ABSENT__"])
 * - values: array of scenario values (strings/objects), or null/undefined
 * - toToken: map each item to a compare string (e.g., s => s.name)
 */
export function matchesOptionalFacetAny<T>(
  selected: readonly string[] | undefined,
  values: readonly T[] | null | undefined,
  toToken: (v: T) => string | number,
): boolean {
  const sel = selected ?? [];
  if (sel.length === 0) return true; // no filter applied

  const wantAbsent = sel.includes(ABSENT_FILTER_TOKEN);
  const concrete = sel.filter((v) => v !== ABSENT_FILTER_TOKEN).map(String);

  const missing = values == null || values.length === 0;
  if (wantAbsent && missing) return true;
  if (concrete.length === 0) return false;

  const tokens = (values ?? []).map((v) => String(toToken(v)));
  return tokens.some((t) => concrete.includes(t));
}

/**
 * Require that **all** selected tokens are present on the item.
 * Preserves ABSENT token semantics: if ABSENT is selected,
 * it matches when the item has no values after normalization.
 */
export function matchesOptionalFacetAll<T>(
  selected: string[],
  itemValues: T[] | undefined,
  normalize: (v: T) => string,
): boolean {
  // no active filter → pass
  if (!selected || selected.length === 0) return true;

  const values = (itemValues ?? []).map(normalize);
  const set = new Set(values);

  // special handling for ABSENT: if selected includes ABSENT,
  // then "all" is satisfied only when the set is empty.
  if (selected.includes(ABSENT_FILTER_TOKEN)) {
    // if ABSENT appears with other tokens, this can never be satisfied
    // unless there are no concrete tokens and no item values.
    const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
    return concrete.length === 0 && set.size === 0;
  }

  // all selected must be present
  return selected.every((s) => set.has(s));
}

// Detect if any value is null/undefined in a list (for auto “None”)
export function hasAbsent<T>(values: Array<T | null | undefined>): boolean {
  return values.some((v) => v == null);
}

/**
 * If `sawAbsent` is true, append a “None” option unless it’s already present.
 * Useful when you already have label/value options (e.g., Geography) and
 * only need to add the virtual None bucket when data is actually missing.
 */
export function withAbsentOption(
  options: LabeledOption[],
  sawAbsent: boolean,
  noneLabel?: string,
): LabeledOption[] {
  if (!sawAbsent) return options;
  if (options.some((o) => o.value === ABSENT_FILTER_TOKEN)) return options;
  return [
    ...options,
    { label: noneLabel ?? "None", value: ABSENT_FILTER_TOKEN },
  ];
}
