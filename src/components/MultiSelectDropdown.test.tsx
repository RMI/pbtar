import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectDropdown, { Option } from "./MultiSelectDropdown";
import type { FacetMode } from "../utils/searchUtils";

describe("<MultiSelectDropdown>", () => {
  function MultiSelectDropdownHarness<T extends string | number>(props: {
    options: { value: T; label: string }[];
    initial?: T[] | null;
    label?: string;
    onChange?: (next: T[]) => void;
  }) {
    const { options, initial = null, label, onChange } = props;
    const [val, setVal] = React.useState<T[] | null>(initial);
    return (
      <MultiSelectDropdown<T>
        label={label}
        options={options}
        value={val}
        onChange={(next) => {
          setVal(next);
          onChange?.(next);
        }}
      />
    );
  }

  it("emits string[] on selection toggles (controlled)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdownHarness
        options={[
          { value: "EU", label: "Europe" },
          { value: "US", label: "United States" },
        ]}
        initial={[]}
        onChange={onChange}
      />,
    );

    // open
    await user.click(screen.getByText("Select…"));

    // toggle EU → ["EU"]
    await user.click(screen.getByLabelText("Europe"));
    expect(onChange).toHaveBeenLastCalledWith(["EU"]);

    // toggle US → ["EU","US"]
    await user.click(screen.getByLabelText("United States"));
    expect(onChange).toHaveBeenLastCalledWith(["EU", "US"]);

    // untoggle EU → ["US"]
    await user.click(screen.getByLabelText("Europe"));
    expect(onChange).toHaveBeenLastCalledWith(["US"]);
  });

  it("mode toggle calls onModeChange", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(
      <MultiSelectDropdown
        options={[{ value: "A", label: "A" }]}
        value={[]}
        onChange={() => {}}
        showModeToggle
        mode="ANY"
        onModeChange={onModeChange}
      />,
    );

    await user.click(screen.getByText("Select…"));
    await user.click(screen.getByTitle("Match all (AND)"));
    expect(onModeChange).toHaveBeenLastCalledWith("ALL");
  });

  it("supports number values and null value without crashing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiSelectDropdownHarness<number>
        label="Years"
        options={[
          { value: 2025, label: "2025" },
          { value: 2030, label: "2030" },
        ]}
        initial={null} // null-safe
        onChange={onChange}
      />,
    );

    // open
    await user.click(screen.getByText("Select…"));

    // toggle 2025
    await user.click(screen.getByLabelText("2025"));
    expect(onChange).toHaveBeenLastCalledWith([2025]);

    // toggle 2030
    await user.click(screen.getByLabelText("2030"));
    expect(onChange).toHaveBeenLastCalledWith([2025, 2030]);
  });
});

