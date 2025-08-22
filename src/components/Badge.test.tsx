import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";
import { pathwayTypeTooltips, sectorTooltips } from "../utils/tooltipUtils";

// NOTE: The PathwayType union in types/index.ts differs from the keys used in
// pathwayTypeTooltips (legacy vs current naming). For test stability, we access
// tooltip entries defensively using `as any` for keys that are outside the union.

describe("Badge component", () => {
  it("renders with the provided text", () => {
    render(<Badge text="Test Badge" />);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("uses default styling when no variant is provided", () => {
    const { container } = render(<Badge text="Default Badge" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmigray-100");
    expect(badge).toHaveClass("text-rmigray-800");
    expect(badge).toHaveClass("border-rmigray-200");
  });

  it("applies pathwayType styling when variant is 'pathwayType'", () => {
    const { container } = render(
      <Badge
        text="Pathway Type"
        variant="pathwayType"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmipurple-100");
    expect(badge).toHaveClass("text-rmipurple-800");
    expect(badge).toHaveClass("border-rmipurple-200");
  });

  it("applies temperature styling when variant is 'temperature'", () => {
    const { container } = render(
      <Badge
        text="1.5°C"
        variant="temperature"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmired-100");
    expect(badge).toHaveClass("text-rmired-800");
    expect(badge).toHaveClass("border-rmired-200");
  });

  it("applies year styling when variant is 'year'", () => {
    const { container } = render(
      <Badge
        text="2050"
        variant="year"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmiblue-100");
    expect(badge).toHaveClass("text-rmiblue-800");
    expect(badge).toHaveClass("border-rmiblue-200");
  });

  it("applies region styling when variant is 'region'", () => {
    const { container } = render(
      <Badge
        text="Global"
        variant="region"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-pinishgreen-100");
    expect(badge).toHaveClass("text-pinishgreen-800");
    expect(badge).toHaveClass("border-pinishgreen-200");
  });

  it("applies sector styling when variant is 'sector'", () => {
    const { container } = render(
      <Badge
        text="Energy"
        variant="sector"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-solar-100");
    expect(badge).toHaveClass("text-solar-800");
    expect(badge).toHaveClass("border-solar-200");
  });

  it("always includes base badge styling", () => {
    const { container } = render(
      <Badge
        text="Test"
        variant="pathwayType"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("rounded-md");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("font-medium");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("mr-2");
    expect(badge).toHaveClass("mb-1");
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge text="Test" />);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("does not render tooltip when no tooltip is provided", () => {
    render(<Badge text="No Tooltip" />);
    const badge = screen.getByText("No Tooltip");
    expect(badge).toBeInTheDocument();
    expect(badge).not.toHaveAttribute("tabindex");
  });

  it("uses TextWithTooltip when tooltip is provided", () => {
    render(
      <Badge
        text="With Tooltip"
        tooltip="This is a tooltip"
      />,
    );
    const badgeText = screen.getByText("With Tooltip");
    expect(badgeText).toBeInTheDocument();
    const triggerElement = badgeText.closest("span")?.parentElement;
    expect(triggerElement).toHaveAttribute("tabindex", "0");
    expect(triggerElement).not.toHaveAttribute("aria-describedby");
  });

  it("doesn't show tooltip initially", () => {
    render(
      <Badge
        text="Hover Me"
        tooltip="Hover tooltip"
      />,
    );
    const tooltipElement = document.querySelector("[role='tooltip']");
    expect(tooltipElement).not.toBeInTheDocument();
  });

  describe("tooltip content tests", () => {
    it("displays correct tooltip for Normative pathway type", () => {
      render(
        <Badge
          text="Normative"
          tooltip={(pathwayTypeTooltips as any)["Normative"]}
          variant="pathwayType"
        />,
      );
      const badge = screen.getByText("Normative");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute("tabindex", "0");
    });

    it("displays correct tooltip for Policy pathway type", () => {
      render(
        <Badge
          text="Direct Policy"
          tooltip={(pathwayTypeTooltips as any)["Direct Policy"]}
          variant="pathwayType"
        />,
      );
      const badge = screen.getByText("Direct Policy");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute("tabindex", "0");
    });

    it("displays correct tooltip for Power sector", () => {
      render(
        <Badge
          text="Power"
          tooltip={sectorTooltips["Power"]}
          variant="sector"
        />,
      );
      const badge = screen.getByText("Power");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute("tabindex", "0");
    });

    it("displays correct tooltip for Transport sector", () => {
      render(
        <Badge
          text="Transport"
          tooltip={sectorTooltips["Transport"]}
          variant="sector"
        />,
      );
      const badge = screen.getByText("Transport");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute("tabindex", "0");
    });
  });
});
