import React from "react";
import SearchBox from "./SearchBox";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { SearchFilters } from "../types";
import type { FacetMode } from "../utils/searchUtils";
import { getGlobalFacetOptions } from "../utils/searchUtils";
import NumericRange from "./NumericRange";
import { getStep } from "./NumericRange";
import clsx from "clsx";
import FilterDropdown from "./FilterDropdown";
import { ChevronDown } from "lucide-react";

interface SearchSectionProps {
  filters: SearchFilters;
  pathwaysNumber: number;
  onFilterChange: <T extends string | number | (string | number)[] | null>(
    key: keyof SearchFilters,
    value: T | null,
  ) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  filters,
  pathwaysNumber,
  onFilterChange,
  onSearch,
  onClear,
}) => {
  const setMode = React.useCallback(
    (
      facet:
        | "geography"
        | "sector"
        | "metric"
        | "pathwayType"
        | "modelYearNetzero"
        | "modelTempIncrease",
      m: FacetMode,
    ) => {
      onFilterChange("modes", { ...(filters.modes ?? {}), [facet]: m });
    },
    [filters.modes, onFilterChange],
  );

  // Single source of truth for option lists (global, data-driven)
  const {
    pathwayTypeOptions,
    modelYearNetzeroOptions,
    temperatureOptions,
    geographyOptions,
    sectorOptions,
    metricOptions,
  } = React.useMemo(() => getGlobalFacetOptions(pathwayMetadata), []);

  const { tempBounds, netZeroBounds } = React.useMemo(() => {
    const tVals = (temperatureOptions ?? [])
      .filter((o) => !o.disabled)
      .map((o) => Number(o.value))
      .filter((n) => Number.isFinite(n)) as number[];
    const nzVals = (modelYearNetzeroOptions ?? [])
      .filter((o) => !o.disabled)
      .map((o) => Number(o.value))
      .filter((n) => Number.isFinite(n)) as number[];
    const tb = tVals.length
      ? { min: Math.min(...tVals), max: Math.max(...tVals) }
      : { min: 0, max: 0 };
    const nzb = nzVals.length
      ? { min: Math.min(...nzVals), max: Math.max(...nzVals) }
      : { min: 0, max: 0 };
    return { tempBounds: tb, netZeroBounds: nzb };
  }, [temperatureOptions, modelYearNetzeroOptions]);

  const areFiltersApplied =
    Boolean(filters.searchTerm) ||
    Boolean(filters.pathwayType) ||
    // array-backed facets: true only when non-empty; scalar: true when not null/undefined
    (Array.isArray(filters.geography)
      ? filters.geography.length > 0
      : filters.geography != null) ||
    (Array.isArray(filters.sector)
      ? filters.sector.length > 0
      : filters.sector != null) ||
    (Array.isArray(filters.metric)
      ? filters.metric.length > 0
      : filters.metric != null) ||
    (Array.isArray(filters.modelYearNetzero)
      ? filters.modelYearNetzero.length > 0
      : filters.modelYearNetzero != null) ||
    (Array.isArray(filters.modelTempIncrease)
      ? filters.modelTempIncrease.length > 0
      : filters.modelTempIncrease != null);

  return (
    <div className="bg-gray-50">
      <div className="mb-4 pt-8">
        <SearchBox
          value={filters.searchTerm}
          onChange={(value) => onFilterChange("searchTerm", value)}
          onSearch={onSearch}
          onClear={onClear}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <MultiSelectDropdown<string>
          label="Pathway Type"
          options={pathwayTypeOptions}
          value={filters.pathwayType}
          onChange={(arr) => onFilterChange("pathwayType", arr)}
          showModeToggle={false}
          mode={filters.modes?.pathwayType ?? "ANY"}
          onModeChange={(m) => setMode("pathwayType", m)}
        />

        <FilterDropdown label="Net Zero By">
          {/* Header row with mode toggle on the right */}
          <div className="flex items-start justify-between pb-2">
            <div className="text-sm font-medium text-gray-700 leading-tight">
              Net Zero By
            </div>
            <div
              className="text-right text-rmigray-500 inline-block"
              data-testid="nz-mode-toggle"
            >
              <div className="whitespace-nowrap text-xs">Filter mode</div>
              <div className="mt-1 flex items-center justify-end gap-1">
                <div
                  className="border border-gray-200 rounded-md cursor-pointer select-none"
                  role="button"
                  aria-label={`Toggle filter mode (currently ${(filters.modes?.modelYearNetzero ?? "DISCRETE") === "RANGE" ? "Range" : "Discrete"})`}
                  tabIndex={0}
                  onClick={() =>
                    setMode(
                      "modelYearNetzero",
                      (filters.modes?.modelYearNetzero ?? "DISCRETE") ===
                        "RANGE"
                        ? "DISCRETE"
                        : "RANGE",
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setMode(
                        "modelYearNetzero",
                        (filters.modes?.modelYearNetzero ?? "DISCRETE") ===
                          "RANGE"
                          ? "DISCRETE"
                          : "RANGE",
                      );
                    }
                  }}
                >
                  <span
                    className={clsx(
                      "px-[4px] py-[2px] rounded text-xs",
                      (filters.modes?.modelYearNetzero ?? "DISCRETE") ===
                        "DISCRETE" && "bg-energy-100 text-energy-800",
                    )}
                  >
                    Discrete
                  </span>
                  <span
                    className={clsx(
                      "px-[4px] py-[2px] rounded text-xs",
                      (filters.modes?.modelYearNetzero ?? "DISCRETE") ===
                        "RANGE" && "bg-energy-100 text-energy-800",
                    )}
                  >
                    Range
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(filters.modes?.modelYearNetzero ?? "DISCRETE") === "RANGE" ? (
            <NumericRange
              label="Net Zero By"
              minBound={netZeroBounds.min}
              maxBound={netZeroBounds.max}
              step={getStep("netZeroBy")}
              value={
                (filters.modelYearNetzero as any)?.mode === "RANGE"
                  ? (filters.modelYearNetzero as any)
                  : null
              }
              onChange={(r) =>
                onFilterChange(
                  "modelYearNetzero",
                  r ? { mode: "RANGE", ...r } : null,
                )
              }
              onClear={() => onFilterChange("modelYearNetzero", null)}
              dataTestId="range-netZeroBy"
            />
          ) : (
            <MultiSelectDropdown<number>
              label=""
              options={modelYearNetzeroOptions}
              value={
                Array.isArray(filters.modelYearNetzero)
                  ? filters.modelYearNetzero
                  : []
              }
              onChange={(arr) => onFilterChange("modelYearNetzero", arr)}
              showModeToggle={false}
              mode="DISCRETE"
              onModeChange={() => {}}
              menuWidthClassName="w-60"
            />
          )}
        </FilterDropdown>

        <FilterDropdown label="Temperature (°C)">
          <div className="flex items-start justify-between pb-2">
            <div className="text-sm font-medium text-gray-700 leading-tight">
              Temperature (°C)
            </div>
            <div
              className="text-right text-rmigray-500 inline-block"
              data-testid="temp-mode-toggle"
            >
              <div className="whitespace-nowrap text-xs">Filter mode</div>
              <div className="mt-1 flex items-center justify-end gap-1">
                <div
                  className="border border-gray-200 rounded-md cursor-pointer select-none"
                  role="button"
                  aria-label={`Toggle filter mode (currently ${(filters.modes?.modelTempIncrease ?? "DISCRETE") === "RANGE" ? "Range" : "Discrete"})`}
                  tabIndex={0}
                  onClick={() =>
                    setMode(
                      "modelTempIncrease",
                      (filters.modes?.modelTempIncrease ?? "DISCRETE") ===
                        "RANGE"
                        ? "DISCRETE"
                        : "RANGE",
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setMode(
                        "modelTempIncrease",
                        (filters.modes?.modelTempIncrease ?? "DISCRETE") ===
                          "RANGE"
                          ? "DISCRETE"
                          : "RANGE",
                      );
                    }
                  }}
                >
                  <span
                    className={clsx(
                      "px-[4px] py-[2px] rounded text-xs",
                      (filters.modes?.modelTempIncrease ?? "DISCRETE") ===
                        "DISCRETE" && "bg-energy-100 text-energy-800",
                    )}
                  >
                    Discrete
                  </span>
                  <span
                    className={clsx(
                      "px-[4px] py-[2px] rounded text-xs",
                      (filters.modes?.modelTempIncrease ?? "DISCRETE") ===
                        "RANGE" && "bg-energy-100 text-energy-800",
                    )}
                  >
                    Range
                  </span>
                </div>
              </div>
            </div>
          </div>

          {(filters.modes?.modelTempIncrease ?? "DISCRETE") === "RANGE" ? (
            <NumericRange
              label="Temperature (°C)"
              minBound={tempBounds.min}
              maxBound={tempBounds.max}
              step={getStep("temp")}
              value={
                (filters.modelTempIncrease as any)?.mode === "RANGE"
                  ? (filters.modelTempIncrease as any)
                  : null
              }
              onChange={(r) =>
                onFilterChange(
                  "modelTempIncrease",
                  r ? { mode: "RANGE", ...r } : null,
                )
              }
              onClear={() => onFilterChange("modelTempIncrease", null)}
              dataTestId="range-temp"
            />
          ) : (
            <MultiSelectDropdown<string | number>
              label=""
              options={temperatureOptions}
              value={
                Array.isArray(filters.modelTempIncrease)
                  ? filters.modelTempIncrease
                  : []
              }
              onChange={(arr) => onFilterChange("modelTempIncrease", arr)}
              showModeToggle={false}
              mode="DISCRETE"
              onModeChange={() => {}}
              menuWidthClassName="w-60"
            />
          )}
        </FilterDropdown>

        <MultiSelectDropdown<string>
          label="Geography"
          options={geographyOptions}
          value={filters.geography}
          onChange={(arr) => onFilterChange("geography", arr)}
          showModeToggle
          mode={filters.modes?.geography ?? "ANY"}
          onModeChange={(m) => setMode("geography", m)}
          menuWidthClassName="w-60"
        />

        <MultiSelectDropdown<string>
          label="Sector"
          options={sectorOptions}
          value={filters.sector}
          onChange={(arr) => onFilterChange("sector", arr)}
          showModeToggle
          mode={filters.modes?.sector ?? "ANY"}
          onModeChange={(m) => setMode("sector", m)}
          menuWidthClassName="w-60"
        />

        <MultiSelectDropdown<string>
          label="Benchmark Metric"
          options={metricOptions}
          value={filters.metric}
          onChange={(arr) => onFilterChange("metric", arr)}
          showModeToggle
          mode={filters.modes?.metric ?? "ANY"}
          onModeChange={(m) => setMode("metric", m)}
          menuWidthClassName="w-60"
        />
      </div>
      <div className="mt-4 ml-1 flex items-center justify-between gap-3">
        <p className="text-sm text-rmigray-500">
          Found {pathwaysNumber} pathways
          {areFiltersApplied && " matching your criteria"}
          {areFiltersApplied && (
            <button
              type="button"
              aria-label="Clear all filters"
              className="ml-2 text-sm text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              onClick={onClear}
              data-testid="clear-all-filters"
            >
              Clear all filters
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default SearchSection;
