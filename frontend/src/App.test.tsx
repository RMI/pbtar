import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContent } from "./App";

// Mock child components to isolate App testing
vi.mock("./components/Header", () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock("./components/Footer", () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

vi.mock("./pages/HomePage", () => ({
  default: () => <div data-testid="mock-homepage">HomePage</div>,
}));

describe("App component", () => {
  it("renders the Header component", () => {
    render(
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("renders the Footer component", () => {
    render(
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders the HomePage component", () => {
    render(
      <MemoryRouter>
        <AppContent />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("mock-homepage")).toBeInTheDocument();
  });
});
