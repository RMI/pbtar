import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver for ScenarioCard component
// This is necessary because ResizeObserver is not available in the test environment.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add the mock to the global object if it doesn't exist
if (typeof window !== 'undefined') {
  window.ResizeObserver = window.ResizeObserver || MockResizeObserver;
}