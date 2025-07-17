import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

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

  it("applies category styling when variant is 'category'", () => {
    const { container } = render(
      <Badge
        text="Category"
        variant="category"
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
    // Testing that common styles are applied to all variants
    const { container } = render(
      <Badge
        text="Test"
        variant="category"
      />,
    );
    const badge = container.firstChild as HTMLElement;

    // Check for common styling classes that should be on all badges
    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("rounded-full");
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

  // Tooltip tests
  it("does not render tooltip when no tooltip is provided", () => {
    render(<Badge text="No Tooltip" />);

    // Find the badge span
    const badge = screen.getByText("No Tooltip");

    // Check that it's a plain span without tabindex
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

    // Badge text should still be present
    const badgeText = screen.getByText("With Tooltip");
    expect(badgeText).toBeInTheDocument();

    // The outer span from TextWithTooltip should have tabindex attribute
    // We need to look for a parent element with tabindex since the badge text itself
    // is wrapped in its own span
    const triggerElement = badgeText.closest("span")?.parentElement;
    expect(triggerElement).toHaveAttribute("tabindex", "0");

    // The aria-describedby attribute is added when tooltip is visible
    expect(triggerElement).not.toHaveAttribute("aria-describedby");
  });

  // Testing tooltip visibility requires checking document.body, since tooltips are now in portals
  it("doesn't show tooltip initially", () => {
    render(
      <Badge
        text="Hover Me"
        tooltip="Hover tooltip"
      />,
    );

    // Initially the tooltip shouldn't be in document.body
    const tooltipElement = document.querySelector("[role='tooltip']");
    expect(tooltipElement).not.toBeInTheDocument();
  });
});
