import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PathwaySearch from "./PathwaySearch";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { PathwayMetadataType } from "../types";
import userEvent from "@testing-library/user-event";

// Mock the PathwayCard component to simplify testing
vi.mock("../components/PathwayCard", () => ({
  default: ({ pathway }: { pathway: PathwayMetadataType }) => (
    <div
      data-testid="pathway-card"
      data-pathway-id={pathway.id}
    >
      {pathway.name}
    </div>
  ),
}));

describe("PathwaySearch component", () => {
  const renderPathwaySearch = () => {
    return render(
      <MemoryRouter>
        <PathwaySearch />
      </MemoryRouter>,
    );
  };

  it("renders the main heading", () => {
    renderPathwaySearch();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Find Climate Transition Pathways",
    );
  });

  it("displays the introductory paragraph", () => {
    renderPathwaySearch();

    expect(
      screen.getByText(
        "Browse our repository of climate transition pathways to find the most relevant ones for your assessment needs.",
      ),
    ).toBeInTheDocument();
  });

  it("renders a PathwayCard for each pathway in the data", () => {
    renderPathwaySearch();
    // Check that the correct number of pathway cards are rendered
    const pathwayCards = screen.getAllByTestId("pathway-card");
    expect(pathwayCards).toHaveLength(pathwayMetadata.length);
  });
});

describe("PathwaySearch integration: dropdowns render and filter with 'None'", () => {
  // IMPORTANT: we dynamically render PathwaySearch AFTER mocking pathwayMetadata,
  // so these tests don't interfere with any existing unit tests in this file.
  let PathwaySearchUnderTest: React.ComponentType<unknown>;

  // Use a typed userEvent instance to avoid "no-unsafe-call" on user interactions
  let u: ReturnType<typeof userEvent.setup>;

  const fixtures = [
    {
      id: "A",
      name: "Pathway A (no sectors, no geo, no temp)",
      sectors: undefined, // -> Sector "None"
      geography: undefined, // -> Geography "None"
      modelTempIncrease: undefined, // -> Temperature "None"
      pathwayType: "Net Zero",
      modelYearNetzero: 2050,
      metric: [],
    },
    {
      id: "B",
      name: "Pathway B (Power, Europe, 2°C)",
      sectors: [{ name: "Power" }],
      geography: ["Europe"],
      modelTempIncrease: "2°C",
      pathwayType: "Net Zero",
      modelYearNetzero: 2050,
      metric: ["Capacity"],
    },
    {
      id: "C",
      name: "Pathway C (empty sectors[], empty geo[], 1.5°C)",
      sectors: [], // -> Sector "None"
      geography: [], // -> Geography "None"
      modelTempIncrease: "1.5°C",
      pathwayType: "NZi2050",
      modelYearNetzero: 2040,
      metric: [],
    },
    {
      id: "D",
      name: "Pathway D (Industry, Asia, no temp)",
      sectors: [{ name: "Industry" }],
      geography: ["Asia"],
      modelTempIncrease: undefined, // -> Temperature "None"
      pathwayType: "BAU",
      modelYearNetzero: 2030,
      metric: ["Capacity", "Generation"],
    },
    {
      id: "E",
      name: "Pathway E (Power, Europe+Asia, 2°C)",
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
    // Mock BEFORE importing PathwaySearch
    vi.doMock(
      "../data/pathwayMetadata",
      () => ({ pathwayMetadata: fixtures }),
      {
        virtual: true,
      },
    );
    PathwaySearchUnderTest = (await import("./PathwaySearch")).default;
    render(<PathwaySearchUnderTest />);
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

  it("Sector: shows 'None' when any pathway has no sectors, selecting it filters correctly", async () => {
    await openDropdown(/sector/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Only pathways with no sectors: A (undefined), C (empty array)
    expectVisible([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
    ]);
    expectHidden([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
    ]);
  });

  it("Geography: shows 'None' when any pathway has missing/empty geography, selecting it filters correctly", async () => {
    await openDropdown(/geography/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Only pathways with no geography: A (undefined), C (empty array)
    expectVisible([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
    ]);
    expectHidden([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
    ]);
  });

  it("Temperature: shows 'None' when any pathway omits temperature, selecting it filters correctly", async () => {
    await openDropdown(/temperature|temp(?:erature)?/i);
    expect(await screen.findByText("None")).toBeInTheDocument();
    await selectOption("None");

    // Pathways with no temperature: A and D
    expectVisible([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway D (Industry, Asia, no temp)",
    ]);
    expectHidden([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
    ]);
  });

  // Concrete selection (requested): pick a real value and ensure only matching pathways remain
  it("Sector: selecting a concrete option (Power) filters correctly", async () => {
    await openDropdown(/sector/i);
    // Select a real sector option
    await selectOption("Power");
    // Only Pathway B has sector "Power"
    expectVisible(["Pathway B (Power, Europe, 2°C)"]);
    expectHidden([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
      "Pathway D (Industry, Asia, no temp)",
    ]);
  });

  it("Sector: selecting a concrete option (metric) filters correctly", async () => {
    await openDropdown(/metric/i);
    await selectOption("Capacity");
    expectVisible([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
    ]);
    expectHidden([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
      "Pathway E (Power, Europe+Asia, 2°C)",
    ]);
  });

  it("Geography: ANY vs ALL toggle affects results (Europe + Asia)", async () => {
    await openDropdown(/geography/i);
    await selectOption("Europe");
    await selectOption("Asia");

    // ANY (default): shows anything with Europe OR Asia → B, D, E
    expectVisible([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
      "Pathway E (Power, Europe+Asia, 2°C)",
    ]);

    // Switch to ALL inside the open menu
    await u.click(screen.getByTestId("mode-toggle"));
    // Only E has both Europe and Asia
    expectVisible(["Pathway E (Power, Europe+Asia, 2°C)"]);
    expectHidden([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
    ]);
  });

  it("Metric: ANY vs ALL toggle affects results (Europe + Asia)", async () => {
    await openDropdown(/metric/i);
    await selectOption("Capacity");
    await selectOption("Generation");

    // ANY
    expectVisible([
      "Pathway B (Power, Europe, 2°C)",
      "Pathway D (Industry, Asia, no temp)",
      "Pathway E (Power, Europe+Asia, 2°C)",
    ]);
    expectHidden([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
    ]);

    // Switch to ALL inside the open menu
    await u.click(screen.getByTestId("mode-toggle"));
    // ALL
    expectVisible(["Pathway D (Industry, Asia, no temp)"]);
    expectHidden([
      "Pathway A (no sectors, no geo, no temp)",
      "Pathway B (Power, Europe, 2°C)",
      "Pathway C (empty sectors[], empty geo[], 1.5°C)",
      "Pathway E (Power, Europe+Asia, 2°C)",
    ]);
  });
});
