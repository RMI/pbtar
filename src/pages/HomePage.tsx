import React, { useState, useEffect, useRef } from "react";
import ScenarioCard from "../components/ScenarioCard";
import SearchSection from "../components/SearchSection";
import { scenariosData } from "../data/scenariosData";
import { filterScenarios } from "../utils/searchUtils";
import { SearchFilters, Scenario } from "../types";

const HomePage: React.FC = () => {
  // Ref for the top section to handle scrolling
  const topSectionRef = useRef<HTMLDivElement>(null);
  // Ref for the search section to detect sticky state
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // State to track if search section is sticky
  const [isSticky, setIsSticky] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    pathwayType: null,
    modelYearEnd: null,
    modelTempIncrease: null,
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
        filters.pathwayType !== prevFiltersRef.current.pathwayType ||
        filters.modelYearEnd !== prevFiltersRef.current.modelYearEnd ||
        filters.modelTempIncrease !==
          prevFiltersRef.current.modelTempIncrease ||
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

  // Detect sticky state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = topSectionRef.current?.offsetTop || 0;

      // Only update if state actually changes (performance optimization)
      if (scrollPosition > threshold !== isSticky) {
        setIsSticky(scrollPosition > threshold);
        console.log("Sticky state changed to:", scrollPosition > threshold);
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
      modelYearEnd: null,
      modelTempIncrease: null,
      region: null,
      sector: null,
      searchTerm: "",
    });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section
        ref={topSectionRef}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-energy-100 via-white to-rmiblue-100 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-bluespruce mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-energy-700 to-bluespruce">Transition Pathways</span>
            </h1>
    
            <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
              New to transition pathways? Check out our whitepaper or get started with the step-by-step guide.<br/><br/>
              Or browse, filter, and explore the curated repository of transition pathways below.
            </p>
      
            <div className="mt-8 flex gap-4">
              <a
                href="#scenarios"
                className="inline-flex items-center rounded-full bg-bluespruce px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-bluespruce/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-energy-400 transition-colors"
              >
                Step by Step Guide
              </a>
          
              <a
                href="#filters"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-bluespruce border border-bluespruce/30 hover:border-bluespruce/60 hover:bg-white/60 backdrop-blur-sm transition"
              >
                Jump to scenarios
              </a>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-energy-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rmiblue-200/30 blur-3xl" />
      </section>

      {/* Sticky search panel */}
      <div
        ref={searchSectionRef}
        id="filters"
        className={`sticky top-0 z-20 transition-all duration-300 ${isSticky ? "shadow-md backdrop-blur-md bg-white/85" : "bg-white"}`}
      >
        <div className="mx-auto max-w-7xl px-6 py-2">
          <SearchSection
            filters={filters}
            scenariosNumber={filteredScenarios.length}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </div>
        {/* subtle divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* Scenarios Grid */}
      <div
        id="scenarios"
        className={`mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isFiltering ? "opacity-60" : "opacity-100"}`}
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
        <div className="mx-auto max-w-3xl text-center py-16">
          <h3 className="text-xl font-semibold text-neutral-800 mb-3">
            No scenarios found
          </h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search filters or clearing them to see all available scenarios.
            </p>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 bg-energy text-bluespruce font-medium rounded-full hover:bg-energy-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-energy-400"
            >
              Clear all filters
            </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
