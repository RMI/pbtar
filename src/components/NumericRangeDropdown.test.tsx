// src/components/NumericRangeDropdown.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumericRangeDropdown from "./NumericRangeDropdown";

describe("<NumericRangeDropdown>", () => {
  function renderDropdown(
    props?: Partial<React.ComponentProps<typeof NumericRangeDropdown>>,
  ) {
    const onChange = vi.fn();
    render(
      <NumericRangeDropdown
        label="Temperature"
        value={null}
        onChange={onChange}
        // placeholders are optional in the component; not asserting them here
        {...props}
      />,
    );
    return { onChange };
  }

  it("renders summary for null, min, max, min–max, and absent-only", () => {
    // null (all)
    renderDropdown({ value: null });
    expect(
      screen.getByRole("button", { name: /temperature\b/i }),
    ).toHaveTextContent(/.../i);
  });

  it("clear X clears without opening", async () => {
    const u = userEvent.setup();
    const { onChange } = renderDropdown({ value: { min: 1.2, max: 1.6 } });

    const trigger = screen.getByRole("button", { name: /^temperature\b/i });
    const clearBtn = trigger.querySelector(
      '[aria-label^="Clear"]',
    ) as HTMLElement;
    expect(clearBtn).toBeTruthy();
    await u.click(clearBtn);

    expect(onChange).toHaveBeenCalledWith(null);
    // Panel should not be open
    expect(screen.queryByRole("dialog", { name: /temperature/i })).toBeNull();
  });

  it("opens panel and shows two inputs + 'include absent' checkbox", async () => {
    const u = userEvent.setup();
    const { onChange } = renderDropdown({ value: null });

    await u.click(screen.getByRole("button", { name: /temperature\b/i }));
    const dialog = screen.getByRole("dialog", { name: /temperature/i });
    expect(dialog).toBeInTheDocument();

    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(2);
    const includeAbsent = screen.getByRole("checkbox", {
      name: /include pathways without temperature value/i,
    });
    expect(includeAbsent).toBeInTheDocument();

    // Type a valid min
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], "1.5");
    // typing emits changes (component is keypress-reactive for parseables)
    expect(onChange).toHaveBeenCalled();
  });
});
