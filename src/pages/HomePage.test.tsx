import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { scenariosData } from "../data/scenariosData";
import { Scenario } from "../types";
import userEvent from "@testing-library/user-event";

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

describe("HomePage integration: dropdowns render and filter with 'None'", () => {
// IMPORTANT: we dynamically render HomePage AFTER mocking scenariosData,
// so these tests don't interfere with any existing unit tests in this file.
let HomePageUnderTest: React.ComponentType<any>;

const fixtures = [
  {
    id: "A",
    name: "Scenario A (no sectors, no geo, no temp)",
    sectors: undefined,          // -> Sector "None"
    geography: undefined,        // -> Geography "None"
    modelTempIncrease: undefined,// -> Temperature "None"
    pathwayType: "Net Zero",
    modelYearEnd: 2050,
  },
  {
    id: "B",
    name: "Scenario B (Power, Europe, 2°C)",
    sectors: [{ name: "Power" }],
    geography: ["Europe"],
    modelTempIncrease: "2°C",
    pathwayType: "Net Zero",
    modelYearEnd: 2050,
  },
  {
    id: "C",
    name: "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    sectors: [],                 // -> Sector "None"
    geography: [],               // -> Geography "None"
    modelTempIncrease: "1.5°C",
    pathwayType: "NZi2050",
    modelYearEnd: 2040,
  },
  {
    id: "D",
    name: "Scenario D (Industry, Asia, no temp)",
    sectors: [{ name: "Industry" }],
    geography: ["Asia"],
    modelTempIncrease: undefined,// -> Temperature "None"
    pathwayType: "BAU",
    modelYearEnd: 2030,
  },
] as const;

async function mountWithFixtures() {
  // Reset module graph so our mock applies to the next import.
  vi.resetModules();
  // Mock BEFORE importing HomePage
  vi.doMock("../data/scenariosData", () => ({ scenariosData: fixtures }), { virtual: true });
  HomePageUnderTest = (await import("./HomePage")).default;
  render(<HomePageUnderTest />);
}

async function openDropdown(labelRegex: RegExp) {
  // Assumes the FilterDropdown trigger is a button with visible label text.
  // If your triggers aren't labeled, consider adding aria-labels for stability.
  const trigger = await screen.findByRole("button", { name: labelRegex });
  await userEvent.click(trigger);
  return trigger;
}

async function selectOption(optionText: string) {
  const opt = await screen.findByText(optionText, {}, { timeout: 2000 });
  await userEvent.click(opt);
}

function expectVisible(names: string[]) {
  for (const n of names) expect(screen.getByText(n)).toBeInTheDocument();
}
function expectHidden(names: string[]) {
  for (const n of names) expect(screen.queryByText(n)).not.toBeInTheDocument();
}

  beforeEach(async () => {
    await mountWithFixtures();
  });

  it("Sector: shows 'None' when any scenario has no sectors, selecting it filters correctly", async () => {
    await openDropdown(/sector/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Only scenarios with no sectors: A (undefined), C (empty array)
    expectVisible([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);
    expectHidden([
      "Scenario B (Power, EU, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
    ]);
  });

  it("Geography: shows 'None' when any scenario has missing/empty geography, selecting it filters correctly", async () => {
    await openDropdown(/geography/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Only scenarios with no geography: A (undefined), C (empty array)
    expectVisible([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);
    expectHidden([
      "Scenario B (Power, EU, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
    ]);
  });

  it("Temperature: shows 'None' when any scenario omits temperature, selecting it filters correctly", async () => {
    await openDropdown(/temperature|temp(?:erature)?/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Scenarios with no temperature: A and D
    expectVisible([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario D (Industry, Asia, no temp)",
    ]);
    expectHidden([
      "Scenario B (Power, EU, 2°C)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);
  });
});
