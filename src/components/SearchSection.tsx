import React from "react";
import SearchBox from "./SearchBox";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { scenariosData } from "../data/scenariosData";
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
  scenariosNumber: number;
  onFilterChange: <T extends string | number | (string | number)[] | null>(
    key: keyof SearchFilters,
    value: T | null,
  ) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  filters,
  scenariosNumber,
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
        | "modelYearEnd"
        | "modelTempIncrease",
      m: FacetMode,
    ) => {
      onFilterChange("modes", { ...(filters.modes ?? {}), [facet]: m });
    },
    [filters.modes, onFilterChange],
  );

  const pathwayTypeOptions = buildOptionsFromValues(
    scenariosData.map((d) => d.pathwayType),
  );

  const modelYearEndOptions = buildOptionsFromValues(
    scenariosData.map((d) => d.modelYearEnd),
  );

  const temperatureOptions = buildOptionsFromValues(
    scenariosData.map((d) => d.modelTempIncrease),
  );

  const geographyOptionsRaw: Geography[] = React.useMemo(
    () => makeGeographyOptions(scenariosData),
    [scenariosData],
  ) as Geography[];
  const sawAbsentGeography = hasAbsent(scenariosData.map((d) => d.geography));
  const geographyOptions = withAbsentOption(
    geographyOptionsRaw,
    sawAbsentGeography,
  );

  const sectorNames = scenariosData.flatMap(
    (d) => d.sectors?.map((s) => s.name) ?? [],
  );
  const sectorOptionsBase = buildOptionsFromValues(sectorNames);
  const sawAbsentSectors = scenariosData.some(
    (d) => !d.sectors || d.sectors.length === 0,
  );
  const sectorOptions = sawAbsentSectors
    ? [...sectorOptionsBase, { label: "None", value: ABSENT_FILTER_TOKEN }]
    : sectorOptionsBase;

  const metricOptions = buildOptionsFromValues(
    scenariosData.map((d) => d.metric).flat(),
    //scenariosData.map((d) => d.metric)
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
    (Array.isArray(filters.modelYearEnd)
      ? filters.modelYearEnd.length > 0
      : filters.modelYearEnd != null) ||
    (Array.isArray(filters.modelTempIncrease)
      ? filters.modelTempIncrease.length > 0
      : filters.modelTempIncrease != null);

  return (
    <div className="bg-white">
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
          label="Target Year"
          options={modelYearEndOptions}
          value={filters.modelYearEnd}
          onChange={(arr) => onFilterChange("modelYearEnd", arr)}
          showModeToggle={false}
          mode={filters.modes?.modelYearEnd ?? "ANY"}
          onModeChange={(m) => setMode("modelYearEnd", m)}
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
        />

        <MultiSelectDropdown<string>
          label="Sector"
          options={sectorOptions}
          value={filters.sector}
          onChange={(arr) => onFilterChange("sector", arr)}
          showModeToggle
          mode={filters.modes?.sector ?? "ANY"}
          onModeChange={(m) => setMode("sector", m)}
        />

        <MultiSelectDropdown<string>
          label="Benchmark Metric"
          options={metricOptions}
          value={filters.metric}
          onChange={(arr) => onFilterChange("metric", arr)}
          showModeToggle
          mode={filters.modes?.metric ?? "ANY"}
          onModeChange={(m) => setMode("metric", m)}
        />
      </div>
      <div className="mt-4 ml-1">
        <p className="text-sm text-rmigray-500">
          Found {scenariosNumber} scenarios
          {areFiltersApplied && " matching your criteria"}
        </p>
      </div>
    </div>
  );
};

export default SearchSection;
