import React from "react";
export const NUMERIC_STEPS = {
  // Fill these with your schema multipleOf values
  temp: 0.1,
  netZeroBy: 1,
} as const;

export type NumericFacetKey = keyof typeof NUMERIC_STEPS;

export function getStep(key: NumericFacetKey): number {
  return NUMERIC_STEPS[key];
}
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
  onClear?: () => void;
  dataTestId?: string;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const countDecimals = (n: number) => {
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
};
const snapToStep = (v: number, step: number) => Math.round(v / step) * step;
const normalize = (v: number, step: number) => {
  const snapped = snapToStep(v, step);
  const fixed = Number(snapped.toFixed(countDecimals(step)));
  return fixed;
};

export default function NumericRange({
  label,
  minBound,
  maxBound,
  step,
  value,
  onChange,
  onClear,
  dataTestId,
}: Props) {
  const min = value?.min;
  const max = value?.max;
  const includeAbsent = Boolean(value?.includeAbsent);

  const update = (next: Partial<NonNullable<RangeValue>>) => {
    const m = next.min ?? min;
    const M = next.max ?? max;
    const a = next.includeAbsent ?? includeAbsent;
    if (m == null && M == null && !a) onChange(null);
    else onChange({ min: m, max: M, includeAbsent: a });
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      update({ min: undefined, max });
      return;
    }
    const v = normalize(clamp(Number(raw), minBound, maxBound), step);
    if (value?.max != null && v > value.max) {
      // swap to keep a valid interval
      update({ min: value.max, max: v });
    } else {
      update({ min: v, max });
    }
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      update({ min, max: undefined });
      return;
    }
    const v = normalize(clamp(Number(raw), minBound, maxBound), step);
    if (value?.min != null && v < value.min) {
      // swap to keep a valid interval
      update({ min: v, max: value.min });
    } else {
      update({ min, max: v });
    }
  };

  return (
    <fieldset
      data-testid={dataTestId}
      aria-label={label}
      className="space-y-3"
    >
      <legend className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </legend>

      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          min={minBound}
          max={maxBound}
          value={min ?? ""}
          onChange={handleMinInput}
          className="w-28 rounded border px-2 py-1"
          placeholder={`${minBound}`}
          aria-label={`${label} min`}
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          step={step}
          min={minBound}
          max={maxBound}
          value={max ?? ""}
          onChange={handleMaxInput}
          className="w-28 rounded border px-2 py-1"
          placeholder={`${maxBound}`}
          aria-label={`${label} max`}
        />

        <button
          type="button"
          onClick={() => {
            onClear?.();
            onChange(null);
          }}
          className="ml-2 text-sm text-indigo-600 hover:underline"
        >
          Clear
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeAbsent}
          onChange={(e) => update({ includeAbsent: e.target.checked })}
        />
        Include entries with no value
      </label>
    </fieldset>
  );
}
