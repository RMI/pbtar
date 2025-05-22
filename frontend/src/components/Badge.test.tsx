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

    expect(badge).toHaveClass("bg-gray-100");
    expect(badge).toHaveClass("text-gray-800");
    expect(badge).toHaveClass("border-gray-200");
  });

  it("applies category styling when variant is 'category'", () => {
    const { container } = render(<Badge text="Category" variant="category" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-indigo-100");
    expect(badge).toHaveClass("text-indigo-800");
    expect(badge).toHaveClass("border-indigo-200");
  });

  it("applies temperature styling when variant is 'temperature'", () => {
    const { container } = render(<Badge text="1.5°C" variant="temperature" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-red-100");
    expect(badge).toHaveClass("text-red-800");
    expect(badge).toHaveClass("border-red-200");
  });

  it("applies year styling when variant is 'year'", () => {
    const { container } = render(<Badge text="2050" variant="year" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-blue-100");
    expect(badge).toHaveClass("text-blue-800");
    expect(badge).toHaveClass("border-blue-200");
  });

  it("applies region styling when variant is 'region'", () => {
    const { container } = render(<Badge text="Global" variant="region" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-green-100");
    expect(badge).toHaveClass("text-green-800");
    expect(badge).toHaveClass("border-green-200");
  });

  it("applies sector styling when variant is 'sector'", () => {
    const { container } = render(<Badge text="Energy" variant="sector" />);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-amber-100");
    expect(badge).toHaveClass("text-amber-800");
    expect(badge).toHaveClass("border-amber-200");
  });

  it("always includes base badge styling", () => {
    // Testing that common styles are applied to all variants
    const { container } = render(<Badge text="Test" variant="category" />);
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
});
