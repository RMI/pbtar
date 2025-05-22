import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header component", () => {
  // Helper function to render Header with MemoryRouter
  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
  };

  it("renders the site title", () => {
    renderHeader();
    // Assuming your Header has a site title text
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("displays the organization name", () => {
    renderHeader();
    expect(screen.getByText("by RMI")).toBeInTheDocument();
  });

  it("renders the navigation links to Home and About pages", () => {
    renderHeader();
    expect(screen.getByText("Scenarios")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});
