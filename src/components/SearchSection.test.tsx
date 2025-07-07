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
      category: "Policy",
      category_tooltip: "Policy scenarios focus on regulatory measures.",
      target_year: "2050",
      target_temperature: "1.5°C",
      regions: ["Global", "Europe"],
      sectors: [
        { name: "Power", tooltip: "Electricity generation and distribution" },
        { name: "Transport", tooltip: "Transportation and logistics" },
      ],
      publisher: "IEA",
      published_date: "Jan 2023",
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
      category: "Forecast",
      category_tooltip: "Forecast scenarios are based on existing trends.",
      target_year: "2030",
      target_temperature: "2.7°C",
      regions: ["Global", "Asia"],
      sectors: [
        {
          name: "Industrial",
          tooltip: "Manufacturing and industrial processes",
        },
        { name: "Buildings", tooltip: "Residential and commercial buildings" },
      ],
      publisher: "IPCC",
      published_date: "Mar 2022",
      overview: "Mock overview",
      expertRecommendation: "Mock recommendation",
      dataSource: {
        description: "Mock Data Source",
        url: "https://example.com/data-source",
        downloadAvailable: false,
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

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Target Year")).toBeInTheDocument();
    expect(screen.getByText("Temperature")).toBeInTheDocument();
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

    const categoryDropdown = screen.getByText("Category");
    fireEvent.click(categoryDropdown);
    expect(screen.getByText("Policy")).toBeInTheDocument();
    expect(screen.getByText("Forecast")).toBeInTheDocument();
  });
});
