import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { FilterProvider, useFilters, EMPTY_FILTERS } from "./FilterContext";
import type { SearchFilters } from "../types";

const FilterConsumer = () => {
  const { filters, setFilters, resetFilters } = useFilters();
  return (
    <div>
      <span data-testid="search-term">{filters.searchTerm}</span>
      <span data-testid="geography">{JSON.stringify(filters.geography)}</span>
      <button
        data-testid="set-filter"
        onClick={() =>
          setFilters((prev) => ({ ...prev, searchTerm: "persistent" }))
        }
      >
        Set filter
      </button>
      <button
        data-testid="reset"
        onClick={resetFilters}
      >
        Reset
      </button>
    </div>
  );
};

describe("FilterContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("provides empty filters by default", () => {
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    expect(screen.getByTestId("search-term").textContent).toBe("");
    expect(screen.getByTestId("geography").textContent).toBe("null");
  });

  it("updates filter state when setFilters is called", async () => {
    const u = userEvent.setup();
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    await u.click(screen.getByTestId("set-filter"));
    expect(screen.getByTestId("search-term").textContent).toBe("persistent");
  });

  it("writes updated filters to sessionStorage on change", async () => {
    const u = userEvent.setup();
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    await u.click(screen.getByTestId("set-filter"));
    const stored = JSON.parse(
      sessionStorage.getItem("pathway-filters")!,
    ) as SearchFilters;
    expect(stored.searchTerm).toBe("persistent");
  });

  it("hydrates from sessionStorage on mount", () => {
    sessionStorage.setItem(
      "pathway-filters",
      JSON.stringify({ ...EMPTY_FILTERS, searchTerm: "pre-saved" }),
    );
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    expect(screen.getByTestId("search-term").textContent).toBe("pre-saved");
  });

  it("resetFilters clears state and removes the sessionStorage entry", async () => {
    const u = userEvent.setup();
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    await u.click(screen.getByTestId("set-filter"));
    expect(screen.getByTestId("search-term").textContent).toBe("persistent");

    await u.click(screen.getByTestId("reset"));
    expect(screen.getByTestId("search-term").textContent).toBe("");
    expect(sessionStorage.getItem("pathway-filters")).toBeNull();
  });

  it("falls back to empty filters when sessionStorage contains invalid JSON", () => {
    sessionStorage.setItem("pathway-filters", "not-valid-json{{{");
    render(
      <FilterProvider>
        <FilterConsumer />
      </FilterProvider>,
    );
    expect(screen.getByTestId("search-term").textContent).toBe("");
  });

  it("filters persist across simulated route navigation", async () => {
    const u = userEvent.setup();

    const ListPage = () => (
      <div>
        <FilterConsumer />
        <Link to="/detail/1">Go to detail</Link>
      </div>
    );
    const DetailPage = () => (
      <div>
        <span>Detail view</span>
        <Link to="/">Back to list</Link>
      </div>
    );

    render(
      <FilterProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route
              path="/"
              element={<ListPage />}
            />
            <Route
              path="/detail/:id"
              element={<DetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </FilterProvider>,
    );

    await u.click(screen.getByTestId("set-filter"));
    expect(screen.getByTestId("search-term").textContent).toBe("persistent");

    await u.click(screen.getByText("Go to detail"));
    expect(screen.getByText("Detail view")).toBeInTheDocument();

    await u.click(screen.getByText("Back to list"));
    expect(screen.getByTestId("search-term").textContent).toBe("persistent");
  });

  it("throws when useFilters is used outside FilterProvider", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FilterConsumer />)).toThrow(
      "useFilters must be used within a FilterProvider",
    );
    errorSpy.mockRestore();
  });
});
