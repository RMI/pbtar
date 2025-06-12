import React from "react";
import SearchBox from "./SearchBox";
import FilterDropdown from "./FilterDropdown";
import { scenariosData } from "../data/scenariosData";
import {
  SearchFilters,
  ScenarioCategory,
  YearTarget,
  TemperatureTarget,
  Region,
  Sector,
} from "../types";

interface SearchSectionProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onClear,
}) => {
  const categories: ScenarioCategory[] = Array.from(
    new Set(scenariosData.map((d) => d.category)),
  ).sort();
  const years: YearTarget[] = Array.from(
    new Set(scenariosData.map((d) => d.target_year)),
  ).sort();
  const temperatures: TemperatureTarget[] = Array.from(
    new Set(scenariosData.map((d) => d.target_temperature)),
  ).sort();
  const regions: Region[] = Array.from(
    new Set(scenariosData.map((d) => d.regions).flat()),
  ).sort();
  const sectors: Sector[] = Array.from(
    new Set(scenariosData.map((d) => d.sectors).flat()),
  ).sort();

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="mb-4">
        <SearchBox
          value={filters.searchTerm}
          onChange={(value) => onFilterChange("searchTerm", value)}
          onSearch={onSearch}
          onClear={onClear}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="Category"
          options={categories}
          selectedValue={filters.category}
          onChange={(value) => onFilterChange("category", value)}
        />

        <FilterDropdown
          label="Target Year"
          options={years}
          selectedValue={filters.target_year}
          onChange={(value) => onFilterChange("target_year", value)}
        />

        <FilterDropdown
          label="Temperature"
          options={temperatures}
          selectedValue={filters.target_temperature}
          onChange={(value) => onFilterChange("target_temperature", value)}
        />

        <FilterDropdown
          label="Region"
          options={regions}
          selectedValue={filters.region}
          onChange={(value) => onFilterChange("region", value)}
        />

        <FilterDropdown
          label="Sector"
          options={sectors}
          selectedValue={filters.sector}
          onChange={(value) => onFilterChange("sector", value)}
        />
      </div>
    </div>
  );
};

export default SearchSection;
