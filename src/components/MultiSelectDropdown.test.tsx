import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectDropdown from "./MultiSelectDropdown";

describe("<MultiSelectDropdown>", () => {
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
});
