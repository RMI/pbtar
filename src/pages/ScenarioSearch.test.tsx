import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScenarioSearch from "./ScenarioSearch";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { Scenario } from "../types";
import userEvent from "@testing-library/user-event";

// Mock the PathwayCard component to simplify testing
vi.mock("../components/PathwayCard", () => ({
  default: ({ pathway }: { pathway: Scenario }) => (
    <div
      data-testid="scenario-card"
      data-scenario-id={pathway.id}
    >
      {pathway.name}
    </div>
  ),
}));

describe("ScenarioSearch component", () => {
  const renderScenarioSearch = () => {
    return render(
      <MemoryRouter>
        <ScenarioSearch />
      </MemoryRouter>,
    );
  };

  it("renders the main heading", () => {
    renderScenarioSearch();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Find Climate Transition Scenarios",
    );
  });

  it("displays the introductory paragraph", () => {
    renderScenarioSearch();

    expect(
      screen.getByText(
        "Browse our repository of climate transition scenarios to find the most relevant ones for your assessment needs.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a PathwayCard for each scenario in the data", () => {
    renderScenarioSearch();
    // Check that the correct number of scenario cards are rendered
    const scenarioCards = screen.getAllByTestId("scenario-card");
    expect(scenarioCards).toHaveLength(pathwayMetadata.length);
  });
});

describe("ScenarioSearch integration: dropdowns render and filter with 'None'", () => {
  // IMPORTANT: we dynamically render ScenarioSearch AFTER mocking pathwayMetadata,
  // so these tests don't interfere with any existing unit tests in this file.
  let ScenarioSearchUnderTest: React.ComponentType<unknown>;

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
      modelYearNetzero: 2050,
      metric: [],
    },
    {
      id: "B",
      name: "Scenario B (Power, Europe, 2°C)",
      sectors: [{ name: "Power" }],
      geography: ["Europe"],
      modelTempIncrease: "2°C",
      pathwayType: "Net Zero",
      modelYearNetzero: 2050,
      metric: ["Capacity"],
    },
    {
      id: "C",
      name: "Scenario C (empty sectors[], empty geo[], 1.5°C)",
      sectors: [], // -> Sector "None"
      geography: [], // -> Geography "None"
      modelTempIncrease: "1.5°C",
      pathwayType: "NZi2050",
      modelYearNetzero: 2040,
      metric: [],
    },
    {
      id: "D",
      name: "Scenario D (Industry, Asia, no temp)",
      sectors: [{ name: "Industry" }],
      geography: ["Asia"],
      modelTempIncrease: undefined, // -> Temperature "None"
      pathwayType: "BAU",
      modelYearNetzero: 2030,
      metric: ["Capacity", "Generation"],
    },
    {
      id: "E",
      name: "Scenario E (Power, Europe+Asia, 2°C)",
      sectors: [{ name: "Power" }],
      geography: ["Europe", "Asia"],
      modelTempIncrease: "2°C",
      pathwayType: "Net Zero",
      modelYearNetzero: 2050,
      metric: ["Generation"],
    },
  ] as const;

  async function mountWithFixtures(): Promise<void> {
    // Reset module graph so our mock applies to the next import.
    vi.resetModules();
    // Mock BEFORE importing ScenarioSearch
    vi.doMock(
      "../data/pathwayMetadata",
      () => ({ pathwayMetadata: fixtures }),
      {
        virtual: true,
      },
    );
    ScenarioSearchUnderTest = (await import("./ScenarioSearch")).default;
    render(<ScenarioSearchUnderTest />);
  }

  async function openDropdown(labelRegex: RegExp): Promise<HTMLButtonElement> {
    // Labels are now inside the trigger button’s accessible name (e.g., "Sector..." / "Sector: 2").
    const triggers = await screen.findAllByRole(
      "button",
      { name: labelRegex },
      { timeout: 2000 },
    );
    const trigger =
      triggers.find((b) => b.getAttribute("aria-haspopup") === "listbox") ??
      triggers[0];
    if (!trigger) {
      const all = (await screen.findAllByRole("button"))
        .map((n) => `"${n.textContent}"`)
        .join(", ");
      throw new Error(
        `Dropdown trigger not found for ${labelRegex}. Button candidates: ${all}`,
      );
    }
    await u.click(trigger);
    return trigger as HTMLButtonElement;
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

  it("Sector: selecting a concrete option (metric) filters correctly", async () => {
    await openDropdown(/metric/i);
    await selectOption("Capacity");
    expectVisible([
      "Scenario B (Power, Europe, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
    ]);
    expectHidden([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
      "Scenario E (Power, Europe+Asia, 2°C)",
    ]);
  });

  it("Geography: ANY vs ALL toggle affects results (Europe + Asia)", async () => {
    await openDropdown(/geography/i);
    await selectOption("Europe");
    await selectOption("Asia");

    // ANY (default): shows anything with Europe OR Asia → B, D, E
    expectVisible([
      "Scenario B (Power, Europe, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
      "Scenario E (Power, Europe+Asia, 2°C)",
    ]);

    // Switch to ALL inside the open menu
    await u.click(screen.getByTestId("mode-toggle"));
    // Only E has both Europe and Asia
    expectVisible(["Scenario E (Power, Europe+Asia, 2°C)"]);
    expectHidden([
      "Scenario B (Power, Europe, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);
  });

  it("Metric: ANY vs ALL toggle affects results (Europe + Asia)", async () => {
    await openDropdown(/metric/i);
    await selectOption("Capacity");
    await selectOption("Generation");

    // ANY
    expectVisible([
      "Scenario B (Power, Europe, 2°C)",
      "Scenario D (Industry, Asia, no temp)",
      "Scenario E (Power, Europe+Asia, 2°C)",
    ]);
    expectHidden([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
    ]);

    // Switch to ALL inside the open menu
    await u.click(screen.getByTestId("mode-toggle"));
    // ALL
    expectVisible(["Scenario D (Industry, Asia, no temp)"]);
    expectHidden([
      "Scenario A (no sectors, no geo, no temp)",
      "Scenario B (Power, Europe, 2°C)",
      "Scenario C (empty sectors[], empty geo[], 1.5°C)",
      "Scenario E (Power, Europe+Asia, 2°C)",
    ]);
  });
});
