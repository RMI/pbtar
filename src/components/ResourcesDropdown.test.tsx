import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ResourcesDropdown from "./ResourcesDropdown";

describe("ResourcesDropdown component", () => {
  const renderDropdown = () =>
    render(
      <MemoryRouter>
        <ResourcesDropdown />
      </MemoryRouter>,
    );

  it("shows the shared resource links when opened", async () => {
    renderDropdown();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /resources/i }));

    expect(
      screen.getByRole("menuitem", { name: "How to choose a pathway" }),
    ).toHaveAttribute("href", "/resources/how-to-choose-a-pathway");
    expect(screen.getByRole("menuitem", { name: "Use cases" })).toHaveAttribute(
      "href",
      "/resources/use-cases",
    );
    expect(
      screen.getByRole("menuitem", { name: "Methodology" }),
    ).toHaveAttribute("href", "/resources/methodology");
    expect(screen.getByRole("menuitem", { name: "Updates" })).toHaveAttribute(
      "href",
      "/resources/updates",
    );
    expect(screen.getByRole("menuitem", { name: "FAQs" })).toHaveAttribute(
      "href",
      "/resources/faq",
    );
  });

  it("closes when clicking outside the menu", async () => {
    renderDropdown();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /resources/i }));
    expect(
      screen.getByRole("menuitem", { name: "How to choose a pathway" }),
    ).toBeInTheDocument();

    await user.click(document.body);

    expect(
      screen.queryByRole("menuitem", { name: "How to choose a pathway" }),
    ).not.toBeInTheDocument();
  });

  it("closes after clicking a menu item", async () => {
    renderDropdown();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /resources/i }));
    await user.click(
      screen.getByRole("menuitem", { name: "How to choose a pathway" }),
    );

    expect(
      screen.queryByRole("menuitem", { name: "How to choose a pathway" }),
    ).not.toBeInTheDocument();
  });
});
