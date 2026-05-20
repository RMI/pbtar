import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

describe("LandingPage navigation", () => {
  it("uses the shared header nav resources menu", async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    expect(
      screen.getByRole("link", { name: "Contact Us" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /resources/i }));

    expect(
      screen.getByRole("menuitem", { name: "How to choose a pathway" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Use cases" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Methodology" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Updates" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "FAQs" })).toBeInTheDocument();
  });
});
