import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchSection from "./SearchSection";
import { SearchFilters } from "../types";

// Mock the scenariosData import
vi.mock("../data/scenariosData", async () => {
  const mockScenarios = (
    await import("../../testdata/valid/scenarios_metadata_sample_array.json", {
      assert: { type: "json" },
    })
  ).default as import("../types").Scenario[];
  return { scenariosData: mockScenarios };
});

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
    expect(screen.getByText("Agriculture")).toBeInTheDocument();
    expect(screen.getByText("Land Use")).toBeInTheDocument();
    expect(screen.getByText("Steel")).toBeInTheDocument();
    expect(screen.getByText("Buildings")).toBeInTheDocument();
  });

  it("calls onFilterChange with the correct sector name when selected", () => {
    render(<SearchSection {...defaultProps} />);

    // Open sector dropdown
    const sectorDropdown = screen.getByText("Sector");
    fireEvent.click(sectorDropdown);

    // Select the "Power" sector
    const powerOption = screen.getByText("Land Use");
    fireEvent.click(powerOption);

    // Verify the filter change is called with the correct parameter
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
      "sector",
      "Land Use",
    );
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
    expect(screen.getByText("Agriculture")).toBeInTheDocument();

    const pathwayDropdown = screen.getByText("Pathway Type");
    fireEvent.click(pathwayDropdown);
    expect(screen.getByText("Direct Policy")).toBeInTheDocument();
    expect(screen.getByText("Exploratory")).toBeInTheDocument();
    expect(screen.getByText("Normative")).toBeInTheDocument();
    expect(screen.getByText("Predictive")).toBeInTheDocument();
  });
});
