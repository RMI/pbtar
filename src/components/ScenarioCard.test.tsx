import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScenarioCard from "./ScenarioCard";
import { Scenario } from "../types";

describe("ScenarioCard component", () => {
  // Mock scenario data
  const mockScenario: Scenario = {
    id: "scenario-1",
    name: "Net Zero 2050",
    description:
      "A scenario describing the path to net zero emissions by 2050.",
    category: "Policy",
    category_tooltip:
      "Policy scenarios focus on regulatory and legislative measures.",
    target_year: "2050",
    target_temperature: "1.5°C",
    regions: ["Global", "Europe", "North America", "Asia"],
    sectors: [
      { name: "Power", tooltip: "Electricity generation and distribution" },
      { name: "Transport", tooltip: "Transportation and logistics" },
      { name: "Industrial", tooltip: "Manufacturing and industrial processes" },
      { name: "Buildings", tooltip: "Residential and commercial buildings" },
    ],
    publisher: "IEA",
    published_date: "Jan 2023",
    overview: "Mock",
    expertRecommendation: "Mock",
    dataSource: {
      description: "Mock Data Source",
      url: "https://example.com/data-source",
      downloadAvailable: true,
    },
  };

  // Helper function to render component with router context
  const renderScenarioCard = (scenario: Scenario = mockScenario) => {
    return render(
      <MemoryRouter>
        <ScenarioCard scenario={scenario} />
      </MemoryRouter>,
    );
  };

  it("renders the scenario name and description", () => {
    renderScenarioCard();

    expect(screen.getByText(mockScenario.name)).toBeInTheDocument();
    expect(screen.getByText(mockScenario.description)).toBeInTheDocument();
  });

  it("links to the correct scenario detail page", () => {
    const { container } = renderScenarioCard();

    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", `/scenario/${mockScenario.id}`);
  });

  it("displays the category badge", () => {
    renderScenarioCard();

    const categoryBadge = screen.getByText(mockScenario.category);
    expect(categoryBadge).toBeInTheDocument();
  });

  it("shows target year and temperature badges", () => {
    renderScenarioCard();

    expect(screen.getByText(mockScenario.target_year)).toBeInTheDocument();
    expect(
      screen.getByText(mockScenario.target_temperature),
    ).toBeInTheDocument();
  });

  it("displays region information with the first 3 regions", () => {
    renderScenarioCard();

    expect(screen.getByText("Regions:")).toBeInTheDocument();

    // Check first 3 regions are displayed
    expect(screen.getByText(mockScenario.regions[0])).toBeInTheDocument();
    expect(screen.getByText(mockScenario.regions[1])).toBeInTheDocument();
    expect(screen.getByText(mockScenario.regions[2])).toBeInTheDocument();
  });

  it("shows '+1 more' text when there are more than 3 regions", () => {
    renderScenarioCard();

    const moreTextElements = screen.getAllByText("+1 more");
    expect(moreTextElements.length).toBeGreaterThan(0);
  });

  it("doesn't show '+X more' text when there are exactly 3 regions", () => {
    const scenarioWithThreeRegions = {
      ...mockScenario,
      regions: ["Global", "Europe", "North America"],
    };

    renderScenarioCard(scenarioWithThreeRegions);

    const moreText = screen.queryByText("+0 more");
    expect(moreText).not.toBeInTheDocument();
  });

  it("displays sector information with the first 3 sectors", () => {
    renderScenarioCard();

    expect(screen.getByText("Sectors:")).toBeInTheDocument();

    // Check first 3 sectors are displayed
    expect(screen.getByText(mockScenario.sectors[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockScenario.sectors[1].name)).toBeInTheDocument();
    expect(screen.getByText(mockScenario.sectors[2].name)).toBeInTheDocument();
  });

  it("shows '+1 more' text when there are more than 3 sectors", () => {
    renderScenarioCard();

    const moreTextElements = screen.getAllByText("+1 more");
    expect(moreTextElements.length).toBeGreaterThan(0);
  });

  it("shows publisher information", () => {
    renderScenarioCard();

    expect(screen.getByText("Publisher:")).toBeInTheDocument();
    expect(screen.getByText(mockScenario.publisher)).toBeInTheDocument();
  });

  it("shows published date information", () => {
    renderScenarioCard();

    expect(screen.getByText("Published:")).toBeInTheDocument();
    expect(screen.getByText(mockScenario.published_date)).toBeInTheDocument();
  });

  it("displays the 'View details' text with icon", () => {
    renderScenarioCard();

    expect(screen.getByText("View details")).toBeInTheDocument();

    // Check if the ChevronRight icon is rendered
    const viewDetailsElement = screen.getByText("View details").closest("span");
    expect(viewDetailsElement?.querySelector("svg")).toBeInTheDocument();
  });

  // Testing responsive layout classes
  it("has the main container classes for styling", () => {
    const { container } = renderScenarioCard();

    const card = container.firstChild;
    if (!(card instanceof HTMLElement)) {
      throw new Error("Expected container.firstChild to be an HTMLElement");
    }
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("shadow-md");
    expect(card).toHaveClass("flex");
    expect(card).toHaveClass("flex-col");
    expect(card).toHaveClass("h-full");
  });

  describe("'+n more' tooltip functionality", () => {
    // Create a test scenario with more than 3 regions and sectors
    const testScenario: Scenario = {
      id: "test-scenario",
      name: "Test Scenario",
      description: "Test description",
      category: "IAM",
      category_tooltip: "Category tooltip",
      target_year: "2050",
      target_temperature: "1.5C",
      regions: ["Global", "EU", "Americas", "Africa", "Asia Pacific"], // 5 regions
      sectors: [
        { name: "Power", tooltip: "Power tooltip" },
        { name: "Oil & Gas", tooltip: "Oil & Gas tooltip" },
        { name: "Coal", tooltip: "Coal tooltip" },
        { name: "Renewables", tooltip: "Renewables tooltip" },
        { name: "Transport", tooltip: "Transport tooltip" },
      ], // 5 sectors
      publisher: "Test Publisher",
      published_date: "2025-01-01",
      overview: "Test overview",
      expertRecommendation: "Test recommendation",
      dataSource: {
        description: "Test data source",
        url: "https://example.com",
        downloadAvailable: true,
      },
    };

    it("shows '+n more' text for regions when more than 3 regions exist", () => {
      const { container } = renderScenarioCard(testScenario);

      // Find the regions section
      const regionsSection = Array.from(container.querySelectorAll("p")).find(
        (p) => p.textContent === "Regions:",
      );

      if (!regionsSection) {
        throw new Error("Regions section not found");
      }

      // Get the parent div of the Regions section
      const regionsSectionContainer = regionsSection.closest("div");

      // Check if the "+2 more" text exists within the regions section
      const moreTextInRegionsSection = Array.from(
        regionsSectionContainer?.querySelectorAll("span") || [],
      ).some((span) => span.textContent === "+2 more");

      expect(moreTextInRegionsSection).toBe(true);
    });

    it("shows '+n more' text for sectors when more than 3 sectors exist", () => {
      const { container } = renderScenarioCard(testScenario);

      // Find the sectors section
      const sectorsSection = Array.from(container.querySelectorAll("p")).find(
        (p) => p.textContent === "Sectors:",
      );

      if (!sectorsSection) {
        throw new Error("Sectors section not found");
      }

      // Get the parent div of the Sectors section
      const sectorsSectionContainer = sectorsSection.closest("div");

      // Check if the "+2 more" text exists within the sectors section
      const moreTextInSectorsSection = Array.from(
        sectorsSectionContainer?.querySelectorAll("span") || [],
      ).some((span) => span.textContent === "+2 more");

      expect(moreTextInSectorsSection).toBe(true);
    });

    it("includes all remaining regions in the tooltip", () => {
      renderScenarioCard(testScenario);

      // First 3 regions should be visible as badges
      expect(screen.getByText("Global")).toBeInTheDocument();
      expect(screen.getByText("EU")).toBeInTheDocument();
      expect(screen.getByText("Americas")).toBeInTheDocument();

      // The remaining 2 regions should be in the tooltip
      // Note: This will find the text content even though it's initially hidden
      const tooltipContent = screen.getByText("Africa");
      expect(tooltipContent).toBeInTheDocument();
      expect(screen.getByText("Asia Pacific")).toBeInTheDocument();
    });

    it("does not show '+n more' when 3 or fewer regions exist", () => {
      const scenarioWithFewRegions = {
        ...testScenario,
        regions: ["Global", "EU", "Americas"],
      };

      const { container } = renderScenarioCard(scenarioWithFewRegions);

      // Find the regions section
      const regionsSection = Array.from(container.querySelectorAll("p")).find(
        (p) => p.textContent === "Regions:",
      );

      if (!regionsSection) {
        throw new Error("Regions section not found");
      }

      // Get the parent div of the Regions section
      const regionsSectionContainer = regionsSection.closest("div");

      // Check that there's no "+n more" text in the regions section
      const moreTextInRegionsSection = Array.from(
        regionsSectionContainer?.querySelectorAll("span") || [],
      ).some((span) => /\+\d+ more/.test(span.textContent || ""));

      expect(moreTextInRegionsSection).toBe(false);
    });

    it("applies whitespace-nowrap to multi-word regions in tooltip", () => {
      renderScenarioCard(testScenario);

      // Find the tooltip content for "Asia Pacific"
      const multiWordRegion = screen.getByText("Asia Pacific");

      // Check that it's wrapped in a span with the whitespace-nowrap class
      expect(multiWordRegion.tagName).toBe("SPAN");
      expect(multiWordRegion).toHaveClass("whitespace-nowrap");
    });
  });
});

describe("ScenarioCard search highlighting", () => {
  const mockScenario: Scenario = {
    id: "scenario-1",
    name: "Net Zero 2050",
    description:
      "A scenario describing the path to net zero emissions by 2050.",
    category: "Policy",
    category_tooltip: "Policy scenarios focus on regulatory measures.",
    target_year: "2050",
    target_temperature: "1.5°C",
    regions: ["Global", "Europe", "North America", "Hidden Match Region"],
    sectors: [
      { name: "Power", tooltip: "Electricity generation" },
      { name: "Transport", tooltip: "Transportation" },
      { name: "Industrial", tooltip: "Manufacturing" },
      { name: "Hidden Match Sector", tooltip: "This would normally be hidden" },
    ],
    publisher: "IEA",
    published_date: "Jan 2023",
    overview: "Test overview",
    expertRecommendation: "Test recommendation",
    dataSource: {
      description: "Test Source",
      url: "https://example.com",
      downloadAvailable: true,
    },
  };

  const renderWithRouter = (searchTerm = "") => {
    return render(
      <MemoryRouter>
        <ScenarioCard
          scenario={mockScenario}
          searchTerm={searchTerm}
        />
      </MemoryRouter>,
    );
  };

  it("highlights matching text in name and description", () => {
    const { container } = renderWithRouter("zero");

    // Find marks directly in the container
    const marks = container.querySelectorAll("mark");

    // Check that we found at least 2 marks (name and description)
    expect(marks.length).toBeGreaterThanOrEqual(2);

    // Check that there's a mark with "Zero" and one with "zero"
    const markTexts = Array.from(marks).map((mark) => mark.textContent);
    expect(markTexts).toContain("Zero");
    expect(markTexts).toContain("zero");
  });

  it("prioritizes and shows regions that match search term even if they would normally be hidden", () => {
    const { container } = renderWithRouter("Hidden Match");

    // Look for the regions section
    const regionsSection = Array.from(container.querySelectorAll("p")).find(
      (p) => p.textContent === "Regions:",
    );

    // Find nearby badge with Hidden Match Region text (could be split across elements)
    if (!regionsSection) {
      throw new Error("Regions section not found");
    }

    // Find a badge containing the text "Hidden Match Region" in the parent div of the Regions section
    const sectionContainer = regionsSection.closest("div");
    const hiddenMatchText = Array.from(
      sectionContainer?.querySelectorAll(".flex-wrap span") || [],
    ).some((span) => span.textContent?.includes("Hidden Match Region"));

    expect(hiddenMatchText).toBe(true);

    // Check that the "+more" text still exists
    const moreText = Array.from(container.querySelectorAll("span")).some(
      (span) => /\+\d+ more/.test(span.textContent || ""),
    );

    expect(moreText).toBe(true);
  });

  it("prioritizes and shows sectors that match search term even if they would normally be hidden", () => {
    const { container } = renderWithRouter("Hidden Match");

    // Look for the sectors section
    const sectorsSection = Array.from(container.querySelectorAll("p")).find(
      (p) => p.textContent === "Sectors:",
    );

    if (!sectorsSection) {
      throw new Error("Sectors section not found");
    }

    // Find a badge containing the text "Hidden Match Sector" in the parent div of the Sectors section
    const sectionContainer = sectorsSection.closest("div");
    const hiddenMatchText = Array.from(
      sectionContainer?.querySelectorAll(".flex-wrap span") || [],
    ).some((span) => span.textContent?.includes("Hidden Match Sector"));

    expect(hiddenMatchText).toBe(true);
  });
});
