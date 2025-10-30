import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchSection from "./SearchSection";
import { SearchFilters } from "../types";
import { PathwayMetadataType } from "../types";

// Mock the pathwayMetadata import
vi.mock("../data/pathwayMetadata", async () => {
  const [s1, s2, s3, s4] = await Promise.all([
    import("../../testdata/valid/pathwayMetadata_sample_01.json", {
      assert: { type: "json" },
    }),
    import("../../testdata/valid/pathwayMetadata_sample_02.json", {
      assert: { type: "json" },
    }),
    import("../../testdata/valid/pathwayMetadata_sample_03.json", {
      assert: { type: "json" },
    }),
    import("../../testdata/valid/pathwayMetadata_sample_04.json", {
      assert: { type: "json" },
    }),
  ]);

  const mockScenarios = [
    s1.default,
    s2.default,
    s3.default,
    s4.default,
  ] as PathwayMetadataType[];

  return { pathwayMetadata: mockScenarios };
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
    // Labels now live inside the trigger’s accessible name (e.g., "Sector..." or "Sector: 3").
    const btn = screen.getByRole("button", {
      name: new RegExp(`^${labelText}\\b`, "i"),
    });
    fireEvent.click(btn);
    return btn;
  }

  it("renders all filter dropdowns", () => {
    render(<SearchSection {...defaultProps} />);

    // Labels are the button’s accessible name prefix (followed by "..." or ": N").
    expect(
      screen.getByRole("button", { name: /^Pathway Type\b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Target Year\b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Temperature\b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Geography\b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Sector\b/i }),
    ).toBeInTheDocument();
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
    // Trigger shows "Sector: 1"
    const trigger = screen.getByRole("button", { name: /^Sector\b/i });
    expect(trigger).toHaveTextContent(/Sector:\s*1/i);
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
    const trigger = screen.getByRole("button", { name: /^Geography\b/i });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("mode-toggle"));
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
    const trigger = screen.getByRole("button", { name: /^Sector\b/i });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("mode-toggle"));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith("modes", {
      sector: "ANY",
    });
  });

  describe("does NOT render ANY/ALL toggle for scalar facets", () => {
    for (const facet of [
      "Pathway Type",
      "Target Year",
      "Temperature",
    ] as const) {
      it(`facet: ${facet}`, () => {
        render(<SearchSection {...defaultProps} />);
        const trigger = screen.getByRole("button", {
          name: new RegExp(`^${facet}\\b`, "i"),
        });
        fireEvent.click(trigger);
        expect(screen.queryByTitle("Match any (OR)")).not.toBeInTheDocument();
        expect(screen.queryByTitle("Match all (AND)")).not.toBeInTheDocument();
        // close popover to avoid overlapping menus in the loop
        fireEvent.keyDown(document, { key: "Escape" });
      });
    }
  });

  describe("Clear all filters button (inline with summary)", () => {
    it("does not render the button when no filters are applied", () => {
      render(<SearchSection {...defaultProps} />);
      expect(screen.queryByTestId("clear-all-filters")).toBeNull();
      // Summary still renders
      expect(screen.getByText(/Found 2 pathways/i)).toBeInTheDocument();
    });

    it("renders the inline button when any filter is applied and calls onClear", () => {
      const props = {
        ...defaultProps,
        filters: { ...defaultProps.filters, geography: ["Europe"] },
      };
      render(<SearchSection {...props} />);

      // Button should be present and visually near the summary (inline within the same <p>)
      const paragraph = screen.getByText(/Found \d+ pathways/i).closest("p");
      expect(paragraph).toBeTruthy();
      const clearBtn = screen.getByTestId("clear-all-filters");
      expect(clearBtn).toBeInTheDocument();
      // Ensure the button is inside the same paragraph node (inline placement)
      expect(paragraph?.contains(clearBtn)).toBe(true);

      clearBtn.click();
      expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
    });
  });
});
