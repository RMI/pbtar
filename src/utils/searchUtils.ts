import { Scenario } from "../types";
import {
  normalizeGeography,
  geographyLabel,
  sortGeographiesForDetails,
} from "./geographyUtils";
import { matchesOptionalFacetAny, matchesOptionalFacetAll } from "./facets";
import { ABSENT_FILTER_TOKEN } from "./absent";

export interface GeoOption {
  value: string; // raw (e.g., "CN", "Europe", "Global")
  label: string; // display (e.g., "China", "Europe", "Global")
}

// New: allow AND/OR per facet. Defaults to "ANY" for backwards compatibility.
export type FacetMode = "ANY" | "ALL";
export type FilterModes = Partial<{
  pathwayType: FacetMode;
  modelYearEnd: FacetMode;
  modelTempIncrease: FacetMode;
  geography: FacetMode;
  sector: FacetMode;
}>;

// Extend your existing Filters type minimally:
// - geography/sector may be string | string[]
// - optionally accept a modes map
export type Arrayable =
  | string
  | string[]
  | number
  | number[]
  | null
  | undefined;

export type FiltersWithArrays = {
  geography?: Arrayable;
  sector?: Arrayable;
  pathwayType?: Arrayable;
  modelYearEnd?: Arrayable;
  modelTempIncrease?: Arrayable;
  searchTerm?: string;
  // optional
  modes?: FilterModes;
};

function toArray(v: Arrayable): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [String(v)];
}

function toArrayMixed(v: Arrayable): (string | number)[] {
  if (v == null) return [];
  return Array.isArray(v)
    ? v.filter((x) => x !== null && x !== undefined)
    : [v];
}

function hasAbsentToken(arr: (string | number)[]): boolean {
  return arr.some((t) => String(t) === ABSENT_FILTER_TOKEN);
}

function toNumberSet(arr: (string | number)[]): Set<number> {
  const out = new Set<number>();
  for (const t of arr) {
    if (String(t) === ABSENT_FILTER_TOKEN) continue;
    const n = typeof t === "number" ? t : Number(t);
    if (Number.isFinite(n)) out.add(n);
  }
  return out;
}

function pickMode(facet: keyof FilterModes, modes?: FilterModes): FacetMode {
  return modes?.[facet] ?? "ANY";
}

export function makeGeographyOptions(scenarios: Scenario[]): GeoOption[] {
  const seen = new Set<string>();
  for (const s of scenarios) {
    for (const g of s.geography ?? []) {
      const v = normalizeGeography(g);
      if (v) seen.add(v);
    }
  }
  const uniques = Array.from(seen);
  const sorted = sortGeographiesForDetails(uniques);

  // ✅ value stays raw, label is full name (or passthrough for regions/Global)
  return sorted.map((v) => ({ value: v, label: geographyLabel(v) }));
}

export const filterScenarios = (
  scenarios: Scenario[],
  filters: FiltersWithArrays,
): Scenario[] => {
  return scenarios.filter((scenario) => {
    // ---- Pathway type: ANY/ALL over selected tokens; empty array => no filter; ABSENT-aware
    {
      const selected = toArray(filters.pathwayType);
      if (selected.length) {
        const hasAbsent = selected.includes(ABSENT_FILTER_TOKEN);
        const concrete = selected.filter((t) => t !== ABSENT_FILTER_TOKEN);
        const v = scenario.pathwayType ?? null;
        const mode = pickMode("pathwayType", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && (concrete.length ? concrete.includes(v) : false));
        } else {
          // ALL: for single-valued fields, all selected tokens must hold.
          // That is only possible when exactly one token is selected:
          //  - [ABSENT]  -> v == null
          //  - [X]       -> v == X
          // Any combination (ABSENT + X, or X + Y) cannot be satisfied.
          if (hasAbsent && concrete.length === 0) {
            ok = v == null;
          } else if (!hasAbsent && concrete.length === 1) {
            ok = v != null && v === concrete[0];
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // ---- Target year: OR over numbers; empty array => no filter; ABSENT-aware
    {
      const selected = toArrayMixed(filters.modelYearEnd);
      if (selected.length) {
        const hasAbsent = hasAbsentToken(selected);
        const numericChoices = toNumberSet(selected);
        const v = scenario.modelYearEnd; // number | null | undefined
        const mode = pickMode("modelYearEnd", filters.modes as FilterModes);
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && numericChoices.has(Number(v)));
        } else {
          // ALL: only possible when exactly one condition is chosen:
          //  - [ABSENT]        -> v == null
          //  - [single number] -> v == number
          // Any other combination (ABSENT + number, or two numbers) is impossible.
          if (hasAbsent && numericChoices.size === 0) {
            ok = v == null;
          } else if (!hasAbsent && numericChoices.size === 1) {
            ok = v != null && numericChoices.has(Number(v));
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // ---- Temperature: OR over numbers; empty array => no filter; ABSENT-aware
    {
      const selected = toArrayMixed(filters.modelTempIncrease);
      if (selected.length) {
        const hasAbsent = hasAbsentToken(selected);
        const numericChoices = toNumberSet(selected);
        const v = scenario.modelTempIncrease; // number | null | undefined
        const mode = pickMode(
          "modelTempIncrease",
          filters.modes as FilterModes,
        );
        let ok = true;

        if (mode === "ANY") {
          ok =
            (v == null && hasAbsent) ||
            (v != null && numericChoices.has(Number(v)));
        } else {
          if (hasAbsent && numericChoices.size === 0) {
            ok = v == null;
          } else if (!hasAbsent && numericChoices.size === 1) {
            ok = v != null && numericChoices.has(Number(v));
          } else {
            ok = false;
          }
        }
        if (!ok) return false;
      }
    }

    // Geography filter (array + mode + missing-aware + normalization)
    {
      const selected = toArray(filters.geography);
      const norm = (s: string) => normalizeGeography(s).toUpperCase();
      // IMPORTANT: preserve the ABSENT token; only normalize concrete selections
      const normalizedSelected = selected.map((t) =>
        t === ABSENT_FILTER_TOKEN ? t : norm(t),
      );
      const mode = pickMode("geography", filters.modes);
      const ok =
        mode === "ALL"
          ? matchesOptionalFacetAll(
              normalizedSelected,
              scenario.geography ?? [],
              (g) => norm(g),
            )
          : matchesOptionalFacetAny(
              normalizedSelected,
              scenario.geography ?? [],
              (g) => norm(g),
            );
      if (!ok) return false;
    }

    // Sector filter (array + mode + missing-aware)
    {
      const selected = toArray(filters.sector);
      const normalizedSelected = selected; // sector tokens look canonical already
      const mode = pickMode("sector", filters.modes);
      const values = (scenario.sectors ?? []).map((s) => s.name);
      const ok =
        mode === "ALL"
          ? matchesOptionalFacetAll(normalizedSelected, values, (s) => s)
          : matchesOptionalFacetAny(normalizedSelected, values, (s) => s);
      if (!ok) return false;
    }

    // Search term
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchFields = [
        scenario.name,
        scenario.description,
        scenario.pathwayType,
        scenario.modelYearEnd,
        scenario.modelTempIncrease,
        ...scenario.geography,
        ...scenario.geography.map((s) => geographyLabel(s)),
        ...scenario.sectors.map((s) => s.name),
        scenario.publisher,
        scenario.publicationYear,
      ];

      return searchFields.some((field) =>
        String(field).toLowerCase().includes(searchTerm),
      );
    }

    return true;
  });
};
