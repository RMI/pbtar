import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HighlightedText from "./HighlightedText";

describe("HighlightedText component", () => {
  it("renders text without highlighting when there's no search term", () => {
    render(
      <HighlightedText
        text="Sample Text"
        searchTerm=""
      />,
    );

    const element = screen.getByText("Sample Text");
    expect(element).toBeInTheDocument();
    expect(element.querySelector("mark")).toBeNull();
  });

  it("highlights matching text when search term is provided", () => {
    const { container } = render(
      <HighlightedText
        text="Sample Text"
        searchTerm="sample"
      />,
    );

    // Find the mark element directly
    const markElement = container.querySelector("mark");

    // Assert that the mark element exists and has the right content
    expect(markElement).not.toBeNull();
    expect(markElement).toHaveTextContent("Sample");
  });

  it("maintains case of original text while doing case-insensitive matching", () => {
    const { container } = render(
      <HighlightedText
        text="SAMPLE text"
        searchTerm="sample"
      />,
    );

    // Find the mark element directly
    const markElement = container.querySelector("mark");

    // Assert that the mark element exists and has the right content
    expect(markElement).not.toBeNull();
    expect(markElement).toHaveTextContent("SAMPLE");
    expect(markElement).not.toHaveTextContent("sample");
  });

  it("handles multiple matches in the same text", () => {
    const { container } = render(
      <HighlightedText
        text="test test test"
        searchTerm="test"
      />,
    );

    // Find all mark elements directly
    const markElements = container.querySelectorAll("mark");

    // Check that we found 3 mark elements
    expect(markElements.length).toBe(3);

    // Check that each mark contains "test"
    markElements.forEach((element) => {
      expect(element.textContent).toBe("test");
    });
  });
});
