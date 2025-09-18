import React from "react";
import SearchBox from "./SearchBox";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { scenariosData } from "../data/scenariosData";
import { SearchFilters, Geography } from "../types";
import { makeGeographyOptions } from "../utils/searchUtils";
import {
  buildOptionsFromValues,
  hasAbsent,
  withAbsentOption,
} from "../utils/facets";
import { ABSENT_FILTER_TOKEN } from "../utils/absent";

interface SearchSectionProps {
  filters: SearchFilters;
  scenariosNumber: number;
  onFilterChange: <T extends string | number | null>(
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

  const areFiltersApplied =
    (filters.searchTerm ||
      filters.pathwayType ||
      filters.geography ||
      filters.sector ||
      filters.modelYearEnd ||
      filters.modelTempIncrease) !== null;

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
          value={
            Array.isArray(filters.pathwayType)
              ? (filters.pathwayType as string[])
              : filters.pathwayType
                ? [String(filters.pathwayType)]
                : []
          }
          onChange={(arr) => onFilterChange("pathwayType", arr)}
        />

        <MultiSelectDropdown<number>
          label="Target Year"
          options={modelYearEndOptions}
          value={
            Array.isArray(filters.temperature)
              ? (filters.modelYearEnd as string[])
              : filters.modelYearEnd
                ? [String(filters.modelYearEnd)]
                : []
          }
          onChange={(arr) => onFilterChange("modelYearEnd", arr)}
        />

        <MultiSelectDropdown<string | number>
          label="Temperature (°C)"
          options={
            temperatureOptions as { label: string; value: string | number }[]
          }
          value={
            Array.isArray(filters.modelTempIncrease)
              ? (filters.modelTempIncrease as (string | number)[])
              : filters.modelTempIncrease != null
                ? [String(filters.modelTempIncrease as string | number)]
                : []
          }
          onChange={(arr) => onFilterChange("modelTempIncrease", arr)}
        />

        <MultiSelectDropdown<string>
          label="Geography"
          options={geographyOptions}
          value={
            Array.isArray(filters.geography)
              ? (filters.geography as string[])
              : filters.geography
                ? [String(filters.geography)]
                : []
          }
          onChange={(arr) =>
            // cast to satisfy current onFilterChange signature without widening SearchFilters yet
            onFilterChange("geography", arr)
          }
        />

        <MultiSelectDropdown<string>
          label="Sector"
          options={sectorOptions}
          value={
            Array.isArray(filters.sector)
              ? (filters.sector as string[])
              : filters.sector
                ? [String(filters.sector)]
                : []
          }
          onChange={(arr) => onFilterChange("sector", arr)}
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
