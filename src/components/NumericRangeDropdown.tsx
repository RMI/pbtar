import React from "react";
import DropdownFacetShell from "./DropdownFacetShell";
import NumericRange from "./NumericRange";

type RangeValue = {
  min?: number;
  max?: number;
  includeAbsent?: boolean;
} | null;

type Props = {
  label: string;
  minBound: number;
  maxBound: number;
  step: number;
  value: RangeValue;
  onChange: (next: RangeValue) => void;
  menuWidthClassName?: string;
  triggerMinWidthClassName?: string;
};

function buildSummary(v: RangeValue): string {
  if (!v) return null;
  const { min, max, includeAbsent } = v;
  if (min == null && max == null) return includeAbsent ? "absent only" : null;
  if (min != null && max != null) return `${min}–${max}`;
  if (min != null) return `≥ ${min}`;
  return `≤ ${max}`;
}

export default function NumericRangeDropdown({
  label,
  minBound,
  maxBound,
  step,
  value,
  onChange,
  menuWidthClassName,
  triggerMinWidthClassName,
}: Props) {
  const active = Boolean(
    value && (value.min != null || value.max != null || value.includeAbsent),
  );
  const summary = buildSummary(value);

  return (
    <DropdownFacetShell
      label={label}
      active={active}
      summary={summary}
      onClear={() => onChange(null)}
      reserveSpace={7}
      header={
        <>
          {/* Left: Clear button to mirror MultiSelect */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              className="underline disabled:opacity-50"
              onClick={() => onChange(null)}
              disabled={!active}
            >
              Clear
            </button>
          </div>
          {/* Right: (intentionally empty — no ANY/ALL for range facets) */}
          <div className="text-right text-rmigray-500 inline-block" />
        </>
      }
      menuWidthClassName={menuWidthClassName}
      triggerMinWidthClassName={triggerMinWidthClassName}
    >
      <NumericRange
        label={label}
        minBound={minBound}
        maxBound={maxBound}
        step={step}
        value={value}
        onChange={onChange}
        onClear={() => onChange(null)}
      />
    </DropdownFacetShell>
  );
}
