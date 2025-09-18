import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectDropdown from "./MultiSelectDropdown";

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
