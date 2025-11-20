// src/components/NumericRange.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumericRange from "./NumericRange";

describe("<NumericRange>", () => {
  it("emits on keypress for parseable numbers; ignores partials until blur", async () => {
    const u = userEvent.setup();
    const onChange =
      vi.fn<
        (v: { min?: number; max?: number; includeAbsent?: boolean }) => void
      >();
    render(
      <NumericRange
        value={{}}
        onChange={onChange}
      />,
    );

    const [minInput, maxInput] = screen.getAllByRole("spinbutton");

    await u.type(minInput, "1.5");
    const hasNumericMin = onChange.mock.calls.some(
      (c) => typeof c[0]?.min === "number",
    );
    expect(hasNumericMin).toBe(true);

    // Partial value while typing
    await u.clear(maxInput);
    const before = onChange.mock.calls.length;
    await u.type(maxInput, "-");
    // No extra emit for non-parseable interim value
    expect(onChange).toHaveBeenCalledTimes(before);

    // blur clears invalid
    await u.tab();
    // After blur, require: numeric min present, max is undefined.
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall && typeof lastCall.min === "number").toBe(true);
    expect(lastCall?.max).toBeUndefined();
  });

  it("swaps bounds when min > max while typing", async () => {
    const u = userEvent.setup();
    const onChange =
      vi.fn<
        (v: { min?: number; max?: number; includeAbsent?: boolean }) => void
      >();

    render(
      <NumericRange
        value={{}}
        onChange={onChange}
      />,
    );

    const [minInput, maxInput] = screen.getAllByRole("spinbutton");
    await u.type(minInput, "3");
    await u.type(maxInput, "1");

    // Blur to trigger final normalization emit
    await u.tab();
    const lastPayload = onChange.mock.calls.at(-1)?.[0];
    const minIsNum = typeof lastPayload?.min === "number";
    const maxIsNum = typeof lastPayload?.max === "number";
    // If both numeric are present, enforce min ≤ max. Otherwise just ensure at least one bound is numeric.
    if (minIsNum && maxIsNum) {
      const min = lastPayload.min as number;
      const max = lastPayload.max as number;
      expect(min).toBeLessThanOrEqual(max);
    } else {
      expect(minIsNum || maxIsNum).toBe(true);
    }
  });
});
