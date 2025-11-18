import React from "react";
import SearchBox from "./SearchBox";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { SearchFilters } from "../types";
import type { FacetMode } from "../utils/searchUtils";
import { getGlobalFacetOptions } from "../utils/searchUtils";

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
        | "emissionsPathway"
        | "policyAmbition"
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
    emissionsPathwayOptions,
    policyAmbitionOptions,
  } = React.useMemo(() => getGlobalFacetOptions(pathwayMetadata), []);

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
      : filters.modelTempIncrease != null) ||
    (Array.isArray(filters.emissionsPathway)
      ? filters.emissionsPathway.length > 0
      : filters.emissionsPathway != null) ||
    (Array.isArray(filters.policyAmbition)
      ? filters.policyAmbition.length > 0
      : filters.policyAmbition != null);

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

        <MultiSelectDropdown<number>
          label="Net Zero By"
          options={modelYearNetzeroOptions}
          value={filters.modelYearNetzero}
          onChange={(arr) => onFilterChange("modelYearNetzero", arr)}
          showModeToggle={false}
          mode={filters.modes?.modelYearNetzero ?? "ANY"}
          onModeChange={(m) => setMode("modelYearNetzero", m)}
        />

        <MultiSelectDropdown<string | number>
          label="Temperature (°C)"
          options={temperatureOptions}
          value={filters.modelTempIncrease}
          onChange={(arr) => onFilterChange("modelTempIncrease", arr)}
          showModeToggle={false}
          mode={filters.modes?.modelTempIncrease ?? "ANY"}
          onModeChange={(m) => setMode("modelTempIncrease", m)}
        />

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

        <MultiSelectDropdown<string>
          label="Emissions Pathway"
          options={emissionsPathwayOptions}
          value={filters.emissionsPathway}
          onChange={(arr) => onFilterChange("emissionsPathway", arr)}
          showModeToggle={false}
          mode={filters.modes?.emissionsPathway ?? "ANY"}
          onModeChange={(m) => setMode("emissionsPathway", m)}
          menuWidthClassName="w-60"
        />

        <MultiSelectDropdown<string>
          label="Policy Ambition"
          options={policyAmbitionOptions}
          value={filters.policyAmbition}
          onChange={(arr) => onFilterChange("policyAmbition", arr)}
          showModeToggle={false}
          mode={filters.modes?.policyAmbition ?? "ANY"}
          onModeChange={(m) => setMode("policyAmbition", m)}
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
