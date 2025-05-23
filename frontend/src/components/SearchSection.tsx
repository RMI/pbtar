import React from "react";
import SearchBox from "./SearchBox";
import FilterDropdown from "./FilterDropdown";
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
  const categories: ScenarioCategory[] = ["IAM", "ITR", "NDC", "Other"];
  const years: YearTarget[] = [
    "2030",
    "2040",
    "2050",
    "2060",
    "2070",
    "2100",
    "N/A",
  ];
  const temperatures: TemperatureTarget[] = [
    "1.5C",
    "2C",
    "2.5C",
    "3C",
    "4C",
    "N/A",
  ];
  const regions: Region[] = [
    "Global",
    "EU",
    "SEA",
    "Americas",
    "Africa",
    "Asia Pacific",
    "N/A",
  ];
  const sectors: Sector[] = [
    "Power",
    "Oil & Gas",
    "Coal",
    "Renewables",
    "Industrial",
    "Transport",
    "Buildings",
    "Agriculture",
    "N/A",
  ];

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
          selectedValue={filters.targetYear}
          onChange={(value) => onFilterChange("targetYear", value)}
        />

        <FilterDropdown
          label="Temperature"
          options={temperatures}
          selectedValue={filters.targetTemperature}
          onChange={(value) => onFilterChange("targetTemperature", value)}
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
