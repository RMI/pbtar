import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BadgeArray from "./BadgeArray";

describe("BadgeArray", () => {
  it("renders a Badge for each child value", () => {
    render(<BadgeArray>{["A", "B", "C"]}</BadgeArray>);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("applies a single variant to all badges", () => {
    const { container } = render(
      <BadgeArray variant="sector">{["Power", "Transport"]}</BadgeArray>,
    );
    const spans = container.querySelectorAll("span");
    // Both badges should have the 'sector' styling
    spans.forEach((el) => {
      // each Badge renders a <span> with these classes
      expect(el).toHaveClass("bg-solar-100");
      expect(el).toHaveClass("text-solar-800");
      expect(el).toHaveClass("border-solar-200");
    });
  });

  it("applies per-item variants when variant is an array", () => {
    const { container } = render(
      <BadgeArray variant={["sector", "year"]}>{["Power", "2050"]}</BadgeArray>,
    );
    const [first, second] = Array.from(container.querySelectorAll("span"));

    // sector
    expect(first).toHaveClass("bg-solar-100");
    expect(first).toHaveClass("text-solar-800");
    expect(first).toHaveClass("border-solar-200");

    // year
    expect(second).toHaveClass("bg-rmiblue-100");
    expect(second).toHaveClass("text-rmiblue-800");
    expect(second).toHaveClass("border-rmiblue-200");
  });

  it("supports toLabel for present values", () => {
    render(
      <BadgeArray<number> toLabel={(v) => `Y${v}`}>{[2030, 2040]}</BadgeArray>,
    );
    expect(screen.getByText("Y2030")).toBeInTheDocument();
    expect(screen.getByText("Y2040")).toBeInTheDocument();
  });

  it("renders noneLabel for nullish values", () => {
    render(<BadgeArray noneLabel="No Value">{[undefined, null]}</BadgeArray>);
    const nodes = screen.getAllByText("No Value");
    expect(nodes.length).toBe(2);
  });

  it("shows '+N more' when items are hidden by visibleCount", () => {
    render(<BadgeArray visibleCount={1}>{["A", "B", "C", "D"]}</BadgeArray>);
    expect(screen.getByText("+3 more")).toBeInTheDocument();
  });

  it("throws when variant array length does not match children length", () => {
    expect(() =>
      render(
        <BadgeArray variant={["sector"] as string[]}>
          {["Power", "Transport"]}
        </BadgeArray>,
      ),
    ).toThrow(/length must match/);
  });

  it("throws when non-scalar children are passed", () => {
    expect(() =>
      // @ts-expect-error children must be scalar
      render(<BadgeArray>{["A", <span key="x">X</span>]}</BadgeArray>),
    ).toThrow(/children must be string \| number \| null \| undefined/);
  });
});
