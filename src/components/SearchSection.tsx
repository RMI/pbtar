import React from "react";
import SearchBox from "./SearchBox";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { SearchFilters, Geography } from "../types";
import { makeGeographyOptions } from "../utils/searchUtils";
import type { FacetMode } from "../utils/searchUtils";
import {
  buildOptionsFromValues,
  hasAbsent,
  withAbsentOption,
} from "../utils/facets";
import { ABSENT_FILTER_TOKEN } from "../utils/absent";

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

  const pathwayTypeOptions = buildOptionsFromValues(
    pathwayMetadata.map((d) => d.pathwayType),
  );

  const modelYearNetzeroOptions = buildOptionsFromValues(
    pathwayMetadata.map((d) => d.modelYearNetzero),
  );

  const temperatureOptions = buildOptionsFromValues(
    pathwayMetadata.map((d) => d.modelTempIncrease),
  );

  const geographyOptionsRaw: Geography[] = React.useMemo(
    () => makeGeographyOptions(pathwayMetadata),
    [],
  ) as Geography[];
  const sawAbsentGeography = hasAbsent(pathwayMetadata.map((d) => d.geography));
  const geographyOptions = withAbsentOption(
    geographyOptionsRaw,
    sawAbsentGeography,
  );

  const sectorNames = pathwayMetadata.flatMap(
    (d) => d.sectors?.map((s) => s.name) ?? [],
  );
  const sectorOptionsBase = buildOptionsFromValues(sectorNames);
  const sawAbsentSectors = pathwayMetadata.some(
    (d) => !d.sectors || d.sectors.length === 0,
  );
  const sectorOptions = sawAbsentSectors
    ? [...sectorOptionsBase, { label: "None", value: ABSENT_FILTER_TOKEN }]
    : sectorOptionsBase;

  const metricOptions = buildOptionsFromValues(
    pathwayMetadata.map((d) => d.metric).flat(),
  );

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
