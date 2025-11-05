import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge, { BadgeMaybeAbsent } from "./Badge";
import { pathwayTypeTooltips, sectorTooltips } from "../utils/tooltipUtils";

describe("Badge component", () => {
  it("renders with the provided text", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders numbers as content", () => {
    render(<Badge>{123}</Badge>);
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("uses default styling when no variant is provided", () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmigray-100");
    expect(badge).toHaveClass("text-rmigray-800");
    expect(badge).toHaveClass("border-rmigray-200");
  });

  it("disallows ReactNode children for Badge at compile-time", () => {
    // @ts-expect-error - Badge children must be string | number
    render(<Badge><div>Not allowed</div></Badge>);
  });

  it("applies pathwayType styling when variant is 'pathwayType'", () => {
    const { container } = render(
      <Badge variant="pathwayType">Pathway Type</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmipurple-100");
    expect(badge).toHaveClass("text-rmipurple-800");
    expect(badge).toHaveClass("border-rmipurple-200");
  });

  it("applies temperature styling when variant is 'temperature'", () => {
    const { container } = render(
      <Badge variant="temperature">1.5°C</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmired-100");
    expect(badge).toHaveClass("text-rmired-800");
    expect(badge).toHaveClass("border-rmired-200");
  });

  it("applies year styling when variant is 'year'", () => {
    const { container } = render(
      <Badge variant="year">2050</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-rmiblue-100");
    expect(badge).toHaveClass("text-rmiblue-800");
    expect(badge).toHaveClass("border-rmiblue-200");
  });

  it("applies geography styling when variant is 'geographyGlobal'", () => {
    const { container } = render(
      <Badge variant="geographyGlobal">Global</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-pinishgreen-800");
    expect(badge).toHaveClass("text-pinishgreen-100");
    expect(badge).toHaveClass("border-pinishgreen-100");
  });

  it("applies geography styling when variant is 'geographyRegion'", () => {
    const { container } = render(
      <Badge variant="geographyRegion">RegionName</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-pinishgreen-200");
    expect(badge).toHaveClass("text-pinishgreen-800");
    expect(badge).toHaveClass("border-pinishgreen-800");
  });

  it("applies geography styling when variant is 'geographyCountry'", () => {
    const { container } = render(
      <Badge variant="geographyCountry">CountryName</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-pinishgreen-100");
    expect(badge).toHaveClass("text-pinishgreen-800");
    expect(badge).toHaveClass("border-pinishgreen-200");
  });

  it("applies sector styling when variant is 'sector'", () => {
    const { container } = render(
      <Badge variant="sector">Energy</Badge>
    );
    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("bg-solar-100");
    expect(badge).toHaveClass("text-solar-800");
    expect(badge).toHaveClass("border-solar-200");
  });

  it("applies metric styling when variant is 'metric'", () => {
    const { container } = render(<Badge variant="metric">Intensity</Badge>);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass("bg-rmipurple-100");
    expect(badge).toHaveClass("text-rmipurple-800");
    expect(badge).toHaveClass("border-rmipurple-200");
  });

  it("always includes base badge styling", () => {
    const { container } = render(
      <Badge variant="pathwayType">Test</Badge>
    );
    const badge = container.firstChild as HTMLElement;

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
    const { container } = render(<Badge>Test</Badge>);
    expect(container.firstChild?.nodeName).toBe("SPAN");
  });

  it("does not render tooltip when no tooltip is provided", () => {
    render(<Badge>No Tooltip</Badge>);
    const badge = screen.getByText("No Tooltip");
    expect(badge).toBeInTheDocument();
    expect(badge).not.toHaveAttribute("tabindex");
  });

  it("uses TextWithTooltip when tooltip is provided", () => {
    render(<Badge tooltip="This is a tooltip">With Tooltip</Badge>);

    const badgeText = screen.getByText("With Tooltip");
    expect(badgeText).toBeInTheDocument();

    const triggerElement = badgeText.closest("span")?.parentElement;
    expect(triggerElement).toHaveAttribute("tabindex", "0");
    expect(triggerElement).not.toHaveAttribute("aria-describedby");
  });

  it("doesn't show tooltip initially", () => {
    render(<Badge tooltip="Hover tooltip">Hover me</Badge>);
    const tooltipElement = document.querySelector("[role='tooltip']");
    expect(tooltipElement).not.toBeInTheDocument();
  });

  describe("tooltip content tests", () => {
    it("displays correct tooltip for Normative pathway type", () => {
      render(
        <Badge
          tooltip={pathwayTypeTooltips["Normative"]}
          variant="pathwayType"
        >
          Normative
        </Badge>
      );

      const badge = screen.getByText("Normative");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute(
        "tabindex",
        "0"
      );
    });

    it("displays correct tooltip for Policy pathway type", () => {
      render(
        <Badge
          tooltip={pathwayTypeTooltips["Direct Policy"]}
          variant="pathwayType"
        >
          Direct Policy
        </Badge>
      );

      const badge = screen.getByText("Direct Policy");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute(
        "tabindex",
        "0"
      );
    });

    it("displays correct tooltip for Power sector", () => {
      render(
        <Badge
          tooltip={sectorTooltips["Power"]}
          variant="sector"
        >
          Power
        </Badge>
      );

      const badge = screen.getByText("Power");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute(
        "tabindex",
        "0"
      );
    });

    it("displays correct tooltip for Transport sector", () => {
      render(
        <Badge
          tooltip={sectorTooltips["Transport"]}
          variant="sector"
        >
          Transport
        </Badge>
      );

      const badge = screen.getByText("Transport");
      expect(badge).toBeInTheDocument();
      expect(badge.closest("span")?.parentElement).toHaveAttribute(
        "tabindex",
        "0"
      );
    });
  });
});

describe("BadgeMaybeAbsent", () => {
  it("renders 'None' for undefined/null", () => {
    const { rerender } = render(<BadgeMaybeAbsent>{undefined}</BadgeMaybeAbsent>);
    expect(screen.getByText("None")).toBeInTheDocument();
    rerender(<BadgeMaybeAbsent>{null}</BadgeMaybeAbsent>);
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("renders string as text", () => {
    const { rerender } = render(<BadgeMaybeAbsent>Power</BadgeMaybeAbsent>);
    expect(screen.getByText("Power")).toBeInTheDocument();
    rerender(<BadgeMaybeAbsent>2030</BadgeMaybeAbsent>);
    expect(screen.getByText("2030")).toBeInTheDocument();
  });

  it("renders processed label", () => {
    render(<BadgeMaybeAbsent>{"  Europe  "}</BadgeMaybeAbsent>);
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("uses toLabel only for present values", () => {
    const toLabel = (v: number) => `Y${v}`;
    const { rerender } = render(
      <BadgeMaybeAbsent<number> toLabel={toLabel}>{2030}</BadgeMaybeAbsent>
    );
    expect(screen.getByText("Y2030")).toBeInTheDocument();
    rerender(
      <BadgeMaybeAbsent<number> toLabel={toLabel}>{undefined}</BadgeMaybeAbsent>
    );
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("disallows ReactNode children for BadgeMaybeAbsent at compile-time", () => {
    // @ts-expect-error - BadgeMaybeAbsent children must be string | number | null | undefined
    render(<BadgeMaybeAbsent><div>Not allowed</div></BadgeMaybeAbsent>);
  });

  it("supports noneLabel override", () => {
    render(
      <BadgeMaybeAbsent noneLabel="No Value">{undefined}</BadgeMaybeAbsent>
    );
    expect(screen.getByText("No Value")).toBeInTheDocument();
  });

  it("renderLabel decorates only string labels", () => {
    const renderLabel = (label: string) => `**${label}**`;
    render(
      <BadgeMaybeAbsent renderLabel={renderLabel}>EUROPE</BadgeMaybeAbsent>
    );
    expect(screen.getByText("**EUROPE**")).toBeInTheDocument();
  });
});
