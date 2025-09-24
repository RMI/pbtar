import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScenarioCard from "./ScenarioCard";
import { Scenario } from "../types";

// Mock scenario data
import rawScenarioArray from "../../testdata/valid/scenarios_metadata_standard.json" assert { type: "json" };
const mockScenario: Scenario = rawScenarioArray[0];

// Mock full scenario data
import rawScenarioFull from "../../testdata/valid/scenarios_metadata_full.json" assert { type: "json" };
const mockScenarioFull: Scenario = rawScenarioFull[0];

// Helper function to render component with router context
const renderScenarioCard = (scenario: Scenario = mockScenario) => {
  return render(
    <MemoryRouter>
      <ScenarioCard
        scenario={scenario}
        searchTerm=""
      />
    </MemoryRouter>,
  );
};
//
function withClientWidth<T>(width: number, run: () => T): T {
  const desc = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth",
  );

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get(this: HTMLElement): number {
      return width;
    },
  });

  try {
    return run();
  } finally {
    if (desc) {
      Object.defineProperty(HTMLElement.prototype, "clientWidth", desc);
    } else {
      // define a safe fallback getter if none existed
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get(): number {
          return 0;
        },
      });
    }
  }
}

describe("ScenarioCard component", () => {
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

  it("displays the pathwayType badge", () => {
    renderScenarioCard();

    const pathwayTypeBadge = screen.getByText(mockScenario.pathwayType);
    expect(pathwayTypeBadge).toBeInTheDocument();
  });

  it("shows target year and temperature badges", () => {
    renderScenarioCard();

    expect(screen.getByText(mockScenario.modelYearNetzero)).toBeInTheDocument();
    expect(
      screen.getByText(mockScenario.modelTempIncrease?.toString() + "°C"),
    ).toBeInTheDocument();
  });

  it("displays geography information with some geography visible", () => {
    renderScenarioCard();

    expect(screen.getByText("Geographies:")).toBeInTheDocument();

    // Check that at least the first geography is displayed
    expect(screen.getByText(mockScenario.geography[0])).toBeInTheDocument();
  });

  it("displays sector information with some sectors visible", () => {
    renderScenarioCard();

    expect(screen.getByText("Sectors:")).toBeInTheDocument();

    // Check that at least the first sector is displayed
    expect(screen.getByText(mockScenario.sectors[0].name)).toBeInTheDocument();
  });

  it("shows publisher information", () => {
    renderScenarioCard();

    expect(screen.getByText("Publisher:")).toBeInTheDocument();
    expect(screen.getByText(mockScenario.publisher)).toBeInTheDocument();
  });

  it("shows published date information", () => {
    renderScenarioCard();

    expect(screen.getByText("Published:")).toBeInTheDocument();
    expect(screen.getByText(mockScenario.publicationYear)).toBeInTheDocument();
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
    it("shows '+n more' text when there are too many sectors to display", () => {
      const { container } = renderScenarioCard(mockScenarioFull);

      // Find the sectors section
      const sectorsSection = Array.from(container.querySelectorAll("p")).find(
        (p) => p.textContent === "Sectors:",
      );

      if (!sectorsSection) {
        throw new Error("Sectors section not found");
      }

      // Get the parent div of the Sectors section
      const sectorsSectionContainer = sectorsSection.closest("div");

      // Check if any "+n more" text exists within the sectors section
      const moreTextElements = Array.from(
        sectorsSectionContainer?.querySelectorAll("span") || [],
      ).filter((span) => /\+\d+ more/.test(span.textContent || ""));

      // There should be at least one "+n more" element
      expect(moreTextElements.length).toBeGreaterThan(0);

      // The number in "+n more" should be positive
      const moreTextMatch =
        moreTextElements[0].textContent?.match(/\+(\d+) more/);
      expect(moreTextMatch).not.toBeNull();
      if (moreTextMatch) {
        const countNumber = parseInt(moreTextMatch[1]);
        expect(countNumber).toBeGreaterThan(0);
      }
    });

    it("handles geography display appropriately based on available space", () => {
      // Create a scenario with only 2 geographies
      const scenarioWithFewGeography = {
        ...mockScenarioFull,
        geography: ["Global", "EU"], // Only 2 geography
      };

      const { container } = renderScenarioCard(scenarioWithFewGeography);

      // Find the geography section
      const geographySection = Array.from(container.querySelectorAll("p")).find(
        (p) => p.textContent === "Geographies:",
      );
      if (!geographySection) throw new Error("Geography section not found");

      // Get the parent container of the geography section
      const geographySectionContainer = geographySection.closest("div");
      if (!geographySectionContainer)
        throw new Error("Geography section container not found");

      // Check if there's a "+n more" text
      const hasMoreText = Array.from(
        geographySectionContainer.querySelectorAll("span"),
      ).some((span) => /\+\d+ more/.test(span.textContent || ""));

      // If we find "+n more" text, ensure it only shows 1 more (since we have 2 geography total)
      if (hasMoreText) {
        const moreTextMatch = Array.from(
          geographySectionContainer.querySelectorAll("span"),
        )
          .find((span) => /\+\d+ more/.test(span.textContent || ""))
          ?.textContent?.match(/\+(\d+) more/);

        expect(moreTextMatch).not.toBeNull();
        if (moreTextMatch) {
          const countNumber = parseInt(moreTextMatch[1]);
          expect(countNumber).toBeLessThanOrEqual(1); // Should show at most 1 more (we have 2 geography total)
        }
      } else {
        // If there's no "+n more" text, ensure at least one geography is visible
        expect(screen.queryByText("Global")).not.toBeNull();
      }
    });
  });

  it("renders mapped country names on badges (not ISO2 codes)", () => {
    const scenario = {
      ...mockScenario,
      geography: ["Global", "APAC", "DE"], // CN should render as "China"
    };

    // Make the container wide enough for 3+ badges in JSDOM
    withClientWidth(1000, () => {
      renderScenarioCard(scenario);

      expect(screen.getByText("Global")).toBeInTheDocument();
      expect(screen.getByText("APAC")).toBeInTheDocument();
      expect(screen.getByText("Germany")).toBeInTheDocument();
      expect(screen.queryByText(/^DE$/)).toBeNull(); // ensure code itself isn't shown
    });
  });
});

