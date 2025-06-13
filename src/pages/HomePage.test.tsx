import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { scenariosData } from "../data/scenariosData";
import { Scenario } from "../types";

// Mock the ScenarioCard component to simplify testing
vi.mock("../components/ScenarioCard", () => ({
  default: ({ scenario }: { scenario: Scenario }) => (
    <div
      data-testid="scenario-card"
      data-scenario-id={scenario.id}
    >
      {scenario.name}
    </div>
  ),
}));

describe("HomePage component", () => {
  const renderHomePage = () => {
    return render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
  };

  it("renders the main heading", () => {
    renderHomePage();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Find Climate Transition Scenarios",
    );
  });

  it("displays the introductory paragraph", () => {
    renderHomePage();

    expect(
      screen.getByText(
        "Browse our repository of climate transition scenarios to find the most relevant ones for your assessment needs.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a ScenarioCard for each scenario in the data", () => {
    renderHomePage();
    // Check that the correct number of scenario cards are rendered
    const scenarioCards = screen.getAllByTestId("scenario-card");
    expect(scenarioCards).toHaveLength(scenariosData.length);
  });
});
