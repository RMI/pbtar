import React from "react";
import { getStep } from "./NumericRange"; // uses your existing step table

export type RangeValue =
  | {
      min?: number;
      max?: number;
      includeAbsent?: boolean;
    }
  | null;

type Props = {
  label: string;
  minBound: number;
  maxBound: number;
  /** granularity / snap increment; typically getStep("temp") = 0.1 */
  step: number;
  value: RangeValue;
  onChange: (next: RangeValue) => void;
  dataTestId?: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function snap(n: number, step: number) {
  return Math.round(n / step) * step;
}

function toPercent(n: number, lo: number, hi: number) {
  if (!Number.isFinite(n)) return 0;
  return ((n - lo) / (hi - lo)) * 100;
}

const HANDLE_RADIUS = 8;

const NumericRangeSlider: React.FC<Props> = ({
  label,
  minBound,
  maxBound,
  step,
  value,
  onChange,
  dataTestId,
}) => {
  type Internal = { min?: number; max?: number; includeAbsent: boolean };
  const [internal, setInternal] = React.useState<Internal>({
    min: value?.min,
    max: value?.max,
    includeAbsent: Boolean(value?.includeAbsent),
  });

  // track user-vs-prop updates so we don’t echo changes back immediately
  const fromUserRef = React.useRef(false);

  // sync down from parent
  React.useEffect(() => {
    const next: Internal = {
      min: value?.min,
      max: value?.max,
      includeAbsent: Boolean(value?.includeAbsent),
    };
    setInternal((prev) => {
      if (
        prev.min === next.min &&
        prev.max === next.max &&
        prev.includeAbsent === next.includeAbsent
      ) {
        return prev;
      }
      fromUserRef.current = false;
      return next;
    });
    // re-run only if actual values changed
  }, [value?.min, value?.max, value?.includeAbsent]);

  // notify parent after user changes
  React.useEffect(() => {
    if (fromUserRef.current) {
      onChange?.(internal);
      fromUserRef.current = false;
    }
  }, [internal, onChange]);

  const commit = (patch: Partial<Internal>) => {
    setInternal((prev) => {
      fromUserRef.current = true;
      return { ...prev, ...patch };
    });
  };

  const { min, max, includeAbsent } = internal;
  const inverted =
    typeof min === "number" && typeof max === "number" && max < min;

  // --- slider interactions ---
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const activeHandle = React.useRef<"min" | "max" | null>(null);

  const pointToValue = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return undefined;
    const rect = el.getBoundingClientRect();
    const t = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = minBound + t * (maxBound - minBound);
    const snapped = snap(raw, step);
    return clamp(snapped, minBound, maxBound);
  };

  const pickNearestHandle = (v: number): "min" | "max" => {
    const hasMin = typeof min === "number";
    const hasMax = typeof max === "number";
    if (!hasMin && !hasMax) return "min";
    if (!hasMin) return "min";
    if (!hasMax) return "max";
    const dMin = Math.abs(v - (min as number));
    const dMax = Math.abs(v - (max as number));
    return dMin <= dMax ? "min" : "max";
  };

  const onTrackMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const v = pointToValue(e.clientX);
    if (v == null) return;
    const which = pickNearestHandle(v);
    activeHandle.current = which;
    commit({ [which]: v } as Partial<Internal>);

    // set up drag tracking
    const onMove = (ev: MouseEvent) => {
      const nv = pointToValue(ev.clientX);
      if (nv == null) return;
      if (activeHandle.current) {
        commit({ [activeHandle.current]: nv } as Partial<Internal>);
      }
    };
    const onUp = () => {
      activeHandle.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const startDrag =
    (which: "min" | "max"): React.MouseEventHandler<HTMLDivElement> =>
    (e) => {
      e.stopPropagation();
      activeHandle.current = which;
      const onMove = (ev: MouseEvent) => {
        const nv = pointToValue(ev.clientX);
        if (nv == null) return;
        commit({ [which]: nv } as Partial<Internal>);
      };
      const onUp = () => {
        activeHandle.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };

  // --- inputs (text boxes) ---
  const handleMinInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      commit({ min: undefined });
      return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    commit({ min: clamp(snap(v, step), minBound, maxBound) });
  };

  const handleMaxInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      commit({ max: undefined });
      return;
    }
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    commit({ max: clamp(snap(v, step), minBound, maxBound) });
  };

  const minPct = toPercent(
    typeof min === "number" ? min : minBound,
    minBound,
    maxBound,
  );
  const maxPct = toPercent(
    typeof max === "number" ? max : maxBound,
    minBound,
    maxBound,
  );

  const lo = Math.min(minPct, maxPct);
  const hi = Math.max(minPct, maxPct);

  return (
    <fieldset
      data-testid={dataTestId}
      aria-label={label}
      className="space-y-3"
    >
      {/* slider */}
      <div className="flex flex-col gap-2">
        <div
          ref={trackRef}
          onMouseDown={onTrackMouseDown}
          className="relative h-2 rounded bg-gray-200 cursor-pointer select-none"
          aria-label={`${label} slider`}
        >
          {/* selection range highlight */}
          <div
            className="absolute top-0 h-2 bg-energy-400 rounded"
            style={{
              left: `${lo}%`,
              width: `${Math.max(0, hi - lo)}%`,
            }}
          />
          {/* handles */}
          {typeof min === "number" && (
            <div
              role="slider"
              aria-label={`${label} min handle`}
              aria-valuemin={minBound}
              aria-valuemax={maxBound}
              aria-valuenow={min}
              onMouseDown={startDrag("min")}
              className="absolute -top-1 h-4 w-4 rounded-full border border-gray-600 bg-white"
              style={{ left: `calc(${minPct}% - ${HANDLE_RADIUS}px)` }}
            />
          )}
          {typeof max === "number" && (
            <div
              role="slider"
              aria-label={`${label} max handle`}
              aria-valuemin={minBound}
              aria-valuemax={maxBound}
              aria-valuenow={max}
              onMouseDown={startDrag("max")}
              className="absolute -top-1 h-4 w-4 rounded-full border border-gray-600 bg-white"
              style={{ left: `calc(${maxPct}% - ${HANDLE_RADIUS}px)` }}
            />
          )}
        </div>

        {/* inputs + include-absent */}
        <div className="flex items-center gap-3">
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
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeAbsent}
              onChange={(e) => commit({ includeAbsent: e.target.checked })}
            />
            Include entries with no value
          </label>
        </div>

        {inverted && (
          <p role="alert" className="text-xs text-red-600">
            End value must be ≥ start value
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default NumericRangeSlider;

