import React from "react";
import SearchBox from "./SearchBox";
import FilterDropdown from "./FilterDropdown";
import { scenariosData } from "../data/scenariosData";
import {
  SearchFilters,
  PathwayType,
  YearTarget,
  TemperatureTarget,
  Geography,
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
    new Set(scenariosData.map((d) => d.modelTempIncrease)),
  ).sort() as TemperatureTarget[];
  const geography: Geography[] = Array.from(
    new Set(scenariosData.map((d) => d.geography).flat()),
  ).sort() as Geography[];
  const sectors: Sector[] = Array.from(
    new Set(scenariosData.flatMap((d) => d.sectors.map((s) => s.name))),
  ).sort();
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
          selectedValue={filters.modelTempIncrease}
          onChange={(value) => onFilterChange("modelTempIncrease", value)}
        />

        <FilterDropdown<string>
          label="Geography"
          options={geography}
          selectedValue={filters.geography}
          onChange={(value) => onFilterChange("geography", value)}
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
