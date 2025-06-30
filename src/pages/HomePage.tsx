import React, { useState, useEffect, useRef } from "react";
import ScenarioCard from "../components/ScenarioCard";
import SearchSection from "../components/SearchSection";
import { scenariosData } from "../data/scenariosData";
import { filterScenarios } from "../utils/searchUtils";
import { SearchFilters, Scenario } from "../types";

const HomePage: React.FC = () => {
  // Ref for the top section to handle scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);

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

  // Track previous filter state to detect changes
  const prevFiltersRef = useRef<SearchFilters>(filters);

  useEffect(() => {
    const applyFilters = () => {
      setIsFiltering(true);
      const result = filterScenarios(scenariosData, filters);
      setFilteredScenarios(result);

      // Check if filters have changed meaningfully
      const hasFilterChanged =
        filters.searchTerm !== prevFiltersRef.current.searchTerm ||
        filters.category !== prevFiltersRef.current.category ||
        filters.target_year !== prevFiltersRef.current.target_year ||
        filters.target_temperature !==
          prevFiltersRef.current.target_temperature ||
        filters.region !== prevFiltersRef.current.region ||
        filters.sector !== prevFiltersRef.current.sector;

      // Scroll to top when filters change
      if (hasFilterChanged && topSectionRef.current) {
        window.scrollTo({
          top: topSectionRef.current.offsetTop - 20, // Slight offset for better UX
          behavior: "smooth",
        });
      }

      // Update the previous filters reference
      prevFiltersRef.current = { ...filters };

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
      <section
        ref={topSectionRef}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-rmigray-800 mb-2">
          Find Climate Transition Scenarios
        </h1>
        <p className="text-rmigray-600">
          Browse our repository of climate transition scenarios to find the most
          relevant ones for your assessment needs.
        </p>
      </section>
      <div className="sticky top-0 z-10 py-4 bg-white -mx-4 px-4">
        <SearchSection
          filters={filters}
          scenariosNumber={filteredScenarios.length}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
        />
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
