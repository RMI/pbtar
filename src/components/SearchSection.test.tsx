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

  function openByLabel(labelText: string) {
    const labelEl = screen.getByText(labelText);
    const wrapper = labelEl.parentElement;
    if (!wrapper) throw new Error("Wrapper not found for label: " + labelText);
    const btn = wrapper.querySelector("button");
    if (!btn)
      throw new Error("Dropdown trigger button not found for: " + labelText);
    fireEvent.click(btn);
    return btn;
  }

  it("renders all filter dropdowns", () => {
    render(<SearchSection {...defaultProps} />);

    expect(screen.getByText("Pathway Type")).toBeInTheDocument();
    expect(screen.getByText("Target Year")).toBeInTheDocument();
    expect(screen.getByText("Temperature (°C)")).toBeInTheDocument();
    expect(screen.getByText("Geography")).toBeInTheDocument();
    expect(screen.getByText("Sector")).toBeInTheDocument();
  });

  // This test checks that sectors are properly extracted from the complex object structure
  it("correctly extracts sector names from complex sector objects", () => {
    render(<SearchSection {...defaultProps} />);

    // Open sector dropdown
    openByLabel("Sector");

    // Verify that all unique sector names from the mock data are in the dropdown
    expect(screen.getByText("Agriculture")).toBeInTheDocument();
    expect(screen.getByText("Land Use")).toBeInTheDocument();
    expect(screen.getByText("Steel")).toBeInTheDocument();
    expect(screen.getByText("Buildings")).toBeInTheDocument();
  });

  it("calls onFilterChange with the correct sector name when selected", () => {
    render(<SearchSection {...defaultProps} />);

    // Open sector dropdown
    openByLabel("Sector");

    // Select the "Power" sector
    const powerOption = screen.getByText("Land Use");
    fireEvent.click(powerOption);

    // Verify array-emitting multi-select
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("sector", [
      "Land Use",
    ]);
  });

  it("shows selected count in the sector trigger", () => {
    const propsWithSector = {
      ...defaultProps,
      filters: { sector: ["Power"] } as unknown as SearchFilters,
    };
    render(<SearchSection {...propsWithSector} />);
    // Trigger shows "1 selected"
    const labelEl = screen.getByText("Sector");
    const wrapper = labelEl.parentElement as HTMLElement;
    expect(wrapper.querySelector("button")?.textContent).toMatch(/1 selected/i);
  });

  it("can clear selected sector filter", () => {
    // Create props with a selected sector
    const propsWithSector = {
      ...defaultProps,
      filters: { sector: "Power" } as SearchFilters,
    };

    render(<SearchSection {...propsWithSector} />);

    // Open dropdown and click "Clear" control
    openByLabel("Sector");
    fireEvent.click(screen.getByText("Clear"));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("sector", []);
  });

  it("doesn't break when sectors are objects with name and tooltip properties", () => {
    render(<SearchSection {...defaultProps} />);

    // Try to open each dropdown to ensure they render without errors
    openByLabel("Sector");

    openByLabel("Pathway Type");
    expect(screen.getByText("Direct Policy")).toBeInTheDocument();
    expect(screen.getByText("Exploratory")).toBeInTheDocument();
    expect(screen.getByText("Normative")).toBeInTheDocument();
    expect(screen.getByText("Predictive")).toBeInTheDocument();
  });

  it("Geography: mode toggle to ALL dispatches modes update", () => {
    render(<SearchSection {...defaultProps} />);
    const label = screen.getByText("Geography");
    const wrapper = label.parentElement as HTMLElement;
    const trigger = wrapper.querySelector('button[aria-haspopup="listbox"]')!;
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTitle("Match all (AND)"));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("modes", {
      geography: "ALL",
    });
  });

  it("Sector: mode toggle to ANY dispatches modes update (from existing ALL)", () => {
    const props = {
      ...defaultProps,
      filters: { modes: { sector: "ALL" } } as unknown as SearchFilters,
    };
    render(<SearchSection {...props} />);
    const label = screen.getByText("Sector");
    const wrapper = label.parentElement as HTMLElement;
    const trigger = wrapper.querySelector('button[aria-haspopup="listbox"]')!;
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTitle("Match any (OR)"));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("modes", {
      sector: "ANY",
    });
  });
});
