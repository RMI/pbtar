import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContent } from "./App";

vi.mock("./pages/LandingPage", () => ({
  default: () => <div data-testid="mock-homepage">LandingPage</div>,
}));

describe("App component", () => {
  it("renders the LandingPage component", () => {
    render(
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mock-homepage")).toBeInTheDocument();
  });
});
