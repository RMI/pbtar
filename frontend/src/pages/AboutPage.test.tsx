import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AboutPage from "./AboutPage";

describe("AboutPage component", () => {
  // Helper function to render AboutPage with MemoryRouter
  const renderAboutPage = () => {
    return render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );
  };

  it("renders the site title", () => {
    renderAboutPage();
    // Assuming your AboutPage has a site title text
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "About the Climate Transition Scenarios Repository",
    );
  });

  it("displays all section headings", () => {
    renderAboutPage();
    // Check for section headings
    expect(screen.getByText("Purpose")).toBeInTheDocument();
    expect(
      screen.getByText("Climate Transition Assessments"),
    ).toBeInTheDocument();
    expect(screen.getByText("How to Use This Repository")).toBeInTheDocument();
  });

  it("shows all steps in the usage guide", () => {
    renderAboutPage();
    // Check for the numbered steps
    expect(screen.getByText("1. Browse Scenarios")).toBeInTheDocument();
    expect(screen.getByText("2. Filter and Search")).toBeInTheDocument();
    expect(screen.getByText("3. Compare Scenarios")).toBeInTheDocument();
    expect(screen.getByText("4. Access Data")).toBeInTheDocument();
  });

  it("contains the external link to learn more about CTAs", () => {
    renderAboutPage();
    const learnMoreLink = screen.getByText(
      "Learn more about Climate Transition Assessments",
    );
    expect(learnMoreLink).toBeInTheDocument();
    expect(learnMoreLink.closest("a")).toHaveAttribute(
      "href",
      "https://rmi.org/transitionfinance/",
    );
    expect(learnMoreLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(learnMoreLink.closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("renders the lucide icons", () => {
    renderAboutPage();
    // At least two icons should be present (Mail and ExternalLink)
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThanOrEqual(2);
  });

  it("contains the key informational paragraphs", () => {
    renderAboutPage();
    // Check for some distinctive text content
    expect(
      screen.getByText(/designed to help financial institutions/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /CTAs are most effective when they consider multiple transition scenarios/i,
      ),
    ).toBeInTheDocument();
  });

  describe("accessibility", () => {
    it("has proper heading hierarchy", () => {
      renderAboutPage();
      const h1Elements = screen.getAllByRole("heading", { level: 1 });
      expect(h1Elements).toHaveLength(1);

      const h2Elements = screen.getAllByRole("heading", { level: 2 });
      expect(h2Elements.length).toBeGreaterThanOrEqual(4); // 4 section headers

      const h3Elements = screen.getAllByRole("heading", { level: 3 });
      expect(h3Elements.length).toBe(4); // 4 steps
    });

    it("provides proper attributes for external links", () => {
      renderAboutPage();
      const externalLinks = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("target") === "_blank");

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("styling and layout", () => {
    it("uses container class for layout", () => {
      renderAboutPage();
      const container = screen
        .getByText("About the Climate Transition Scenarios Repository")
        .closest("div.container");
      expect(container).toBeInTheDocument();
    });

    it("has proper section styling", () => {
      renderAboutPage();
      const sections = document.querySelectorAll("section");
      sections.forEach((section) => {
        expect(section).toHaveClass("bg-white");
        expect(section).toHaveClass("rounded-lg");
        expect(section).toHaveClass("shadow-md");
      });
    });
  });
});
