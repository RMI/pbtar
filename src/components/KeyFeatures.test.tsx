import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KeyFeatures from "./KeyFeatures";
import type { PathwayMetadataType } from "../types";

const mockKeyFeatures: PathwayMetadataType["keyFeatures"] = {
  emissionsScope: "CO2",
  emissionsTrajectory: "Moderate decrease",
  energyEfficiency: "Minor improvement",
  energyDemand: "Low or no change",
  electrification: "Moderate increase",
  policyTypes: ["Carbon price", "Subsidies"],
  policyAmbition: "NDCs incl. conditional targets",
  newTechnologiesIncluded: ["CCUS", "Battery storage"],
  technologyCostTrend: "Decrease",
  technologyCostsDetail: "Total costs",
  investmentNeeds: "By technology",
};

describe("KeyFeatures", () => {
  it("renders all four group headers", () => {
    render(<KeyFeatures keyFeatures={mockKeyFeatures} />);
    expect(
      screen.getByText("Emissions Boundary & Trajectory"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Energy System & Transition Levers"),
    ).toBeInTheDocument();
    expect(screen.getByText("Policy Environment")).toBeInTheDocument();
    expect(screen.getByText("Technology Assumptions")).toBeInTheDocument();
  });

  it("single-select: selected pill has blue classes, unselected have neutral classes", () => {
    render(<KeyFeatures keyFeatures={mockKeyFeatures} />);

    // "CO2" is selected for emissionsScope
    const selected = screen.getByText("CO2").closest("span") as HTMLElement;
    expect(selected).toHaveClass("bg-rmiblue-100");
    expect(selected).toHaveClass("text-rmiblue-800");

    // "CO2e (Kyoto)" is not selected
    const unselected = screen
      .getByText("CO2e (Kyoto)")
      .closest("span") as HTMLElement;
    expect(unselected).toHaveClass("bg-neutral-50");
    expect(unselected).toHaveClass("text-neutral-400");
    expect(unselected).not.toHaveClass("bg-rmiblue-100");
  });

  it("multi-select: all selected pills have blue classes, unselected have neutral classes", () => {
    render(<KeyFeatures keyFeatures={mockKeyFeatures} />);

    // "Carbon price" and "Subsidies" are selected for policyTypes
    const carbonPrice = screen
      .getByText("Carbon price")
      .closest("span") as HTMLElement;
    expect(carbonPrice).toHaveClass("bg-rmiblue-100");

    const subsidies = screen
      .getByText("Subsidies")
      .closest("span") as HTMLElement;
    expect(subsidies).toHaveClass("bg-rmiblue-100");

    // "Phaseout dates" is not selected
    const phaseout = screen
      .getByText("Phaseout dates")
      .closest("span") as HTMLElement;
    expect(phaseout).toHaveClass("bg-neutral-50");
    expect(phaseout).not.toHaveClass("bg-rmiblue-100");
  });

  it("sentiment feature: selected value appears as a scale text label, not a blue pill", () => {
    render(<KeyFeatures keyFeatures={mockKeyFeatures} />);

    // "Moderate decrease" is the emissionsTrajectory value — rendered by SentimentScale
    const label = screen.getByText("Moderate decrease");
    expect(label).toHaveClass("text-rmigray-500");
    expect(label).not.toHaveClass("bg-rmiblue-100");
  });

  it("neutral feature: selected value appears as a scale text label, not a blue pill", () => {
    render(<KeyFeatures keyFeatures={mockKeyFeatures} />);

    // "NDCs incl. conditional targets" is the policyAmbition value — rendered by NeutralScale
    const label = screen.getByText("NDCs incl. conditional targets");
    expect(label).toHaveClass("text-rmigray-500");
    expect(label).not.toHaveClass("bg-rmiblue-100");
  });
});
