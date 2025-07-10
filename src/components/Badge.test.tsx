import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    const { container } = render(<Badge text="No Tooltip" />);

    // Find the badge span
    const badge = screen.getByText("No Tooltip");

    // Check that it's a direct child of the container without tooltip wrapper divs
    expect(badge.parentElement).toBe(container);

    // Ensure no tooltip text is rendered
    const tooltipElements = container.querySelectorAll(
      ".group-hover\\:visible",
    );
    expect(tooltipElements.length).toBe(0);
  });

  it("renders tooltip structure when tooltip is provided", () => {
    const { container } = render(
      <Badge
        text="With Tooltip"
        tooltip="This is a tooltip"
      />,
    );
    // Should have a group div wrapper as the root element
    const groupDiv = container.firstChild as HTMLElement;
    expect(groupDiv.tagName).toBe("DIV");
    expect(groupDiv).toHaveClass("group");

    // Badge text should still be present
    const badgeText = screen.getByText("With Tooltip");
    expect(badgeText).toBeInTheDocument();

    // Should have the badge span with cursor-help
    const badgeParent = badgeText.closest("span")?.parentElement;
    expect(badgeParent).toHaveClass("cursor-help");
    expect(badgeParent).toHaveAttribute("tabIndex", "0");

    // Should have the tooltip text
    const tooltip = screen.getByText("This is a tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("shows tooltip on hover", () => {
    render(
      <Badge
        text="Hover Me"
        tooltip="Hover tooltip"
      />,
    );

    // Get the badge element
    const badge = screen.getByText("Hover Me");

    // Get the tooltip container (the div with the transition classes)
    const tooltipContainer = screen
      .getByText("Hover tooltip")
      .closest("div")?.parentElement;
    expect(tooltipContainer).toHaveClass("invisible");
    expect(tooltipContainer).toHaveClass("group-hover:visible");

    // Simulate hover
    fireEvent.mouseEnter(badge);

    // In a real browser, the group-hover:visible class would make it visible
    // We can verify the class is there since we can't test the actual CSS effect in JSDOM
    expect(tooltipContainer).toHaveClass("group-hover:visible");
    expect(tooltipContainer).toHaveClass("group-hover:opacity-100");
  });

  it("shows tooltip on focus", () => {
    render(
      <Badge
        text="Focus Me"
        tooltip="Focus tooltip"
      />,
    );

    // Get the badge element
    const badge = screen.getByText("Focus Me");

    // Get the tooltip container
    const tooltipContainer = screen
      .getByText("Focus tooltip")
      .closest("div")?.parentElement;

    // Verify the focus classes are present
    expect(tooltipContainer).toHaveClass("group-focus-within:visible");
    expect(tooltipContainer).toHaveClass("group-focus-within:opacity-100");

    // Simulate focus
    fireEvent.focus(badge);

    // Verify classes are still there (actual visibility would be handled by CSS)
    expect(tooltipContainer).toHaveClass("group-focus-within:visible");
  });

  it("positions the tooltip correctly", () => {
    render(
      <Badge
        text="Position Test"
        tooltip="Right positioned tooltip"
      />,
    );

    // Get the tooltip positioning div
    const tooltipPositioner = screen
      .getByText("Right positioned tooltip")
      .closest("div")?.parentElement;

    // Check positioning classes
    expect(tooltipPositioner).toHaveClass("left-full");
    expect(tooltipPositioner).toHaveClass("ml-0");
    expect(tooltipPositioner).toHaveClass("top-1/2");
    expect(tooltipPositioner).toHaveClass("-translate-y-1/2");
  });

  it("includes the tooltip arrow pointing to the badge", () => {
    render(
      <Badge
        text="Arrow Test"
        tooltip="Tooltip with arrow"
      />,
    );

    // Find the tooltip content
    const tooltipContent = screen
      .getByText("Tooltip with arrow")
      .closest("div");

    // Find the arrow element (should be a div with border classes)
    const arrow = tooltipContent?.querySelector("div[class*='border-']");
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveClass("border-4");
    expect(arrow).toHaveClass("border-transparent");
    expect(arrow).toHaveClass("border-r-rmigray-100"); // Right arrow
  });
});
