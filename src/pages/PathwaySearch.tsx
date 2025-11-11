import React, { useState, useEffect, useRef } from "react";
import PathwayCard from "../components/PathwayCard";
import SearchSection from "../components/SearchSection";
import StepByStepGuide from "../components/StepByStepGuide";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { filterPathways } from "../utils/searchUtils";
import { SearchFilters, PathwayMetadataType } from "../types";

const PathwaySearch: React.FC = () => {
  // Ref for the top section to handle scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
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

  const [filteredPathways, setFilteredPathways] =
    useState<PathwayMetadataType[]>(pathwayMetadata);
  const [isFiltering, setIsFiltering] = useState(false);
  const prevFiltersRef = useRef<SearchFilters>(filters);

  useEffect(() => {
    const applyFilters = () => {
      setIsFiltering(true);
      const result = filterPathways(pathwayMetadata, filters);
      setFilteredPathways(result);

      const hasFilterChanged =
        filters.searchTerm !== prevFiltersRef.current.searchTerm ||
        filters.pathwayType !== prevFiltersRef.current.pathwayType ||
        filters.modelYearNetzero !== prevFiltersRef.current.modelYearNetzero ||
        filters.modelTempIncrease !==
          prevFiltersRef.current.modelTempIncrease ||
        filters.geography !== prevFiltersRef.current.geography ||
        filters.sector !== prevFiltersRef.current.sector ||
        filters.metric !== prevFiltersRef.current.metric;

      if (hasFilterChanged && topSectionRef.current) {
        window.scrollTo({
          top: topSectionRef.current.offsetTop - 20,
          behavior: "smooth",
        });
      }

      prevFiltersRef.current = { ...filters };
      setTimeout(() => setIsFiltering(false), 300);
    };

    applyFilters();
  }, [filters]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = topSectionRef.current?.offsetTop || 0;

      if (scrollPosition > threshold !== isSticky) {
        setIsSticky(scrollPosition > threshold);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
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
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <section
        ref={topSectionRef}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-rmigray-800 mb-2">
          Find Climate Transition Pathways
        </h1>
        <p className="text-rmigray-600">
          Browse our repository of climate transition pathways to find the most
          relevant ones for your assessment needs.
        </p>
      </section>

      <StepByStepGuide
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div
        ref={searchSectionRef}
        className={`sticky rounded-lg top-0 z-10 bg-gray-50 inset-x-0 transition-shadow duration-200 ${isSticky ? "shadow-md" : ""}`}
        style={{ margin: "0 calc(-50vw + 50%)" }}
      >
        <div className="container mx-auto px-4 py-2">
          <SearchSection
            filters={filters}
            pathwaysNumber={filteredPathways.length}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 bg-gray-50 ${
          isFiltering ? "opacity-50" : "opacity-100"
        }`}
      >
        {filteredPathways.map((pathway) => (
          <PathwayCard
            key={pathway.id}
            pathway={pathway}
            searchTerm={filters.searchTerm}
          />
        ))}
      </div>

      {filteredPathways.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-rmigray-700 mb-2">
            No pathways found
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

export default PathwaySearch;
