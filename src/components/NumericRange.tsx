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

export default function NumericRange({
  label,
  minBound,
  maxBound,
  step,
  value,
  onChange,
  dataTestId,
}: Props) {
  type InternalState = {
    min?: number;
    max?: number;
    includeAbsent: boolean;
  };
  const [internal, setInternal] = React.useState<InternalState>({
    min: value?.min,
    max: value?.max,
    includeAbsent: Boolean(value?.includeAbsent),
  });

  // Sync down when parent-controlled value changes
  React.useEffect(() => {
    setInternal({
      min: value?.min,
      max: value?.max,
      includeAbsent: Boolean(value?.includeAbsent),
    });
  }, [value?.min, value?.max, value?.includeAbsent]);

  const { min, max, includeAbsent } = internal;

  const update = (patch: Partial<InternalState>) => {
    // Update local mirror immediately; DO NOT call parent here
    setInternal(
      (prev: InternalState): InternalState => ({ ...prev, ...patch }),
    );
  };

  // Notify parent AFTER render when internal changes
  React.useEffect(() => {
    onChange?.(internal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internal.min, internal.max, internal.includeAbsent]);

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      update({ min: undefined, max });
      return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) return; // allow free typing; apply only when it's a number
    update({ min: v, max });
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      update({ min, max: undefined });
      return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) return; // allow free typing; apply only when it's a number
    update({ min, max: v });
  };

  return (
    <fieldset
      data-testid={dataTestId}
      aria-label={label}
      className="space-y-3"
    >
      {/*
        Mark inverted ranges for a11y and show a small inline hint.
        Inverted = both numeric and max < min.
      */}
      {(() => {
        const inverted =
          typeof min === "number" && typeof max === "number" && max < min;
        return (
          <>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={step}
                value={min ?? ""}
                onChange={handleMinInput}
                className="w-28 rounded border px-2 py-1"
                placeholder={`${minBound}`}
                aria-label={`${label} min`}
                aria-invalid={inverted ? true : undefined}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                step={step}
                value={max ?? ""}
                onChange={handleMaxInput}
                className="w-28 rounded border px-2 py-1"
                placeholder={`${maxBound}`}
                aria-label={`${label} max`}
                aria-invalid={inverted ? true : undefined}
              />
            </div>
            {inverted && (
              <p
                role="alert"
                className="text-xs text-red-600"
              >
                End value must be ≥ start value
              </p>
            )}
          </>
        );
      })()}

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
