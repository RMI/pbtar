import React from "react";

export type RangeValue = {
  min?: number;
  max?: number;
  includeAbsent?: boolean;
} | null;

type Props = {
  label: string;
  /** Domain low/high (true bounds used for “default” and emitting null) */
  minBound: number;
  maxBound: number;
  /** Visible window on the bar; can be narrower than bounds */
  minBar: number;
  maxBar: number;
  /** Snap increment (e.g., getStep("temp") = 0.1) */
  step: number;
  /** Parent-controlled value; null = no filter */
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

function stepDecimals(step: number): number {
  // Count decimals needed to represent the step (e.g., 0.1 -> 1, 0.25 -> 2)
  if (!Number.isFinite(step) || step <= 0) return 0;
  let d = 0;
  // Cap at 10 to avoid infinite loops on pathological inputs
  while (d < 10 && Math.round(step * 10 ** d) / 10 ** d !== step) d++;
  return d;
}
function roundToStepDisplay(n: number, step: number): number {
  const d = stepDecimals(step);
  // Snap first, then trim floating error like 2.8000000000000003
  const snapped = snap(n, step);
  return Number(snapped.toFixed(d));
}

function toPct(n: number, lo: number, hi: number) {
  return ((n - lo) / (hi - lo)) * 100;
}
function isNum(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}

const HANDLE_R = 8;

const NumericRangeSlider: React.FC<Props> = ({
  label,
  minBound,
  maxBound,
  minBar,
  maxBar,
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

  // Track whether a change originated from the user (vs prop sync)
  const fromUserRef = React.useRef(false);

  // Sync down from parent
  React.useEffect(() => {
    const v = value ?? null;
    const next: Internal = v
      ? { min: v.min, max: v.max, includeAbsent: Boolean(v.includeAbsent) }
      : { min: undefined, max: undefined, includeAbsent: false };

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
  }, [value, minBound, maxBound]);

  // Notify parent when user commits changes
  React.useEffect(() => {
    if (!fromUserRef.current) return;
    const isDefault =
      internal.min === undefined &&
      internal.max === undefined &&
      internal.includeAbsent === false;
    onChange(isDefault ? null : internal);
    fromUserRef.current = false;
  }, [internal, minBound, maxBound, onChange]);

  const commit = (patch: Partial<Internal>) => {
    fromUserRef.current = true;
    setInternal((prev) => ({ ...prev, ...patch }));
  };

  const { min, max, includeAbsent } = internal;

  // --- slider interactions (confined to visible bar) ---
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const activeHandle = React.useRef<"min" | "max" | null>(null);

  const pxToValue = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return undefined;
    const rect = el.getBoundingClientRect();
    const t = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = minBar + t * (maxBar - minBar);
    return clamp(roundToStepDisplay(raw, step), minBound, maxBound);
  };

  // Choose which handle to move:
  // 1) If min is unset, set min first
  // 2) Else if max is unset, set max
  // 3) Else move the nearest of the two
  const chooseHandle = (v: number): "min" | "max" => {
    if (!isNum(min)) return "min";
    if (!isNum(max)) return "max";
    return Math.abs(v - min) <= Math.abs(v - max) ? "min" : "max";
  };

  const onTrackMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const v = pxToValue(e.clientX);
    if (!isNum(v)) return;
    const which = chooseHandle(v);
    activeHandle.current = which;
    commit({ [which]: roundToStepDisplay(v, step) } as Partial<Internal>);

    const move = (ev: MouseEvent) => {
      const nv = pxToValue(ev.clientX);
      if (!isNum(nv)) return;
      if (activeHandle.current)
        commit({
          [activeHandle.current]: roundToStepDisplay(nv, step),
        } as Partial<Internal>);
    };
    const up = () => {
      activeHandle.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const dragHandle =
    (which: "min" | "max"): React.MouseEventHandler<HTMLDivElement> =>
    (e) => {
      e.stopPropagation();
      activeHandle.current = which;
      const move = (ev: MouseEvent) => {
        const nv = pxToValue(ev.clientX);
        if (!isNum(nv)) return;
        commit({ [which]: nv } as Partial<Internal>);
      };
      const up = () => {
        activeHandle.current = null;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };

  // --- inputs (identical semantics to NumericRange) ---
  const onMinInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    if (raw === "") return commit({ min: undefined });
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    commit({ min: v });
  };
  const onMaxInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value;
    if (raw === "") return commit({ max: undefined });
    const v = Number(raw);
    if (!Number.isFinite(v)) return;
    commit({ max: v });
  };

  // --- visuals ---
  // For visuals, show handles at bounds when undefined; hide if off the visible window.
  const effMin = isNum(min) ? min : minBound;
  const effMax = isNum(max) ? max : maxBound;
  const minPctOnBar = toPct(clamp(effMin, minBar, maxBar), minBar, maxBar);
  const maxPctOnBar = toPct(clamp(effMax, minBar, maxBar), minBar, maxBar);

  const minVisible = effMin >= minBar && effMin <= maxBar;
  const maxVisible = effMax >= minBar && effMax <= maxBar;

  const lo = Math.min(minPctOnBar, maxPctOnBar);
  const hi = Math.max(minPctOnBar, maxPctOnBar);

  // Active if any non-default or includeAbsent
  // Active if any non-default (min/max set) or includeAbsent checked
  const isActive = includeAbsent || isNum(min) || isNum(max);

  // Simple tick labels at integer steps within the visible bar
  const ticks: number[] = [];
  for (let t = Math.ceil(minBar); t <= Math.floor(maxBar); t += 1)
    ticks.push(t);

  return (
    <fieldset
      data-testid={dataTestId}
      aria-label={label}
      className="space-y-3"
    >
      {/* Slider track */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          {/* left fade if bar > domain */}
          {minBar > minBound && (
            <div className="pointer-events-none absolute left-0 top-0 h-2 w-6 bg-gradient-to-r from-gray-300 to-transparent rounded-l" />
          )}
          {/* right fade if bar < domain */}
          {maxBar < maxBound && (
            <div className="pointer-events-none absolute right-0 top-0 h-2 w-6 bg-gradient-to-l from-gray-300 to-transparent rounded-r" />
          )}

          <div
            ref={trackRef}
            onMouseDown={onTrackMouseDown}
            className="relative h-2 w-full rounded bg-gray-200 cursor-pointer select-none"
            aria-label={`${label} slider`}
          >
            {/* selected segment */}
            <div
              className={`absolute top-0 h-2 rounded ${
                isActive ? "bg-blue-600" : "bg-gray-400"
              }`}
              style={{ left: `${lo}%`, width: `${Math.max(0, hi - lo)}%` }}
            />

            {/* min handle (hidden if outside visible window) */}
            {minVisible && (
              <div
                role="slider"
                aria-label={`${label} min handle`}
                aria-valuemin={minBound}
                aria-valuemax={maxBound}
                aria-valuenow={min}
                onMouseDown={dragHandle("min")}
                className={`absolute -top-1 h-4 w-4 rounded-full border ${
                  isActive ? "border-blue-700" : "border-gray-500"
                } bg-white`}
                style={{ left: `calc(${minPctOnBar}% - ${HANDLE_R}px)` }}
              />
            )}

            {/* max handle (hidden if outside visible window) */}
            {maxVisible && (
              <div
                role="slider"
                aria-label={`${label} max handle`}
                aria-valuemin={minBound}
                aria-valuemax={maxBound}
                aria-valuenow={max}
                onMouseDown={dragHandle("max")}
                className={`absolute -top-1 h-4 w-4 rounded-full border ${
                  isActive ? "border-blue-700" : "border-gray-500"
                } bg-white`}
                style={{ left: `calc(${maxPctOnBar}% - ${HANDLE_R}px)` }}
              />
            )}

            {/* tick labels */}
            {ticks.map((t) => {
              const pct = toPct(t, minBar, maxBar);
              return (
                <div
                  key={t}
                  className="absolute -bottom-5 -translate-x-1/2 text-[10px] text-gray-500"
                  style={{ left: `${pct}%` }}
                >
                  {t}
                </div>
              );
            })}
          </div>
        </div>

        {/* Inputs + Include-absent (checkbox to the right) */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            step={step}
            value={min ?? ""}
            onChange={onMinInput}
            className="w-28 rounded border px-2 py-1"
            placeholder={`${minBound}`}
            aria-label={`${label} min`}
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            step={step}
            value={max ?? ""}
            onChange={onMaxInput}
            className="w-28 rounded border px-2 py-1"
            placeholder={`${maxBound}`}
            aria-label={`${label} max`}
          />
          <label className="ml-auto flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={internal.includeAbsent}
              onChange={(e) => commit({ includeAbsent: e.target.checked })}
            />
            Include entries with no value
          </label>
        </div>
      </div>
    </fieldset>
  );
};

export default NumericRangeSlider;
