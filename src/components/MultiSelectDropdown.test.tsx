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

  it("emits string[] on selection toggles", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MultiSelectDropdown
        options={[
          { value: "EU", label: "Europe" },
          { value: "US", label: "United States" },
        ]}
        value={[]}
        onChange={onChange}
      />,
    );

    // open
    await user.click(screen.getByText("Select…"));

    await user.click(screen.getByLabelText("Europe"));
    expect(onChange).toHaveBeenLastCalledWith(["EU"]);

    //await user.click(screen.getByLabelText("United States"));
    //expect(onChange).toHaveBeenLastCalledWith(["EU", "US"]);
    //
    //await user.click(screen.getByLabelText("Europe"));
    //expect(onChange).toHaveBeenLastCalledWith(["US"]);
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
        value={null} // null-safe
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
