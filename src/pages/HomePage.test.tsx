import { describe, it, expect, vi, beforeEach } from "vitest";
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
  let HomePageUnderTest: React.ComponentType<unknown>;

  // Use a typed userEvent instance to avoid "no-unsafe-call" on user interactions
  let u: ReturnType<typeof userEvent.setup>;

  const fixtures = [
    {
      id: "A",
      name: "Scenario A (no sectors, no geo, no temp)",
      sectors: undefined, // -> Sector "None"
      geography: undefined, // -> Geography "None"
      modelTempIncrease: undefined, // -> Temperature "None"
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
      sectors: [], // -> Sector "None"
      geography: [], // -> Geography "None"
      modelTempIncrease: "1.5°C",
      pathwayType: "NZi2050",
      modelYearEnd: 2040,
    },
    {
      id: "D",
      name: "Scenario D (Industry, Asia, no temp)",
      sectors: [{ name: "Industry" }],
      geography: ["Asia"],
      modelTempIncrease: undefined, // -> Temperature "None"
      pathwayType: "BAU",
      modelYearEnd: 2030,
    },
  ] as const;

  async function mountWithFixtures(): Promise<void> {
    // Reset module graph so our mock applies to the next import.
    vi.resetModules();
    // Mock BEFORE importing HomePage
    vi.doMock("../data/scenariosData", () => ({ scenariosData: fixtures }), {
      virtual: true,
    });
    HomePageUnderTest = (await import("./HomePage")).default;
    render(<HomePageUnderTest />);
  }

  async function openDropdown(labelRegex: RegExp): Promise<HTMLButtonElement> {
    // Multiple nodes can match the regex (e.g., scenario cards: "no sectors"/"no temp").
    // Pick the *label* whose parent contains the dropdown trigger button.
    const labels = await screen.findAllByText(
      labelRegex,
      {},
      { timeout: 2000 },
    );
    const label = labels.find((el) =>
      el.parentElement?.querySelector('button[aria-haspopup="listbox"]'),
    );
    if (!label) {
      // Helpful debug if this ever fails in CI
      const all = labels.map((n) => `"${n.textContent}"`).join(", ");
      throw new Error(
        `Dropdown label not found for ${labelRegex}. Candidates: ${all}`,
      );
    }
    const trigger = label.parentElement!.querySelector(
      'button[aria-haspopup="listbox"]',
    );
    if (!trigger)
      throw new Error(`Trigger button not found for ${label.textContent}`);
    await u.click(trigger);
    return trigger;
  }

  async function selectOption(optionText: string): Promise<void> {
    const opt = await screen.findByText(optionText, {}, { timeout: 2000 });
    await u.click(opt);
  }

  function expectVisible(names: string[]) {
    for (const n of names) expect(screen.getByText(n)).toBeInTheDocument();
  }
  function expectHidden(names: string[]) {
    for (const n of names)
      expect(screen.queryByText(n)).not.toBeInTheDocument();
  }

  // Vitest awaits async hooks; this is safe in tests.
  beforeEach(async () => {
    u = userEvent.setup();
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
      "Scenario B (Power, Europe, 2°C)",
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
      "Scenario B (Power, Europe, 2°C)",
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
      "Scenario B (Power, Europe, 2°C)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);
  });

  // Concrete selection (requested): pick a real value and ensure only matching scenarios remain
  it("Sector: selecting a concrete option (Power) filters correctly", async () => {
    await openDropdown(/sector/i);
    // Select a real sector option
    await selectOption("Power");
    // Only Scenario B has sector "Power"
    expectVisible(["Scenario B (Power, Europe, 2°C)"]);
    expectHidden([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
      "Scenario D (Industry, Asia, no temp)",
    ]);
  });
});
