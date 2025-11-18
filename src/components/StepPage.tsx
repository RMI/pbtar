import React, { useMemo } from "react";

export type StepOption = {
  id: string;
  title: string;
  value: string | number;
  description?: string;
};

/** Unified renderer props for any step (discrete or remap). */
export interface StepRendererProps {
  title: string;
  description?: string;
  options: StepOption[]; // tiles to display
  value: (string | number)[]; // currently selected underlying values
  selectionMode: "single" | "multi"; // click behavior
  mapSelect?: (opt: string | number) => (string | number)[]; // default: identity
  onChange: (next: (string | number)[]) => void; // emit new underlying values
  /** Optional: visual state hook for partial selection */
  getState?: (
    opt: string | number,
    selected: ReadonlySet<string | number>,
  ) => "on" | "partial" | "off";
}

export const StepPageDiscrete: React.FC<StepRendererProps> = ({
  title,
  description,
  options,
  value,
  selectionMode,
  mapSelect,
  onChange,
  getState,
}) => {
  const selectedSet = useMemo(() => new Set(value), [value]);
  const mapFn = mapSelect ?? ((opt: string | number) => [opt]); // identity for pure discrete steps

  const computeState = (opt: string | number): "on" | "partial" | "off" => {
    if (getState) return getState(opt, selectedSet);
    const mapped = mapFn(opt);
    const hits = mapped.filter((v) => selectedSet.has(v)).length;
    if (hits === 0) return "off";
    if (hits === mapped.length) return "on";
    return "partial";
  };

  const handleClick = (opt: string | number) => {
    const mapped = mapFn(opt);
    if (selectionMode === "single") {
      // Replace selection with the mapped values (for discrete, this is `[opt]`)
      onChange(mapped);
      return;
    }
    // Multi: toggle the whole mapped set
    const next = new Set(selectedSet);
    const allSelected = mapped.every((v) => next.has(v));
    if (allSelected) mapped.forEach((v) => next.delete(v));
    else mapped.forEach((v) => next.add(v));
    onChange(Array.from(next));
  };

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-rmigray-800">{title}</h3>
        {description ? <p className="text-rmigray-600">{description}</p> : null}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {options.map((option) => {
          const state = computeState(option.value);
          const selected = state === "on";
          const partial = state === "partial";
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.value)}
              className={`p-4 border rounded-lg transition-colors bg-gray-50 ${
                selected
                  ? "border-energy bg-energy-50"
                  : partial
                    ? "border-energy/50 bg-energy-50/40"
                    : "hover:border-energy hover:bg-energy-50"
              }`}
            >
              <div className="text-sm font-medium text-rmigray-800">
                {option.title}
              </div>
              {option.description && (
                <div className="text-xs text-rmigray-600 mt-1">
                  {option.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
