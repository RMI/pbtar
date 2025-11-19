// src/components/NumericRange.tsx
import React from "react";

export const NUMERIC_STEPS = {
  // Fill these with your desired precision (schema multipleOf)
  // e.g. temp: 0.1, netZeroBy: 1
  temp: 0.1,
  netZeroBy: 1,
} as const;

export type NumericFacetKey = keyof typeof NUMERIC_STEPS;
export function getStep(key: NumericFacetKey): number {
  return NUMERIC_STEPS[key];
}

type Props = {
  label: string;
  minBound: number;
  maxBound: number;
  step: number;
  value: { min?: number; max?: number } | null | undefined;
  onChange: (next: { min?: number; max?: number } | null) => void;
  onClear?: () => void;
  dataTestId?: string;
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

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
  const min = value?.min ?? minBound;
  const max = value?.max ?? maxBound;

  const update = (next: { min?: number; max?: number }) => {
    const m = next.min ?? undefined;
    const M = next.max ?? undefined;
    if (m == null && M == null) onChange?.(null);
    else onChange?.({ min: m, max: M });
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v =
      e.target.value === ""
        ? undefined
        : clamp(Number(e.target.value), minBound, max);
    update({ min: v, max });
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v =
      e.target.value === ""
        ? undefined
        : clamp(Number(e.target.value), min, maxBound);
    update({ min, max: v });
  };

  // Dual-thumb slider: two synced range inputs (simple & dependency-free)
  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value), minBound, max);
    update({ min: v, max });
  };
  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value), min, maxBound);
    update({ min, max: v });
  };

  return (
    <div data-testid={dataTestId}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          min={minBound}
          max={maxBound}
          value={value?.min ?? ""}
          onChange={handleMinInput}
          className="w-24 rounded border px-2 py-1"
          placeholder={`${minBound}`}
          aria-label={`${label} min`}
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          step={step}
          min={minBound}
          max={maxBound}
          value={value?.max ?? ""}
          onChange={handleMaxInput}
          className="w-24 rounded border px-2 py-1"
          placeholder={`${maxBound}`}
          aria-label={`${label} max`}
        />
        {onClear && (
          <button
            type="button"
            onClick={() => onClear()}
            className="ml-2 text-sm text-indigo-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative mt-3">
        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={min}
          onChange={handleMinSlider}
          className="w-full"
          aria-label={`${label} min slider`}
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={max}
          onChange={handleMaxSlider}
          className="w-full -mt-2"
          aria-label={`${label} max slider`}
        />
      </div>
    </div>
  );
}
