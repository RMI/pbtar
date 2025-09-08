import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GeographyBadge from "./GeographyBadge";

function getStyledSpanByText(text: string): HTMLElement {
  const el = screen.getByText(text); // the text inside the styled <span>
  const styledSpan = el.closest("span"); // climb to the nearest span (the styled badge)
  if (!styledSpan) throw new Error("Styled span not found");
  return styledSpan;
}

// These assert the *variant → class* mapping currently in Badge.tsx.
// If you tweak the color tokens, update the class expectations accordingly.
describe("GeographyBadge", () => {
  it("renders Global badge with geographyGlobal styling", () => {
    render(<GeographyBadge text="Global" />);
    expect(screen.getByText("Global")).toBeInTheDocument();
    const badge = getStyledSpanByText("Global");
    expect(badge.className).toContain("bg-pinishgreen-800");
    expect(badge.className).toContain("text-pinishgreen-100");
    expect(badge.className).toContain("border-pinishgreen-100");
  });

  it("renders region badge (e.g., Europe) with geographyRegion styling", () => {
    render(<GeographyBadge text="Europe" />);
    expect(screen.getByText("Europe")).toBeInTheDocument();
    const badge = getStyledSpanByText("Europe");
    expect(badge.className).toContain("bg-pinishgreen-200");
    expect(badge.className).toContain("text-pinishgreen-800");
    expect(badge.className).toContain("border-pinishgreen-800");
  });

  it("renders country badge (e.g., DE) with geographyCountry styling", () => {
    render(<GeographyBadge text="DE" />);
    // No mapping assertion yet; just check the raw text is shown
    expect(screen.getByText("Germany")).toBeInTheDocument();
    const badge = getStyledSpanByText("Germany");
    expect(badge.className).toContain("bg-pinishgreen-100");
    expect(badge.className).toContain("text-pinishgreen-800");
    expect(badge.className).toContain("border-pinishgreen-200");
  });

  it("does not render for empty/whitespace-only (incl. zero-width & NBSP)", () => {
    const { container, rerender } = render(<GeographyBadge value="" />);
    expect(container).toBeEmptyDOMElement();

    rerender(<GeographyBadge value={"   "} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<GeographyBadge value={" \u00A0 "} />); // NBSP
    expect(container).toBeEmptyDOMElement();

    rerender(<GeographyBadge value={" \u200B "} />); // zero-width space
    expect(container).toBeEmptyDOMElement();
  });
});
