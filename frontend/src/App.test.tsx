import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders the heading with correct text", () => {
    render(<App />);

    // Get all headings
    const headingElements = screen.getAllByRole("heading", { level: 1 });

    // Find the one with "Home Page" text
    const homePageHeading = headingElements.find(
      (heading) => heading.textContent === "Home Page",
    );

    // Check if we found it
    expect(homePageHeading).toBeInTheDocument();
  });
});
