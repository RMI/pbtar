import React, { useState, useEffect, useRef } from "react";
import ScenarioCard from "../components/ScenarioCard";
import SearchSection from "../components/SearchSection";
import { scenariosData } from "../data/scenariosData";
import { filterScenarios } from "../utils/searchUtils";
import { SearchFilters, Scenario } from "../types";

const ScenarioSearch: React.FC = () => {
  // Ref for the top section to handle scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);
  // Ref for the search section to detect sticky state
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // State to track if search section is sticky
  const [isSticky, setIsSticky] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    pathwayType: null,
    modelYearNetzero: null,
    modelTempIncrease: null,
    geography: null,
    sector: null,
    metric: null,
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
        filters.pathwayType !== prevFiltersRef.current.pathwayType ||
        filters.modelYearNetzero !== prevFiltersRef.current.modelYearNetzero ||
        filters.modelTempIncrease !==
          prevFiltersRef.current.modelTempIncrease ||
        filters.geography !== prevFiltersRef.current.geography ||
        filters.sector !== prevFiltersRef.current.sector ||
        filters.metric !== prevFiltersRef.current.metric;

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

  // Detect sticky state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = topSectionRef.current?.offsetTop || 0;

      // Only update if state actually changes (performance optimization)
      if (scrollPosition > threshold !== isSticky) {
        setIsSticky(scrollPosition > threshold);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initialize on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky]);

  const handleFilterChange = <T extends string | number>(
    key: keyof SearchFilters,
    value: T | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // Search is already applied through the useEffect
  };

  const handleClear = () => {
    setFilters({
      pathwayType: null,
      modelYearNetzero: null,
      modelTempIncrease: null,
      geography: null,
      sector: null,
      metric: null,
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
      <div
        ref={searchSectionRef}
        className={`sticky rounded-lg top-0 z-10 bg-white inset-x-0 transition-shadow duration-200 ${isSticky ? "shadow-md" : ""}`}
        style={{ margin: "0 calc(-50vw + 50%)" }}
      >
        <div className="container mx-auto px-4 py-2">
          <SearchSection
            filters={filters}
            scenariosNumber={filteredScenarios.length}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFiltering ? "opacity-50" : "opacity-100"}`}
      >
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            searchTerm={filters.searchTerm}
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

export default ScenarioSearch;
