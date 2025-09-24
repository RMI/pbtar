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
    render(<BadgeArray variant="sector">{["Power", "Transport"]}</BadgeArray>);
    const power = screen.getByText("Power").closest("span") as HTMLElement;
    const transport = screen
      .getByText("Transport")
      .closest("span") as HTMLElement;
    expect(power).toHaveClass("bg-solar-100");
    expect(power).toHaveClass("text-solar-800");
    expect(power).toHaveClass("border-solar-200");
    expect(transport).toHaveClass("bg-solar-100");
    expect(transport).toHaveClass("text-solar-800");
    expect(transport).toHaveClass("border-solar-200");
  });

  it("applies per-item variants when variant is an array", () => {
    render(
      <BadgeArray variant={["sector", "year"]}>{["Power", "2050"]}</BadgeArray>,
    );
    const sectorSpan = screen.getByText("Power").closest("span") as HTMLElement;
    const yearSpan = screen.getByText("2050").closest("span") as HTMLElement;
    // sector
    expect(sectorSpan).toHaveClass("bg-solar-100");
    expect(sectorSpan).toHaveClass("text-solar-800");
    expect(sectorSpan).toHaveClass("border-solar-200");
    // year
    expect(yearSpan).toHaveClass("bg-rmiblue-100");
    expect(yearSpan).toHaveClass("text-rmiblue-800");
    expect(yearSpan).toHaveClass("border-rmiblue-200");
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
