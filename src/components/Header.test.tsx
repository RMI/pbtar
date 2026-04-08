import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByText("Created by")).toBeInTheDocument();
  });

  it("contains the RMI logo image", () => {
    renderHeader();
    const logo = screen.getByAltText("RMI logo");
    expect(logo).toBeInTheDocument();
  });

  it("shows Resources dropdown links", async () => {
    renderHeader();
    const user = userEvent.setup();

    expect(
      screen.getByRole("link", { name: "Contact Us" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /resources/i }));

    expect(
      screen.getByRole("menuitem", { name: "Methodology" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Use cases" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "How to choose a pathway" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "FAQs" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Blog / Changelog" }),
    ).toBeInTheDocument();
  });
});
