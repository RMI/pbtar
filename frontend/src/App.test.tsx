import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders the heading with correct text", () => {
    render(<App />);

    // Find the heading element
    const headingElement = screen.getByRole("heading", { level: 1 });

    // Check if heading has correct text
    expect(headingElement.textContent).toBe("Working Title");
  });
});
