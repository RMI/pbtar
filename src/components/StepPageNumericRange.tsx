import React from "react";
import NumericRange, { getStep } from "./NumericRange";

export type RangeValue = {
  min?: number;
  max?: number;
  includeAbsent?: boolean;
} | null;

type Props = {
  /** Step title shown above the control */
  title: string;
  /** Optional short description shown under the title */
  description?: string;
  /**
   * Current range value for the facet (parent-controlled).
   * Use `null` to mean “no filter”.
   */
  value: RangeValue;
  /**
   * Called whenever the user edits the range.
   * Emit `null` to clear the filter.
   */
  onChange: (next: RangeValue) => void;

  /**
   * Bounds & granularity. If you already centralize these, you can
   * omit and rely on defaults below.
   */
  minBound?: number;
  maxBound?: number;
  stepKey?: "temp" | "netZeroBy";
};

const StepPageNumericRange: React.FC<Props> = ({
  title,
  description,
  value,
  onChange,
  minBound = 0, // sensible defaults; adjust if you have tighter domain
  maxBound = 6,
  stepKey = "temp", // uses NumericRange’s step table
}) => {
  const step = getStep(stepKey);

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-rmigray-800">{title}</h3>
        {description ? <p className="text-rmigray-600">{description}</p> : null}
      </div>

      <div className="mt-3">
        <NumericRange
          label={title}
          minBound={minBound}
          maxBound={maxBound}
          step={step}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default StepPageNumericRange;
