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
    target_year: "2050",
    target_temperature: "1.5°C",
    regions: ["Global", "Europe", "North America", "Asia"],
    sectors: ["Energy", "Transport", "Industry", "Buildings"],
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
    expect(screen.getByText(mockScenario.sectors[0])).toBeInTheDocument();
    expect(screen.getByText(mockScenario.sectors[1])).toBeInTheDocument();
    expect(screen.getByText(mockScenario.sectors[2])).toBeInTheDocument();
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
});