it("closes on outside click but not when re-clicking the trigger", async () => {
  const user = userEvent.setup();
  render(
    <MultiSelectDropdown
      options={[
        { value: "A", label: "A" },
        { value: "B", label: "B" },
      ]}
      value={[]}
      onChange={() => {}}
    />,
  );

  // open
  await user.click(screen.getByText("Select…"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  // Click trigger again → still open (does not close)
  await user.click(screen.getByText("Select…"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  // Click outside → closed
  await user.click(document.body);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

const OPTIONS: Option<string>[] = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

function openMenu() {
  fireEvent.click(screen.getByRole("button"));
}

describe("MultiSelectDropdown – variable widths", () => {
  const getBoundingClientRect =
    HTMLElement.prototype.getBoundingClientRect.bind(HTMLElement.prototype);

  beforeEach(() => {
    // Default: mock a 160px-wide trigger button
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (
      this: HTMLElement,
    ) {
      // Crude heuristic: if this is the trigger (has role="button"), give it width
      if (
        this.getAttribute("role") === "button" ||
        this.tagName.toLowerCase() === "button"
      ) {
        return {
          width: 160,
          height: 32,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;
  });

  it("renders a trigger sized to content with a minimum width class", () => {
    render(
      <MultiSelectDropdown
        label="Geography"
        options={OPTIONS}
        value={[]}
        onChange={() => {}}
      />,
    );

    const btn = screen.getByRole("button");
    // Should not have a fixed width class like w-72
    expect(btn.className).not.toMatch(/\bw-72\b/);
    // Should have w-auto and the default min width class
    expect(btn.className).toMatch(/\bw-auto\b/);
    expect(btn.className).toMatch(/\bmin-w-32\b/);
  });

  it("ensures the menu is at least as wide as the trigger when opened", () => {
    render(
      <MultiSelectDropdown
        label="Sector"
        options={OPTIONS}
        value={[]}
        onChange={() => {}}
      />,
    );

    openMenu();

    // The menu container should have minWidth >= 160px (mocked trigger width)
    // Grab the popup by role="listbox" parent; we use closest container div
    const list = screen.getByRole("listbox");
    const container = list.closest("div");
    expect(container).toBeTruthy();
    const style = (container as HTMLDivElement).getAttribute("style") || "";
    expect(style.replace(/\s/g, "")).toMatch(/min-width:\s*160px/i);
  });

  it("uses menuWidthClassName when provided (fixed width) and skips inline minWidth", () => {
    render(
      <MultiSelectDropdown
        label="Metric"
        options={OPTIONS}
        value={[]}
        onChange={() => {}}
        menuWidthClassName="w-96"
      />,
    );

    openMenu();

    const list = screen.getByRole("listbox");
    const container = list.closest("div")!;
    // Has fixed width class
    expect(container.className).toMatch(/\bw-96\b/);
    // And should not set an inline minWidth (style is absent or empty)
    const style = container.getAttribute("style");
    expect(style == null || style.trim() === "").toBe(true);
  });

  it("respects custom triggerMinWidthClassName", () => {
    render(
      <MultiSelectDropdown
        label="Geography"
        options={OPTIONS}
        value={[]}
        onChange={() => {}}
        triggerMinWidthClassName="min-w-40"
      />,
    );

    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/\bmin-w-40\b/);
  });
});

describe("MultiSelectDropdown – active visual state", () => {
  // Bind original so we can restore safely (avoids unbound-method + invalid `this`)
  const originalGetBCR = HTMLElement.prototype.getBoundingClientRect.bind(
    HTMLElement.prototype,
  );

  beforeEach(() => {
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (
      this: HTMLElement,
    ) {
      if (
        this.getAttribute("role") === "button" ||
        this.tagName.toLowerCase() === "button"
      ) {
        return {
          width: 160,
          height: 32,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
  });

  it("renders neutral trigger styles when there are no selections", () => {
    render(
      <MultiSelectDropdown
        label="Geography"
        options={[
          { value: "na", label: "North America" },
          { value: "eu", label: "Europe" },
        ]}
        value={[]}
        onChange={() => {}}
      />,
    );
    const btn = screen.getByRole("button");
    // Neutral classes present
    expect(btn.className).toMatch(/\bbg-white\b/);
    expect(btn.className).toMatch(/\bborder-gray-300\b/);
    // Active classes absent
    expect(btn.className).not.toMatch(/\bbg-energy-100\b/);
    expect(btn.className).not.toMatch(/\bborder-energy-100\b/);
  });

  it("renders active trigger styles when there is at least one selection", () => {
    render(
      <MultiSelectDropdown
        label="Geography"
        options={[
          { value: "na", label: "North America" },
          { value: "eu", label: "Europe" },
        ]}
        value={["eu"]}
        onChange={() => {}}
      />,
    );
    // The trigger's accessible name is the visible text inside it, e.g. "1 selected"
    const btn = screen.getByRole("button", { name: /selected/i });
    // Active classes present
    expect(btn.className).toMatch(/\bbg-energy-100\b/);
    expect(btn.className).toMatch(/\bborder-energy-100\b/);
    expect(btn.className).toMatch(/\btext-energy-800\b/);
    // Neutral background absent
    expect(btn.className).not.toMatch(/\bbg-white\b/);
  });
});

describe("MultiSelectDropdown – trigger affordance (ChevronDown vs X)", () => {
  // Bind & restore to avoid unbound-method + invalid `this`
  const originalGetBCR = HTMLElement.prototype.getBoundingClientRect.bind(
    HTMLElement.prototype,
  );

  beforeEach(() => {
    // Give buttons a reasonable width; others 0
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (
      this: HTMLElement,
    ) {
      if (
        this.getAttribute("role") === "button" ||
        this.tagName.toLowerCase() === "button"
      ) {
        return {
          width: 160,
          height: 32,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
  });

  it("inactive: shows ChevronDown affordance (implicitly) and opens the menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelectDropdown
        label="Geography"
        options={[
          { value: "na", label: "North America" },
          { value: "eu", label: "Europe" },
        ]}
        value={[]} // inactive
        onChange={() => {}}
      />,
    );

    // No clear control when inactive
    expect(
      screen.queryByRole("button", { name: /clear geography/i }),
    ).toBeNull();

    // Click trigger -> menu should open (listbox appears)
    await user.click(screen.getByRole("button", { name: /select/i }));
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });

  it("active: shows X (clear); clicking X clears without opening; clicking trigger opens the menu", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelectDropdown
        label="Sector"
        options={[
          { value: "p", label: "Power" },
          { value: "t", label: "Transport" },
        ]}
        value={["p"]} // active
        onChange={handleChange}
      />,
    );

    // Clear control is present (X replaces caret) – now role="button"
    const clear = screen.getByRole("button", { name: /clear sector/i });
    expect(clear).toBeInTheDocument();

    // Clicking X clears but does not open the menu
    await user.click(clear);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith([]);
    expect(screen.queryByRole("listbox")).toBeNull();

    // Simulate user adding a 3rd sector: clicking the trigger (still active) should open the menu
    await user.click(screen.getByRole("button", { name: /selected/i })); // e.g., "1 selected"
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
  });
});

describe("MultiSelectDropdown – menu header layout & interactions", () => {
  // Stable width mock so the menu open effect doesn't throw in JSDOM
  const originalGetBCR = HTMLElement.prototype.getBoundingClientRect.bind(
    HTMLElement.prototype,
  );

  beforeEach(() => {
    HTMLElement.prototype.getBoundingClientRect = vi.fn(function (
      this: HTMLElement,
    ) {
      if (
        this.getAttribute("role") === "button" ||
        this.tagName.toLowerCase() === "button"
      ) {
        return {
          width: 200,
          height: 32,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        };
      }
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    });
  });

  afterEach(() => {
    HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
  });

  function renderOpenMenu(ui: React.ReactElement) {
    render(ui);
    // Find the trigger by aria-haspopup="listbox" (unique to the trigger)
    const trigger = screen
      .getAllByRole("button")
      .find((el) => el.getAttribute("aria-haspopup") === "listbox");
    if (!trigger) {
      throw new Error("Trigger button with aria-haspopup='listbox' not found");
    }
    fireEvent.click(trigger);
  }

  it("shows left actions and right, bordered, right-justified explainer block", () => {
    renderOpenMenu(
      <MultiSelectDropdown
        label="Geography"
        options={[
          { value: "na", label: "North America" },
          { value: "eu", label: "Europe" },
        ]}
        value={[]}
        onChange={() => {}}
        showModeToggle
        mode="ANY"
        onModeChange={() => {}}
      />,
    );

    // Left actions present; "Select all" uses whitespace-nowrap
    const selectAll = screen.getByRole("button", { name: /select all/i });
    const clearBtn = screen.getByRole("button", { name: /^clear$/i });
    expect(selectAll).toBeInTheDocument();
    expect(clearBtn).toBeInTheDocument();
    expect(selectAll.className).toMatch(/\bwhitespace-nowrap\b/);

    // Right block: two-line text and a bordered Any/All + "selected"
    const explainer = screen.getByTestId("mode-explainer");
    expect(explainer).toBeInTheDocument();
    // Right-justified container
    expect(explainer.parentElement?.className).toMatch(/\btext-right\b/);
    // First line
    expect(screen.getByText(/Show scenarios matching/i)).toBeInTheDocument();
    // The grouped toggle exists and is bordered
    const group = screen.getByRole("group", { name: /match mode/i });
    // The border is applied to the inner wrapper of the buttons (closest div with border classes)
    // Check the closest ancestor with border classes inside the group:
    const bordered = group.closest("div")?.querySelector("div.border");
    expect(bordered).toBeTruthy();
    // Buttons and trailing "selected" text
    expect(screen.getByRole("button", { name: /^Any$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^All$/i })).toBeInTheDocument();
    expect(screen.getByText(/selected/i)).toBeInTheDocument();
  });

  it("disables 'Select all' when all options are already selected", () => {
    // All selected -> Select all disabled, Clear enabled
    renderOpenMenu(
      <MultiSelectDropdown
        label="Sector"
        options={[
          { value: "p", label: "Power" },
          { value: "t", label: "Transport" },
        ]}
        value={["p", "t"]}
        onChange={() => {}}
        showModeToggle
        mode="ANY"
        onModeChange={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /select all/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^clear$/i })).not.toBeDisabled();
  });

  it("disables 'Clear' when none selected", () => {
    // None selected -> Select all enabled, Clear disabled
    renderOpenMenu(
      <MultiSelectDropdown
        label="Sector"
        options={[
          { value: "p", label: "Power" },
          { value: "t", label: "Transport" },
        ]}
        value={[]}
        onChange={() => {}}
        showModeToggle
        mode="ANY"
        onModeChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: /select all/i }),
    ).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /^clear$/i })).toBeDisabled();
  });

  it("toggles mode via Any/All and updates when controlled", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [mode, setMode] = React.useState<FacetMode>("ANY");
      return (
        <MultiSelectDropdown
          label="Geography"
          options={[
            { value: "na", label: "North America" },
            { value: "eu", label: "Europe" },
          ]}
          value={[]}
          onChange={() => {}}
          showModeToggle
          mode={mode}
          onModeChange={setMode}
        />
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /select/i }));
    const btnAny = screen.getByRole("button", { name: /^Any$/i });
    const btnAll = screen.getByRole("button", { name: /^All$/i });
    // starts at ANY
    expect(btnAny.getAttribute("aria-pressed")).toBe("true");
    expect(btnAll.getAttribute("aria-pressed")).toBe("false");
    // click All -> switches
    await user.click(btnAll);
    expect(btnAny.getAttribute("aria-pressed")).toBe("false");
    expect(btnAll.getAttribute("aria-pressed")).toBe("true");
  });
});
