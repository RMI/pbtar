import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchSection from "./SearchSection";
import { SearchFilters } from "../types";

// Mock the scenariosData import
vi.mock("../data/scenariosData", () => ({
  scenariosData: [
    {
      id: "scenario-1",
      name: "Net Zero 2050",
      description:
        "A scenario describing the path to net zero emissions by 2050.",
      pathwayType: "Policy",
      pathway_type_tooltip: "Policy tooltip test",
      modelYearEnd: "2050",
      modelTempIncrease: 1.5,
      regions: ["Global", "Europe"],
      sectors: [
        { name: "Power", tooltip: "Electricity generation and distribution" },
        { name: "Transport", tooltip: "Transportation and logistics" },
      ],
      publisher: "IEA",
      publicationYear: "Jan 2023",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: true,
      },
    },
    {
      id: "scenario-2",
      name: "Current Policies",
      description: "A scenario based on current implemented policies.",
      pathwayType: "Projection",
      pathway_type_tooltip: "Projection tooltip test",
      modelYearEnd: "2030",
      modelTempIncrease: 2.7,
      regions: ["Global", "Asia"],
      sectors: [
        {
          name: "Industrial",
          tooltip: "Manufacturing and industrial processes",
        },
        { name: "Buildings", tooltip: "Residential and commercial buildings" },
      ],
      publisher: "IPCC",
      publicationYear: "Mar 2022",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: false,
      },
    },
    {
      id: "scenario-3",
      name: "Net Zero 2050",
      description:
        "A scenario describing the path to net zero emissions by 2050.",
      pathwayType: "Exploration",
      pathway_type_tooltip: "Exploration tooltip test",
      modelYearEnd: "2050",
      modelTempIncrease: 1.5,
      regions: ["Global", "Europe"],
      sectors: [
        { name: "Power", tooltip: "Electricity generation and distribution" },
        { name: "Transport", tooltip: "Transportation and logistics" },
      ],
      publisher: "IEA",
      publicationYear: "Jan 2023",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: true,
      },
    },
    {
      id: "scenario-4",
      name: "Net Zero 2050",
      description:
        "A scenario describing the path to net zero emissions by 2050.",
      pathwayType: "Normative",
      pathway_type_tooltip: "Normative tooltip test",
      modelYearEnd: "2050",
      modelTempIncrease: 1.5,
      regions: ["Global", "Europe"],
      sectors: [
        { name: "Power", tooltip: "Electricity generation and distribution" },
        { name: "Transport", tooltip: "Transportation and logistics" },
      ],
      publisher: "IEA",
      publicationYear: "Jan 2023",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: true,
      },
    },
  ],
}));

describe("SearchSection", () => {
  // Default props for the component
  const defaultProps = {
    filters: {} as SearchFilters,
    scenariosNumber: 2,
    onFilterChange: vi.fn(),
    onSearch: vi.fn(),
    onClear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter dropdowns", () => {
    render(<SearchSection {...defaultProps} />);

    expect(screen.getByText("Pathway Type")).toBeInTheDocument();
    expect(screen.getByText("Target Year")).toBeInTheDocument();
    expect(screen.getByText("Temperature (°C)")).toBeInTheDocument();
    expect(screen.getByText("Region")).toBeInTheDocument();
    expect(screen.getByText("Sector")).toBeInTheDocument();
  });

  // This test checks that sectors are properly extracted from the complex object structure
  it("correctly extracts sector names from complex sector objects", () => {
    render(<SearchSection {...defaultProps} />);

    // Open sector dropdown
    const sectorDropdown = screen.getByText("Sector");
    fireEvent.click(sectorDropdown);

    // Verify that all unique sector names from the mock data are in the dropdown
    expect(screen.getByText("Power")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("Industrial")).toBeInTheDocument();
    expect(screen.getByText("Buildings")).toBeInTheDocument();
  });

  it("calls onFilterChange with the correct sector name when selected", () => {
    render(<SearchSection {...defaultProps} />);

    // Open sector dropdown
    const sectorDropdown = screen.getByText("Sector");
    fireEvent.click(sectorDropdown);

    // Select the "Power" sector
    const powerOption = screen.getByText("Power");
    fireEvent.click(powerOption);

    // Verify the filter change is called with the correct parameter
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("sector", "Power");
  });

  it("properly displays selected sector in the dropdown button", () => {
    // Create props with a selected sector
    const propsWithSector = {
      ...defaultProps,
      filters: { sector: "Power" } as SearchFilters,
    };

    render(<SearchSection {...propsWithSector} />);

    // The dropdown button should show the selected sector name
    const sectorButton = screen.getByText("Power");
    expect(sectorButton).toBeInTheDocument();
  });

  it("can clear selected sector filter", () => {
    // Create props with a selected sector
    const propsWithSector = {
      ...defaultProps,
      filters: { sector: "Power" } as SearchFilters,
    };

    render(<SearchSection {...propsWithSector} />);

    // Find the clear button (X icon) next to the sector name
    const powerText = screen.getByText("Power");
    const clearButton = powerText.nextElementSibling;

    // Add null check to handle potential null value
    if (!clearButton) {
      throw new Error("Clear button not found next to 'Power' text");
    }

    fireEvent.click(clearButton);

    // Verify the filter was cleared
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("sector", null);
  });

  it("doesn't break when sectors are objects with name and tooltip properties", () => {
    render(<SearchSection {...defaultProps} />);

    // Try to open each dropdown to ensure they render without errors
    const sectorDropdown = screen.getByText("Sector");
    fireEvent.click(sectorDropdown);
    expect(screen.getByText("Power")).toBeInTheDocument();

    const pathwayDropdown = screen.getByText("Pathway Type");
    fireEvent.click(pathwayDropdown);
    expect(screen.getByText("Exploration")).toBeInTheDocument();
    expect(screen.getByText("Normative")).toBeInTheDocument();
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByText("Projection")).toBeInTheDocument();
  });
});
