import React, { useState, useEffect } from "react";
import ScenarioCard from "../components/ScenarioCard";
import SearchSection from "../components/SearchSection";
import { scenariosData } from "../data/scenariosData";
import { filterScenarios } from "../utils/searchUtils";
import { SearchFilters, Scenario } from "../types";

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    category: null,
    target_year: null,
    target_temperature: null,
    region: null,
    sector: null,
    searchTerm: "",
  });

  const [filteredScenarios, setFilteredScenarios] =
    useState<Scenario[]>(scenariosData);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const applyFilters = () => {
      setIsFiltering(true);
      const result = filterScenarios(scenariosData, filters);
      setFilteredScenarios(result);
      setTimeout(() => setIsFiltering(false), 300);
    };

    applyFilters();
  }, [filters]);

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // Search is already applied through the useEffect
  };

  const handleClear = () => {
    setFilters({
      category: null,
      target_year: null,
      target_temperature: null,
      region: null,
      sector: null,
      searchTerm: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-rmigray-800 mb-2">
          Find Climate Transition Scenarios
        </h1>
        <p className="text-rmigray-600">
          Browse our repository of climate transition scenarios to find the most
          relevant ones for your assessment needs.
        </p>
      </section>

      <SearchSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="mb-4">
        <p className="text-sm text-rmigray-500">
          Found {filteredScenarios.length} scenarios
          {(filters.searchTerm ||
            filters.category ||
            filters.region ||
            filters.sector ||
            filters.target_year ||
            filters.target_temperature) &&
            " matching your criteria"}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFiltering ? "opacity-50" : "opacity-100"}`}
      >
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
          />
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-rmigray-700 mb-2">
            No scenarios found
          </h3>
          <p className="text-rmigray-500 mb-4">
            Try adjusting your search filters.
          </p>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
