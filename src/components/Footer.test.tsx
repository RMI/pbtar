import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer component", () => {
  // Helper function to render Footer with MemoryRouter
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
  };

  it("renders the title text correctly", () => {
    renderFooter();
    expect(
      screen.getByText("Climate Transition Scenarios Repository"),
    ).toBeInTheDocument();
  });

  it("contains About Us link with correct path", () => {
    renderFooter();
    const aboutLink = screen.getByText("About Us");
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink.getAttribute("href")).toBe("/about");
  });

  it("contains Contact Us email link", () => {
    renderFooter();
    const contactLink = screen.getByText("Contact Us");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest("a")).toHaveAttribute(
      "href",
      "mailto:contact@rmi.org",
    );
  });

  it("displays the current year in the copyright notice", () => {
    renderFooter();
    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} RMI`)),
    ).toBeInTheDocument();
  });

  it("contains the BarChart3 icon", () => {
    renderFooter();
    // Since icons don't have accessible text, we check for their parent container
    const titleSection = screen
      .getByText("Climate Transition Scenarios Repository")
      .closest("div");
    expect(titleSection).toBeInTheDocument();
    // We can check that the SVG is present (assuming BarChart3 renders as SVG)
    expect(titleSection?.querySelector("svg")).toBeInTheDocument();
  });
});
