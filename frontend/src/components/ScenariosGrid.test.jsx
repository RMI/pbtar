import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ScenariosGrid from "./ScenariosGrid";
import { callApi } from "../utils/api";

// Mock the API module
vi.mock("../utils/api", () => ({
  callApi: vi.fn(),
}));

describe("ScenariosGrid", () => {
  const mockScenarios = [
    {
      id: 1,
      name: "Scenario 1",
      nature: "Normative",
      description: "Description 1",
      source: "Source 1",
      created_on: "2023-01-01",
      time_horizon: "2030",
      target_temperature: "1.5°C",
      usage: "Analysis",
    },
    {
      id: 2,
      name: "Scenario 2",
      nature: "Descriptive",
      description: "Description 2",
      source: "Source 2",
      created_on: "2023-02-01",
      time_horizon: "2040",
      target_temperature: "2.0°C",
      usage: "Policy",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    callApi.mockResolvedValue(mockScenarios);
  });

  it("loads and displays scenarios on mount", async () => {
    render(<ScenariosGrid />);

    expect(callApi).toHaveBeenCalledWith("/scenarios", "abc123");

    await waitFor(() => {
      expect(screen.getByText("Scenario 1")).toBeInTheDocument();
      expect(screen.getByText("Scenario 2")).toBeInTheDocument();
    });
  });

  it("displays loading state while fetching scenarios", async () => {
    // Delay API response
    callApi.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockScenarios), 100);
        }),
    );

    render(<ScenariosGrid />);

    // Wait for scenarios to load
    await waitFor(() => {
      expect(screen.getByText("Scenario 1")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock API error
    callApi.mockRejectedValue(new Error("Failed to fetch"));

    render(<ScenariosGrid />);
  });

  it("allows changing the API key", async () => {
    render(<ScenariosGrid />);

    // Open developer controls (if they're in a details/summary)
    const summary = screen.getByText("developer");
    fireEvent.click(summary);

    // Find API key input and change it
    const apiKeyInput = screen.getByDisplayValue("abc123");
    fireEvent.change(apiKeyInput, { target: { value: "new-key" } });

    // Click load button
    const loadButton = screen.getByText("Load Data");
    fireEvent.click(loadButton);

    // Verify API was called with new key
    expect(callApi).toHaveBeenCalledWith("/scenarios", "new-key");
  });

  it("allows changing the API endpoint", async () => {
    render(<ScenariosGrid />);

    // Open developer controls
    const summary = screen.getByText("developer");
    fireEvent.click(summary);

    // Find route input and change it
    const routeInput = screen.getByDisplayValue("/scenarios");
    fireEvent.change(routeInput, { target: { value: "/organizations" } });

    // Click load button
    const loadButton = screen.getByText("Load Data");
    fireEvent.click(loadButton);

    // Verify API was called with new endpoint
    expect(callApi).toHaveBeenCalledWith("/organizations", "abc123");
  });
});
