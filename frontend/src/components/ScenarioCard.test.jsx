import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScenarioCard from "./ScenarioCard";

describe("ScenarioCard", () => {
  const mockScenario = {
    name: "Net Zero 2050",
    nature: "Normative",
    description: "A scenario showing pathways to carbon neutrality by 2050",
    source: "IEA",
    created_on: "2022-01-15",
    time_horizon: "2050",
    target_temperature: "1.5°C",
    usage: "Policy Analysis",
  };

  it("renders scenario name and details correctly", () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText("Net Zero 2050")).toBeInTheDocument();
    expect(screen.getByText("Normative")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A scenario showing pathways to carbon neutrality by 2050",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("IEA")).toBeInTheDocument();
  });

  it("displays the correct time information", () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText("Published: 2022-01-15")).toBeInTheDocument();
    expect(screen.getByText("Target: 2050")).toBeInTheDocument();
  });

  it("displays the correct temperature target", () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText("1.5°C")).toBeInTheDocument();
  });

  it("renders the correct icon for Normative scenario", () => {
    render(<ScenarioCard scenario={mockScenario} />);

    expect(screen.getByText("🎯")).toBeInTheDocument();
  });

  it("renders the correct icon for Descriptive scenario", () => {
    const descriptiveScenario = { ...mockScenario, nature: "Descriptive" };
    render(<ScenarioCard scenario={descriptiveScenario} />);

    expect(screen.getByText("📊")).toBeInTheDocument();
  });

  it("renders the correct icon for Exploratory scenario", () => {
    const exploratoryScenario = { ...mockScenario, nature: "Exploratory" };
    render(<ScenarioCard scenario={exploratoryScenario} />);

    expect(screen.getByText("🔍")).toBeInTheDocument();
  });
});
