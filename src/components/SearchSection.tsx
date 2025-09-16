import React from "react";
import SearchBox from "./SearchBox";
import FilterDropdown from "./FilterDropdown";
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

  const modelYearNetzeroOptions = buildOptionsFromValues(
    scenariosData.map((d) => d.modelYearNetzero),
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
      filters.modelYearNetzero ||
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
        <FilterDropdown<string>
          label="Pathway Type"
          options={pathwayTypeOptions}
          selectedValue={filters.pathwayType}
          onChange={(value) => onFilterChange("pathwayType", value)}
        />

        <FilterDropdown<string>
          label="Target Year"
          options={modelYearNetzeroOptions}
          selectedValue={filters.modelYearNetzero}
          onChange={(value) => onFilterChange("modelYearNetzero", value)}
        />

        <FilterDropdown<number>
          label="Temperature (°C)"
          options={temperatureOptions}
          selectedValue={filters.modelTempIncrease}
          onChange={(value) => onFilterChange("modelTempIncrease", value)}
        />

        <FilterDropdown<string>
          label="Geography"
          options={geographyOptions}
          selectedValue={filters.geography}
          onChange={(value) => onFilterChange("geography", value)}
        />

        <FilterDropdown<string>
          label="Sector"
          options={sectorOptions}
          selectedValue={filters.sector}
          onChange={(value) => onFilterChange("sector", value)}
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
