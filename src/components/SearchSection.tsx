import React from "react";
import SearchBox from "./SearchBox";
import FilterDropdown from "./FilterDropdown";
import { scenariosData } from "../data/scenariosData";
import {
  SearchFilters,
  PathwayType,
  YearTarget,
  TemperatureTarget,
  Region,
  Sector,
} from "../types";

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
  const categories: PathwayType[] = Array.from(
    new Set(scenariosData.map((d) => d.pathwayType)),
  ).sort() as PathwayType[];
  const years: YearTarget[] = Array.from(
    new Set(scenariosData.map((d) => d.modelYearEnd)),
  ).sort() as YearTarget[];
  const temperatures: TemperatureTarget[] = Array.from(
    new Set(scenariosData.map((d) => d.modeled_temperature_increase)),
  ).sort() as TemperatureTarget[];
  const regions: Region[] = Array.from(
    new Set(scenariosData.map((d) => d.regions).flat()),
  ).sort() as Region[];
  const sectors: Sector[] = Array.from(
    new Set(scenariosData.flatMap((d) => d.sectors.map((s) => s.name))),
  ).sort();
  const areFiltersApplied =
    (filters.searchTerm ||
      filters.pathwayType ||
      filters.region ||
      filters.sector ||
      filters.modelYearEnd ||
      filters.modeled_temperature_increase) !== null;

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
          options={categories}
          selectedValue={filters.pathwayType}
          onChange={(value) => onFilterChange("pathwayType", value)}
        />

        <FilterDropdown<string>
          label="Target Year"
          options={years}
          selectedValue={filters.modelYearEnd}
          onChange={(value) => onFilterChange("modelYearEnd", value)}
        />

        <FilterDropdown<number>
          label="Temperature (°C)"
          options={temperatures}
          selectedValue={filters.modeled_temperature_increase}
          onChange={(value) =>
            onFilterChange("modeled_temperature_increase", value)
          }
        />

        <FilterDropdown<string>
          label="Region"
          options={regions}
          selectedValue={filters.region}
          onChange={(value) => onFilterChange("region", value)}
        />

        <FilterDropdown<string>
          label="Sector"
          options={sectors}
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