describe("ScenarioCard search highlighting", () => {
  const mockScenario: Scenario = {
    ...mockScenarioFull,
    geography: [...mockScenarioFull.geography, "Hidden Match Geography"],
    sectors: [
      ...mockScenarioFull.sectors,
      { name: "Hidden Match Sector", technologies: ["Other"] },
    ],
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
    const { container } = renderWithRouter("enum");

    // Find marks directly in the container
    const marks = container.querySelectorAll("mark");

    // Check that we found at least 2 marks (name and description)
    expect(marks.length).toBeGreaterThanOrEqual(2);

    // Check that there's a mark with "Enum" (in name) and one with "enum" (in description)
    const markTexts = Array.from(marks).map((mark) => mark.textContent);
    expect(markTexts).toContain("Enum");
    expect(markTexts).toContain("enum");
  });

  it("prioritizes and shows geographies that match search term even if they would normally be hidden", () => {
    const { container } = renderWithRouter("Hidden Match");

    // Look for the geography section
    const geographySection = Array.from(container.querySelectorAll("p")).find(
      (p) => p.textContent === "Geographies:",
    );

    // Find nearby badge with Hidden Match Geography text (could be split across elements)
    if (!geographySection) {
      throw new Error("Geographies section not found");
    }

    // Find a badge containing the text "Hidden Match Geography" in the parent div of the Geography section
    const sectionContainer = geographySection.closest("div");
    const hiddenMatchText = Array.from(
      sectionContainer?.querySelectorAll(".flex-wrap span") || [],
    ).some((span) => span.textContent?.includes("Hidden Match Geography"));

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

describe("tooltip functionality", () => {
  it("uses correct tooltip for Policy pathway type", () => {
    const scenarioWithPolicy: Scenario = {
      ...mockScenario,
      pathwayType: "Direct Policy",
    };

    renderScenarioCard(scenarioWithPolicy);

    const badge = screen.getByText("Direct Policy");
    expect(badge).toBeInTheDocument();
    const tooltipTrigger = badge.closest("span")?.parentElement;
    expect(tooltipTrigger).toHaveAttribute("tabindex", "0");
    expect(tooltipTrigger).toHaveAttribute(
      "class",
      expect.stringContaining("cursor-help"),
    );
  });

  it("uses correct tooltip for Power sector", () => {
    const scenarioWithPowerSector: Scenario = {
      ...mockScenario,
      sectors: [{ name: "Power" }],
    };

    renderScenarioCard(scenarioWithPowerSector);

    const badge = screen.getByText("Power");
    expect(badge).toBeInTheDocument();
    const tooltipTrigger = badge.closest("span")?.parentElement;
    expect(tooltipTrigger).toHaveAttribute("tabindex", "0");
    expect(tooltipTrigger).toHaveAttribute(
      "class",
      expect.stringContaining("cursor-help"),
    );
  });

  describe("ScenarioCard robustness with non-string values", () => {
    const renderWithRouter = (scenario: Scenario, searchTerm = "") =>
      render(
        <MemoryRouter>
          <ScenarioCard
            scenario={scenario}
            searchTerm={searchTerm}
          />
        </MemoryRouter>,
      );

    it("does not crash when highlighting numeric fields", () => {
      const s: Scenario = {
        ...mockScenario,
        // Using a double cast to satisfy TS, but this still presents as numeric at runtime.
        modelYearNetzero: 2030 as unknown as string, // number on purpose
        publicationYear: 2024 as unknown as string, // number
      };

      expect(() => renderWithRouter(s, "2030")).not.toThrow();
      // Should render stringified year and highlight it
      expect(screen.getByText("2030")).toBeInTheDocument();
      // mark exists for the numeric match (adjust selector if your Highlighter differs)
      const marked = document.querySelectorAll("mark");
      expect(Array.from(marked).some((m) => m.textContent === "2030")).toBe(
        true,
      );
    });

    it("does not crash with null / undefined text fields", () => {
      const s: Scenario = {
        ...mockScenario,
        // Using a double cast to satisfy TS, but this still presents as null/undefined at runtime.
        description: null as unknown as string, // null
        publisher: undefined as unknown as string, // undefined
      };

      expect(() => renderWithRouter(s, "rmi")).not.toThrow();
      // Card chrome still there
      expect(screen.getByText("Pathway type:")).toBeInTheDocument();
      expect(screen.getByText("Publisher:")).toBeInTheDocument();
      // No “[object Object]” leaks
      expect(document.body.textContent).not.toContain("[object Object]");
    });

    it("highlights matches inside stringified numbers", () => {
      const s: Scenario = {
        ...mockScenario,
        // Using a double cast to satisfy TS, but this still presents as null/undefined at runtime.
        modelYearNetzero: 2045 as unknown as string, // number on purpose
      };
      const { container } = renderWithRouter(s, "2045");
      const marks = container.querySelectorAll("mark");
      expect(Array.from(marks).some((m) => m.textContent === "2045")).toBe(
        true,
      );
    });
  });
});
